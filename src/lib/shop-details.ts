import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_SHOP_DETAILS = {
  address: "GearHead RC, Budha sand dunes, near Al Maha Petrol Station — Bausher, Muscat, Oman",
  phone: "+968 7830 8991",
  whatsapp: "+968 9867 5132",
  hours: "",
  email: "adnant.t636@gmail.com",
  instagram: "",
  facebook: "",
  tiktok: "",
};
export type ShopDetails = typeof DEFAULT_SHOP_DETAILS;
export function parseShopDetails(value: unknown): ShopDetails {
  const result = { ...DEFAULT_SHOP_DETAILS };
  if (value && typeof value === "object") {
    for (const key of Object.keys(result) as Array<keyof ShopDetails>) {
      const field = (value as Record<string, unknown>)[key];
      if (typeof field === "string") result[key] = field;
    }
  }
  return result;
}
export function socialUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch { return undefined; }
}
export function useShopDetails() {
  const [details, setDetails] = useState(DEFAULT_SHOP_DETAILS);
  useEffect(() => {
    let active = true;
    supabase.from("site_sections").select("contact_details").eq("id", "contact").maybeSingle().then(({ data }) => {
      if (active && data) setDetails(parseShopDetails(data.contact_details));
    });
    return () => { active = false; };
  }, []);
  return details;
}