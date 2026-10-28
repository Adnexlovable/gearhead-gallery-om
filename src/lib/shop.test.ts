import { describe, expect, it } from "vitest";
import { cartWhatsAppURL, productWhatsAppURL, toShopProduct } from "./shop";

const row = {
  slug: "trx4-defender", name: "Defender", category: "crawlers", scale: "1:10", type: "Scale", description: "",
  features: [], gallery: [], color_variants: [], in_stock: true, price_band: "premium", featured: false,
  ask_price: true, selling_price: 120,
};

describe("shop rules", () => {
  it("sends WhatsApp orders to +968 9867 5132", () => {
    expect(cartWhatsAppURL([{ slug: "a", name: "Buggy", scale: "1:8", qty: 2 }])).toMatch(/^https:\/\/wa\.me\/96898675132\?text=/);
    expect(productWhatsAppURL({ name: "Buggy", scale: "1:8" })).toMatch(/^https:\/\/wa\.me\/96898675132\?text=/);
  });

  it("lists every cart item with its quantity in the WhatsApp message", () => {
    const text = decodeURIComponent(cartWhatsAppURL([{ slug: "a", name: "Buggy", scale: "1:8", qty: 2, color: "Red" }]).split("text=")[1]);
    expect(text).toContain("Buggy (1:8) — Red × 2");
  });

  it("hides the price while the owner keeps price on request", () => {
    expect(toShopProduct(row).price).toBeNull();
  });

  it("shows the owner's confirmed selling price when price on request is off", () => {
    expect(toShopProduct({ ...row, ask_price: false, selling_price: 120 }).price).toBe(120);
  });
});
