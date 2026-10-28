// Client-safe shop types and helpers. The catalogue lives in the database
// (public.products + public.shop_categories) and is edited from the admin dashboard.

export const WHATSAPP_NUMBER = "96898675132";

export type ShopCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cover: string;
  comingSoon: boolean;
};

export type ColorVariant = { name: string; hex: string; image?: string };

export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  scale: string;
  type: string;
  description: string;
  features: string[];
  gallery: string[];
  colors: ColorVariant[];
  inStock: boolean;
  priceBand: "entry" | "mid" | "premium";
  featured: boolean;
  price: number | null;
};

export const PRICE_BAND_LABEL: Record<ShopProduct["priceBand"], string> = {
  entry: "Entry level",
  mid: "Mid range",
  premium: "Premium",
};

const strings = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.length > 0) : []);

export function toShopCategory(row: {
  slug: string; name: string; tagline: string; description: string; cover: string; coming_soon: boolean;
}): ShopCategory {
  return { slug: row.slug, name: row.name, tagline: row.tagline, description: row.description, cover: row.cover, comingSoon: row.coming_soon };
}

export function toShopProduct(row: {
  slug: string | null; name: string; category: string; scale: string; type: string; description: string;
  features: unknown; gallery: unknown; color_variants: unknown; in_stock: boolean; price_band: string;
  featured: boolean; ask_price: boolean; selling_price: number | null;
}): ShopProduct {
  const colors = Array.isArray(row.color_variants)
    ? row.color_variants.flatMap((c) => {
        if (!c || typeof c !== "object") return [];
        const v = c as Record<string, unknown>;
        if (typeof v.name !== "string" || typeof v.hex !== "string") return [];
        return [{ name: v.name, hex: v.hex, image: typeof v.image === "string" ? v.image : undefined }];
      })
    : [];
  const band = row.price_band === "entry" || row.price_band === "premium" ? row.price_band : "mid";
  return {
    slug: row.slug ?? "",
    name: row.name,
    category: row.category,
    scale: row.scale,
    type: row.type,
    description: row.description,
    features: strings(row.features),
    gallery: strings(row.gallery),
    colors,
    inStock: row.in_stock,
    priceBand: band,
    featured: row.featured,
    // A price is shown only when the owner has entered a confirmed selling price.
    price: !row.ask_price && row.selling_price && row.selling_price > 0 ? Number(row.selling_price) : null,
  };
}

export function productWhatsAppURL(product: Pick<ShopProduct, "name" | "scale">, color?: string) {
  const text = `Hello GearHead RC Hub. I'm interested in ${product.name} (${product.scale})${color ? `, colour: ${color}` : ""}. Please confirm availability and price.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export type CartLine = { slug: string; name: string; scale: string; qty: number; color?: string };

export function cartWhatsAppText(lines: CartLine[], ref?: string) {
  const items = lines.map((l, i) => `${i + 1}. ${l.name} (${l.scale})${l.color ? ` — ${l.color}` : ""} × ${l.qty}`);
  return ["Hello GearHead RC Hub, I would like to order:", ...(ref ? [`Order ref: ${ref}`] : []), ...items, "Please confirm availability, price and pickup/delivery."].join("\n");
}

export function cartWhatsAppURL(lines: CartLine[], ref?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cartWhatsAppText(lines, ref))}`;
}

export const shopCatalogQueryKey = ["shop-catalog"] as const;
