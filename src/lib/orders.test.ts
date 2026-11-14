import { describe, expect, it } from "vitest";
import { newOrderRef, priceOrder } from "./orders";

const buggy = { slug: "buggy", name: "Buggy", scale: "1:8", ask_price: false, selling_price: 45.5 };
const crawler = { slug: "crawler", name: "Crawler", scale: "1:10", ask_price: true, selling_price: 120 };

describe("order pricing (OMR)", () => {
  it("totals confirmed OMR prices × quantity", () => {
    const o = priceOrder([{ slug: "buggy", qty: 2 }], [buggy]);
    expect(o.total_omr).toBe(91);
    expect(o.item_count).toBe(2);
  });

  it("leaves the total open when any item is price on request", () => {
    const o = priceOrder([{ slug: "buggy", qty: 1 }, { slug: "crawler", qty: 1 }], [buggy, crawler]);
    expect(o.total_omr).toBeNull();
    expect(o.items[1].unit_price_omr).toBeNull();
  });

  it("ignores items that are not in the visible catalogue", () => {
    const o = priceOrder([{ slug: "missing", qty: 3 }], [buggy]);
    expect(o.items).toHaveLength(0);
  });

  it("creates GH- order references", () => {
    expect(newOrderRef()).toMatch(/^GH-[A-Z0-9]{6}$/);
  });
});
