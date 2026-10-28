import { useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/shop";

// WhatsApp order cart kept in the shopper's browser. No payment is taken online.
const KEY = "gh-cart-v1";
const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    if (Array.isArray(parsed)) {
      lines = parsed.filter((l) => l && typeof l.slug === "string" && typeof l.name === "string" && Number(l.qty) > 0)
        .map((l) => ({ slug: l.slug, name: l.name, scale: String(l.scale ?? ""), qty: Math.min(99, Math.floor(Number(l.qty))), color: typeof l.color === "string" ? l.color : undefined }));
    }
  } catch { lines = EMPTY; }
}

function save(next: CartLine[]) {
  lines = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
}

const lineKey = (l: Pick<CartLine, "slug" | "color">) => l.slug + "|" + (l.color ?? "");

export function addToCart(item: Omit<CartLine, "qty">, qty = 1) {
  load();
  const existing = lines.find((l) => lineKey(l) === lineKey(item));
  save(existing
    ? lines.map((l) => (l === existing ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
    : [...lines, { ...item, qty: Math.min(99, Math.max(1, qty)) }]);
}

export function setCartQty(item: Pick<CartLine, "slug" | "color">, qty: number) {
  load();
  save(qty <= 0 ? lines.filter((l) => lineKey(l) !== lineKey(item)) : lines.map((l) => (lineKey(l) === lineKey(item) ? { ...l, qty: Math.min(99, qty) } : l)));
}

export function clearCart() { save(EMPTY); }

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { loaded = false; load(); cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useCart() {
  return useSyncExternalStore(subscribe, () => { load(); return lines; }, () => EMPTY);
}

export function useCartCount() {
  return useCart().reduce((n, l) => n + l.qty, 0);
}
