import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { shopCatalogQuery } from "@/lib/shop-queries";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useQuery(shopCatalogQuery);

  useEffect(() => {
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const cats = useMemo(() => new Map((data?.categories ?? []).map((c) => [c.slug, c.name])), [data]);
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || !data) return [];
    return data.products.filter((p) => {
      const hay = `${p.name} ${p.type} ${p.scale} ${cats.get(p.category) ?? ""} ${p.description}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).slice(0, 12);
  }, [q, data, cats]);

  return (
    <div className="ghx-overlay" role="dialog" aria-modal="true" aria-label="Search products" data-lenis-prevent onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ghx-search-panel">
        <div className="ghx-search-bar">
          <Search size={18} aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search RC cars, crawlers, scales, parts…" aria-label="Search products" />
          <button type="button" onClick={onClose} aria-label="Close search" className="ghx-icon-btn"><X size={18} /></button>
        </div>
        <div className="ghx-search-results">
          {isLoading && <p className="ghx-muted">Loading catalogue…</p>}
          {error && <p className="ghx-muted">Search is unavailable right now.</p>}
          {q && data && !results.length && <p className="ghx-muted">No products match “{q}”. Try a scale like 1:10 or a word like crawler.</p>}
          {!q && <p className="ghx-muted">Try “1:10 crawler”, “drift”, “battery” or “excavator”.</p>}
          {results.map((p) => (
            <Link key={p.slug} to="/product/$productId" params={{ productId: p.slug }} onClick={onClose} className="ghx-search-row">
              {p.gallery[0] && <img src={p.gallery[0]} alt="" width={72} height={48} loading="lazy" />}
              <span className="min-w-0"><strong className="block truncate">{p.name}</strong><small>{cats.get(p.category)} · {p.scale}</small></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
