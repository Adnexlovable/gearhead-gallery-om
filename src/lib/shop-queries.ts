import { queryOptions } from "@tanstack/react-query";
import { getShopCatalog, getShopProduct } from "@/lib/shop.functions";
import { shopCatalogQueryKey } from "@/lib/shop";
import { FALLBACK_CATALOG, FALLBACK_PRODUCTS } from "@/lib/shop-fallback";

export const shopCatalogQuery = queryOptions({
  queryKey: shopCatalogQueryKey,
  queryFn: async () => {
    try {
      const result = await getShopCatalog();
      return result ?? FALLBACK_CATALOG;
    } catch {
      return FALLBACK_CATALOG;
    }
  },
  staleTime: 60_000,
});

export const shopProductQuery = (slug: string) =>
  queryOptions({
    queryKey: ["shop-product", slug],
    queryFn: async () => {
      try {
        const result = await getShopProduct({ data: { slug } });
        return result ?? FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
      } catch {
        return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
      }
    },
    staleTime: 60_000,
  });
