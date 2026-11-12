import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { toShopCategory, toShopProduct, type ShopCategory, type ShopProduct } from "@/lib/shop";
import { FALLBACK_CATALOG, FALLBACK_PRODUCTS } from "@/lib/shop-fallback";

function publicClient() {
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return null;
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
  } catch {
    return null;
  }
}

const PRODUCT_COLUMNS =
  "slug,name,category,scale,type,description,features,gallery,color_variants,in_stock,price_band,featured,ask_price,selling_price,sort" as const;

export const getShopCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: ShopCategory[]; products: ShopProduct[] }> => {
    try {
      const db = publicClient();
      if (!db) {
        console.warn("[getShopCatalog] No Supabase client — using fallback");
        return FALLBACK_CATALOG;
      }

      const [cats, prods] = await Promise.all([
        db.from("shop_categories").select("slug,name,tagline,description,cover,sort,coming_soon").eq("visible", true).order("sort"),
        db.from("products").select(PRODUCT_COLUMNS).eq("visible", true).not("slug", "is", null).order("sort"),
      ]);

      if (cats.error || prods.error) {
        console.warn("[getShopCatalog] Query error — using fallback", cats.error || prods.error);
        return FALLBACK_CATALOG;
      }

      const categories = (cats.data ?? []).map(toShopCategory);
      const products = (prods.data ?? []).map(toShopProduct);

      if (categories.length === 0 && products.length === 0) {
        console.warn("[getShopCatalog] Empty result — using fallback");
        return FALLBACK_CATALOG;
      }

      return { categories, products };
    } catch (err) {
      console.error("[getShopCatalog] Unexpected error — using fallback", err);
      return FALLBACK_CATALOG;
    }
  },
);

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<ShopProduct | null> => {
    try {
      const db = publicClient();
      if (!db) {
        return FALLBACK_PRODUCTS.find((p) => p.slug === data.slug) ?? null;
      }

      const { data: row, error } = await db.from("products").select(PRODUCT_COLUMNS).eq("visible", true).eq("slug", data.slug).maybeSingle();
      if (error || !row) {
        return FALLBACK_PRODUCTS.find((p) => p.slug === data.slug) ?? null;
      }
      return toShopProduct(row);
    } catch {
      return FALLBACK_PRODUCTS.find((p) => p.slug === data.slug) ?? null;
    }
  });
