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

const emptyCatalog = { categories: [] as ShopCategory[], products: [] as ShopProduct[] };

export const getShopCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: ShopCategory[]; products: ShopProduct[] }> => {
    try {
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
    } catch (err) {
      console.error("[getShopCatalog] Supabase error, returning empty catalog:", err);
      return emptyCatalog;
    }
  },
);

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<ShopProduct | null> => {
    try {
      const db = publicClient();
      const { data: row, error } = await db.from("products").select(PRODUCT_COLUMNS).eq("visible", true).eq("slug", data.slug).maybeSingle();
      if (error) throw new Error("Could not load product: " + error.message);
      return row ? toShopProduct(row) : null;
    } catch (err) {
      console.error("[getShopProduct] Supabase error, returning null:", err);
      return null;
    }
  });
