import { queryOptions } from "@tanstack/react-query";
import { getShopCatalog, getShopProduct } from "@/lib/shop.functions";
import { shopCatalogQueryKey } from "@/lib/shop";

export const shopCatalogQuery = queryOptions({
  queryKey: shopCatalogQueryKey,
  queryFn: () => getShopCatalog(),
  staleTime: 60_000,
});

export const shopProductQuery = (slug: string) =>
  queryOptions({
    queryKey: ["shop-product", slug],
    queryFn: () => getShopProduct({ data: { slug } }),
    staleTime: 60_000,
  });
