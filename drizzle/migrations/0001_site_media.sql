CREATE TABLE IF NOT EXISTS public.site_media (
  slot text PRIMARY KEY,
  url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_media TO authenticated;
GRANT ALL ON public.site_media TO service_role;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read media" ON public.site_media;
CREATE POLICY "public read media" ON public.site_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin write media" ON public.site_media;
CREATE POLICY "admin write media" ON public.site_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());