import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { toShopCategory, toShopProduct, type ShopCategory, type ShopProduct } from "@/lib/shop";

// Public shop reads use the publishable key and the "public read visible" policies,
// so hidden products/categories never reach anonymous visitors.
function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Shop data is not configured.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const PRODUCT_COLUMNS =
  "slug,name,category,scale,type,description,features,gallery,color_variants,in_stock,price_band,featured,ask_price,selling_price,sort" as const;

export const getShopCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: ShopCategory[]; products: ShopProduct[] }> => {
    const db = publicClient();
    const [cats, prods] = await Promise.all([
      db.from("shop_categories").select("slug,name,tagline,description,cover,sort,coming_soon").eq("visible", true).order("sort"),
      db.from("products").select(PRODUCT_COLUMNS).eq("visible", true).not("slug", "is", null).order("sort"),
    ]);
    if (cats.error) throw new Error("Could not load categories: " + cats.error.message);
    if (prods.error) throw new Error("Could not load products: " + prods.error.message);
    return {
      categories: (cats.data ?? []).map(toShopCategory),
      products: (prods.data ?? []).map(toShopProduct),
    };
  },
);

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<ShopProduct | null> => {
    const db = publicClient();
    const { data: row, error } = await db.from("products").select(PRODUCT_COLUMNS).eq("visible", true).eq("slug", data.slug).maybeSingle();
    if (error) throw new Error("Could not load product: " + error.message);
    return row ? toShopProduct(row) : null;
  });

/** Owner-uploaded site photos (cover, 5 box photos, 4 backgrounds). Empty map = built-in photos. */
export const getSiteMedia = createServerFn({ method: "GET" }).handler(async (): Promise<Record<string, string>> => {
  try {
    const { data } = await publicClient().from("site_media").select("slot,url");
    const out: Record<string, string> = {};
    for (const r of data ?? []) if (r.url) out[r.slot] = r.url;
    return out;
  } catch (error) {
    console.error("[site-media] load failed", error);
    return {};
  }
});

const orderInput = z.object({
  ref: z.string().regex(/^GH-[A-Z0-9]{4,10}$/),
  lines: z.array(z.object({
    slug: z.string().min(1).max(120),
    qty: z.number().int().min(1).max(99),
    color: z.string().max(60).optional(),
  })).min(1).max(50),
});

/** Saves the WhatsApp cart as an order for the admin panel. Prices come from the database, never the browser. */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data }) => {
    const { priceOrder } = await import("@/lib/orders");
    const db = publicClient();
    const slugs = [...new Set(data.lines.map((l) => l.slug))];
    const { data: rows, error } = await db.from("products").select("slug,name,scale,ask_price,selling_price").eq("visible", true).in("slug", slugs);
    if (error) { console.error("[orders] product lookup failed", error); return { ok: false as const }; }
    const priced = priceOrder(data.lines, rows ?? []);
    if (!priced.items.length) return { ok: false as const };
    const { error: insertError } = await db.from("orders").insert({ ref: data.ref, items: priced.items, item_count: priced.item_count, total_omr: priced.total_omr });
    if (insertError) { console.error("[orders] insert failed", insertError); return { ok: false as const }; }
    return { ok: true as const };
  });
