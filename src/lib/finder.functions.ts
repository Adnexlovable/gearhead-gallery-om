import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getShopCatalog } from "@/lib/shop.functions";
import { PRICE_BAND_LABEL, type ShopProduct } from "@/lib/shop";

export type FinderResult =
  | { ok: true; summary: string; followUp: string | null; matches: (ShopProduct & { reason: string })[] }
  | { ok: false; error: string };

// Public product finder: shoppers describe what they want and Lovable AI picks
// matching items from the live catalogue. Only visible catalogue data is sent.
export const findProducts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ query: z.string().trim().min(3, "Tell us a little more about what you want.").max(500) }).parse(data))
  .handler(async ({ data }): Promise<FinderResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "The product finder is not set up yet." };
    const { categories, products } = await getShopCatalog();
    const catName = new Map(categories.map((c) => [c.slug, c.name]));
    const { recommendProducts, FinderError } = await import("@/lib/ai/finder.server");
    try {
      const answer = await recommendProducts(apiKey, data.query, products.map((p) => ({
        slug: p.slug, name: p.name, category: catName.get(p.category) ?? p.category, scale: p.scale, type: p.type,
        level: PRICE_BAND_LABEL[p.priceBand], inStock: p.inStock, description: p.description, features: p.features,
      })));
      const bySlug = new Map(products.map((p) => [p.slug, p]));
      const seen = new Set<string>();
      const matches = answer.matches.flatMap((m) => {
        const p = bySlug.get(m.slug);
        if (!p || seen.has(m.slug)) return [];
        seen.add(m.slug);
        return [{ ...p, reason: m.reason }];
      }).slice(0, 4);
      return { ok: true, summary: answer.summary, followUp: answer.follow_up, matches };
    } catch (error) {
      if (error instanceof FinderError) return { ok: false, error: error.message };
      return { ok: false, error: "The product finder could not answer right now. Please try again." };
    }
  });
