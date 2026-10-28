import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { DEFAULT_SHOP_DETAILS, parseShopDetails, type ShopDetails } from "@/lib/shop-details";

/** Public SEO data for the page head: Google verification code + shop details for LocalBusiness data. */
export const getSiteSeo = createServerFn({ method: "GET" }).handler(async (): Promise<{ googleVerification: string; shop: ShopDetails }> => {
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return { googleVerification: "", shop: DEFAULT_SHOP_DETAILS };
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
    });
    const [v, c] = await Promise.all([
      db.rpc("gearhead_google_verification"),
      db.from("site_sections").select("contact_details").eq("id", "contact").maybeSingle(),
    ]);
    return { googleVerification: typeof v.data === "string" ? v.data : "", shop: parseShopDetails(c.data?.contact_details) };
  } catch (error) {
    console.error("[seo] load failed", error);
    return { googleVerification: "", shop: DEFAULT_SHOP_DETAILS };
  }
});

export const siteSeoQuery = queryOptions({ queryKey: ["site-seo"], queryFn: () => getSiteSeo(), staleTime: 5 * 60_000 });
