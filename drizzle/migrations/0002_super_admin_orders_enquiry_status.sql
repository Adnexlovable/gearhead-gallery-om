-- 1) Super admin: only the verified shop owner email may hold the admin role.
CREATE OR REPLACE FUNCTION public.gearhead_super_admin_email()
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public
AS $$ SELECT 'adkinadnexsolution@gmail.com'::text $$;

CREATE OR REPLACE FUNCTION public.gearhead_is_super_admin_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = _user_id
      AND u.email_confirmed_at IS NOT NULL
      AND lower(u.email) = public.gearhead_super_admin_email()
  )
$$;
REVOKE EXECUTE ON FUNCTION public.gearhead_is_super_admin_user(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.gearhead_grant_super_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = public.gearhead_super_admin_email() THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = NEW.id AND role = 'admin';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS gearhead_super_admin_on_create ON auth.users;
CREATE TRIGGER gearhead_super_admin_on_create
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.gearhead_grant_super_admin();

DROP TRIGGER IF EXISTS gearhead_super_admin_on_change ON auth.users;
CREATE TRIGGER gearhead_super_admin_on_change
AFTER UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
EXECUTE FUNCTION public.gearhead_grant_super_admin();

CREATE OR REPLACE FUNCTION public.gearhead_guard_admin_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' AND NOT public.gearhead_is_super_admin_user(NEW.user_id) THEN
    RAISE EXCEPTION 'Admin access is reserved for the shop super admin';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS gearhead_guard_admin_role ON public.user_roles;
CREATE TRIGGER gearhead_guard_admin_role
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.gearhead_guard_admin_role();

-- Remove admin from anyone who is not the verified super admin, then grant it if that account already exists.
DELETE FROM public.user_roles r
WHERE r.role = 'admin' AND NOT public.gearhead_is_super_admin_user(r.user_id);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin' FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL AND lower(u.email) = public.gearhead_super_admin_email()
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Enquiries: status + quoted price managed by the admin.
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS quoted_price_omr numeric;

DROP POLICY IF EXISTS "anyone can enquire" ON public.enquiries;
CREATE POLICY "anyone can enquire" ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  read = false AND status = 'new' AND quoted_price_omr IS NULL
  AND length(name) BETWEEN 2 AND 120
  AND length(contact) BETWEEN 5 AND 120
  AND length(product) BETWEEN 1 AND 200
  AND COALESCE(length(message), 0) <= 2000
);

-- 3) Orders sent from the WhatsApp cart, managed in the admin panel.
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ref text NOT NULL UNIQUE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  item_count integer NOT NULL DEFAULT 0,
  total_omr numeric,
  status text NOT NULL DEFAULT 'new',
  customer_name text NOT NULL DEFAULT '',
  customer_contact text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
CREATE POLICY "anyone can place order" ON public.orders
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new' AND read = false
  AND length(ref) BETWEEN 4 AND 20
  AND jsonb_typeof(items) = 'array'
  AND jsonb_array_length(items) BETWEEN 1 AND 50
  AND item_count BETWEEN 1 AND 5000
  AND customer_name = '' AND customer_contact = '' AND notes = ''
  AND (total_omr IS NULL OR total_omr >= 0)
);

DROP POLICY IF EXISTS "admin read orders" ON public.orders;
CREATE POLICY "admin read orders" ON public.orders FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin update orders" ON public.orders;
CREATE POLICY "admin update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin delete orders" ON public.orders;
CREATE POLICY "admin delete orders" ON public.orders FOR DELETE TO authenticated USING (public.is_admin());

DROP TRIGGER IF EXISTS gearhead_orders_touch ON public.orders;
CREATE TRIGGER gearhead_orders_touch BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.gearhead_set_product_updated_at();