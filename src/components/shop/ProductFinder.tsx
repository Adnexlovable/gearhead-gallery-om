import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { findProducts, type FinderResult } from "@/lib/finder.functions";
import { ProductCard } from "@/components/shop/ProductCard";

const EXAMPLES = [
  "A realistic 1:10 crawler for rocky trails",
  "Fast buggy for my teenage son, mid budget",
  "Formula 1 diecast gift for a collector",
  "Something small to drift indoors",
];

export function ProductFinder() {
  const find = useServerFn(findProducts);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FinderResult | null>(null);

  const run = async (text: string) => {
    const q = text.trim();
    if (q.length < 3 || busy) return;
    setBusy(true);
    setResult(null);
    try {
      setResult(await find({ data: { query: q } }));
    } catch {
      setResult({ ok: false, error: "The product finder could not answer right now. Please try again." });
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => { e.preventDefault(); void run(query); };

  return (
    <div className="ghx-finder">
      <form onSubmit={submit} className="ghx-finder-form">
        <label htmlFor="ghx-finder-input" className="sr-only">Describe the RC car, model or budget you want</label>
        <textarea id="ghx-finder-input" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={500} rows={2}
          placeholder="Describe the vehicle, scale model or budget you want…" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void run(query); } }} />
        <button type="submit" className="ghx-btn ghx-btn-primary" disabled={busy || query.trim().length < 3}>
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
          {busy ? "Finding…" : "Find my RC"}
        </button>
      </form>
      <div className="ghx-finder-examples">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="ghx-pill" onClick={() => { setQuery(ex); void run(ex); }} disabled={busy}>{ex}</button>
        ))}
      </div>
      <div aria-live="polite">
        {busy && <p className="ghx-muted mt-5">Looking through the GearHead catalogue…</p>}
        {result && !result.ok && <p className="ghx-finder-error">{result.error}</p>}
        {result && result.ok && (
          <div className="mt-6">
            <p className="ghx-finder-summary">{result.summary}</p>
            {result.matches.length > 0 && (
              <div className="ghx-grid mt-5">
                {result.matches.map((m) => (
                  <div key={m.slug} className="ghx-finder-match">
                    <ProductCard product={m} />
                    <p className="ghx-finder-reason">{m.reason}</p>
                  </div>
                ))}
              </div>
            )}
            {result.followUp && <p className="ghx-muted mt-4">{result.followUp}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
