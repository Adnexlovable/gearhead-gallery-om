CREATE TABLE IF NOT EXISTS public.shop_categories (
  slug text PRIMARY KEY,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover text NOT NULL DEFAULT '',
  sort integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  coming_soon boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shop_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_categories TO authenticated;
GRANT ALL ON public.shop_categories TO service_role;
ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read visible categories" ON public.shop_categories;
CREATE POLICY "public read visible categories" ON public.shop_categories FOR SELECT TO anon, authenticated USING (visible OR public.is_admin());
DROP POLICY IF EXISTS "admin write categories" ON public.shop_categories;
CREATE POLICY "admin write categories" ON public.shop_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_band text NOT NULL DEFAULT 'mid';
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON public.products (slug);