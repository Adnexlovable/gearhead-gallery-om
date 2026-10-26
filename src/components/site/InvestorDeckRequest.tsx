import { useEffect, useState } from "react";
import { Check, FileLock2, X } from "lucide-react";
import { submitEnquiry } from "@/lib/inbox.functions";

const NDA_POINTS = [
  "The deck is shared under a mutual non-disclosure agreement.",
  "It covers concept, operating model and proposed growth phases.",
  "No funding terms or financial forecasts are included in the summary.",
];

export function InvestorDeckRequest({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const ready =
    agreed &&
    name.trim().length >= 2 &&
    contact.trim().length >= 5 &&
    company.trim().length >= 2;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setState("sending");
    try {
      const res = await submitEnquiry({ data: {
      product: "Strategic Investor Deck — NDA request",
      name: name.trim().slice(0, 120),
      contact: contact.trim().slice(0, 120),
      message: [
        company.trim() ? `Company: ${company.trim().slice(0, 160)}` : "",
        message.trim() ? `Note: ${message.trim().slice(0, 1600)}` : "",
        "NDA acknowledged — investor deck requested.",
      ]
        .filter(Boolean)
        .join("\n"),
      } });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const field =
    "mt-1 w-full rounded-sm border border-primary/25 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/70";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-background/85 p-4 backdrop-blur-md sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request the strategic investor deck"
        onClick={(e) => e.stopPropagation()}
        className="executive-card max-h-[88vh] w-full max-w-lg overflow-y-auto p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileLock2 size={18} className="text-primary" />
            <div>
              <div className="font-mono-tag text-[10px] text-primary">
                Confidential · NDA required
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-foreground">
                Request the Strategic Investor Deck
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            data-cursor="hover"
            className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {state === "sent" ? (
          <div className="mt-7 flex items-start gap-3 rounded-sm border border-primary/40 bg-primary/10 p-5 text-sm leading-6 text-foreground">
            <Check size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Request received. Our team will contact you to confirm the NDA and
              share the deck with the strategic overview.
            </span>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3 border-y border-border py-5">
              {NDA_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                  {p}
                </li>
              ))}
            </ul>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="font-mono-tag text-[10px] text-gold-soft" htmlFor="nda-name">
                  Full name
                </label>
                <input
                  id="nda-name"
                  className={field}
                  value={name}
                  maxLength={120}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono-tag text-[10px] text-gold-soft" htmlFor="nda-company">
                  Company / fund
                </label>
                <input
                  id="nda-company"
                  className={field}
                  value={company}
                  maxLength={160}
                  autoComplete="organization"
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono-tag text-[10px] text-gold-soft" htmlFor="nda-contact">
                  Email or WhatsApp
                </label>
                <input
                  id="nda-contact"
                  className={field}
                  value={contact}
                  maxLength={120}
                  autoComplete="email"
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono-tag text-[10px] text-gold-soft" htmlFor="nda-note">
                  What would you like to explore?
                </label>
                <textarea
                  id="nda-note"
                  rows={3}
                  className={field}
                  value={message}
                  maxLength={1600}
                  placeholder="Partnership, distribution, investment…"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-border p-4 text-xs leading-5 text-muted-foreground transition-colors hover:border-primary/40">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I acknowledge the deck is confidential and agree to execute a
                  mutual NDA before it is shared.
                </span>
              </label>

              {state === "error" && (
                <div className="text-xs text-destructive">
                  Couldn’t send the request — please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={!ready || state === "sending"}
                className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state === "sending" ? "Sending…" : "Request the deck"}
              </button>
              <p className="text-[11px] leading-5 text-muted-foreground">
                Submissions are stored in the GearHead inbox for follow-up.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
