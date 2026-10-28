ALTER TABLE public.search_console_settings ADD COLUMN IF NOT EXISTS google_verification text NOT NULL DEFAULT '';

-- Public read of ONLY the verification code (it is meant to be public in the page head); other settings stay admin-only.
CREATE OR REPLACE FUNCTION public.gearhead_google_verification()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COALESCE((SELECT google_verification FROM public.search_console_settings WHERE id = 'primary'), '') $$;
GRANT EXECUTE ON FUNCTION public.gearhead_google_verification() TO anon, authenticated;