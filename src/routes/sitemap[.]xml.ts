import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";

async function shopPaths() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { categories: [] as string[], products: [] as string[] };
  const db = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
  });
  const [c, p] = await Promise.all([
    db.from("shop_categories").select("slug").eq("visible", true),
    db.from("products").select("slug").eq("visible", true).not("slug", "is", null),
  ]);
  return { categories: (c.data ?? []).map((r) => r.slug), products: (p.data ?? []).flatMap((r) => (r.slug ? [r.slug] : [])) };
}

// TODO: If empty, configure the public site origin before publishing.
const BASE_URL = "https://gearheadrc.store";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        if (!BASE_URL) {
          return new Response("Sitemap domain not configured", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        // Shop category and product pages from the live catalogue.
        const shop = await shopPaths();
        for (const category of shop.categories) {
          const path = sitemapPathForLocation(router, router.buildLocation({ to: "/collection/$category", params: { category } }), "/collection/$category");
          if (path) entries.push({ path });
        }
        for (const productId of shop.products) {
          const path = sitemapPathForLocation(router, router.buildLocation({ to: "/product/$productId", params: { productId } }), "/product/$productId");
          if (path) entries.push({ path });
        }
        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
