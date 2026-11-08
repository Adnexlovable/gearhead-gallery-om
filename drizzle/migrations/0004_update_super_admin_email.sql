-- Switch the single verified super-admin email to adnexadmin@gmail.com.
CREATE OR REPLACE FUNCTION public.gearhead_super_admin_email()
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public
AS $$ SELECT 'adnexadmin@gmail.com'::text $$;

-- Re-evaluate existing accounts: grant admin to the new whitelisted email,
-- remove it from any account that no longer matches.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL AND lower(u.email) = public.gearhead_super_admin_email()
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_roles r
USING auth.users u
WHERE r.user_id = u.id AND r.role = 'admin'::public.app_role
  AND (u.email_confirmed_at IS NULL OR lower(u.email) <> public.gearhead_super_admin_email());