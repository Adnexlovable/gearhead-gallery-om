// Order pricing for WhatsApp cart orders. OMR uses 3 decimals (baisa).

export type OrderLineInput = { slug: string; qty: number; color?: string };
export type OrderProduct = { slug: string | null; name: string; scale: string; ask_price: boolean; selling_price: number | null };
export type OrderItem = {
  slug: string; name: string; scale: string; color: string | null; qty: number;
  unit_price_omr: number | null; line_total_omr: number | null;
};

export const ORDER_STATUSES = ["new", "confirmed", "ready", "completed", "cancelled"] as const;
export const ENQUIRY_STATUSES = ["new", "replied", "quoted", "won", "closed"] as const;

export const roundOMR = (n: number) => Math.round(n * 1000) / 1000;

/** Only the owner's confirmed selling price counts; "price on request" items leave the total open (null). */
export function priceOrder(lines: OrderLineInput[], products: OrderProduct[]) {
  const bySlug = new Map(products.filter((p) => p.slug).map((p) => [p.slug as string, p]));
  const items: OrderItem[] = [];
  for (const l of lines) {
    const p = bySlug.get(l.slug);
    if (!p) continue;
    const unit = !p.ask_price && p.selling_price != null && Number(p.selling_price) > 0 ? Number(p.selling_price) : null;
    items.push({
      slug: l.slug, name: p.name, scale: p.scale, color: l.color ?? null, qty: l.qty,
      unit_price_omr: unit, line_total_omr: unit == null ? null : roundOMR(unit * l.qty),
    });
  }
  const item_count = items.reduce((n, i) => n + i.qty, 0);
  const total_omr = items.length && items.every((i) => i.line_total_omr != null)
    ? roundOMR(items.reduce((n, i) => n + (i.line_total_omr ?? 0), 0))
    : null;
  return { items, item_count, total_omr };
}

export function newOrderRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return "GH-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export const formatOMR = (n: number | null | undefined) => (n == null ? "Price to confirm" : `OMR ${Number(n).toFixed(3)}`);
