import shareCover from "@/assets/pwa/share-cover.jpg.asset.json";
import type { ShopDetails } from "@/lib/shop-details";

export const SITE_URL = "https://gearheadrc.store";
export const SITE_NAME = "GearHead RC Hub";
export const SHARE_IMAGE = `${SITE_URL}${shareCover.url}`;

/** Full Open Graph + Twitter card tags for one page (share cover 1200x630, shown whole). */
export function shareMeta(path: string, title: string, description: string, type: "website" | "product" = "website") {
  const url = `${SITE_URL}${path}`;
  return [
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:url", content: url },
    { property: "og:image", content: SHARE_IMAGE },
    { property: "og:image:secure_url", content: SHARE_IMAGE },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "GearHead RC Hub logo, title and RC crawler — A brand of Adnex.World" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: SHARE_IMAGE },
    { name: "twitter:image:alt", content: "GearHead RC Hub — A brand of Adnex.World" },
  ];
}

/** Google verification codes: accepts the full <meta …> tag or just the code. */
export function verificationCode(input: string) {
  const m = input.match(/content\s*=\s*["']([^"']+)["']/i);
  const code = (m ? m[1] : input).trim();
  return /^[A-Za-z0-9_-]{10,100}$/.test(code) ? code : "";
}

/** LocalBusiness structured data from the saved shop details (no invented hours). */
export function localBusinessJsonLd(shop: ShopDetails, logoUrl: string) {
  const sameAs = [shop.instagram, shop.facebook, shop.tiktok].filter((u) => /^https:\/\//.test(u));
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HobbyShop"],
    name: SITE_NAME,
    alternateName: "GearHead RC",
    url: SITE_URL,
    image: SHARE_IMAGE,
    logo: `${SITE_URL}${logoUrl}`,
    description: "RC cars, scale crawlers, diecast models, spare parts, service and an indoor RC track in Bausher, Muscat, Oman.",
    telephone: shop.phone || undefined,
    email: shop.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address || "Budha sand dunes, near Al Maha Petrol Station",
      addressLocality: "Bausher",
      addressRegion: "Muscat",
      addressCountry: "OM",
    },
    areaServed: "Muscat, Oman",
    currenciesAccepted: "OMR",
    parentOrganization: { "@type": "Organization", name: "Adnex.World", url: "https://adnex.world" },
    sameAs: sameAs.length ? sameAs : undefined,
  };
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
