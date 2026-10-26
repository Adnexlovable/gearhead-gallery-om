import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { submitEnquiry } from "@/lib/inbox.functions";

export function EnquiryDialog({ product, onClose }: { product: string | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (product) setState("idle");
  }, [product]);

  if (!product) return null;
  const ready = name.trim().length >= 2 && contact.trim().length >= 5;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !product) return;
    setState("sending");
    try {
      const res = await submitEnquiry({
        data: {
          product: product.slice(0, 200),
          name: name.trim().slice(0, 120),
          contact: contact.trim().slice(0, 120),
          message: message.trim().slice(0, 2000) || undefined,
        },
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const input = "mt-1 w-full rounded-lg border border-gold/20 bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60";

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Enquire about ${product}`} onClick={(e) => e.stopPropagation()} className="vitrine w-full max-w-md p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono-tag text-[10px] text-gold-soft">Product enquiry</div>
            <h3 className="mt-1 font-display text-xl font-bold text-foreground">{product}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" data-cursor="hover" className="text-muted-foreground hover:text-gold"><X size={20} /></button>
        </div>
        {state === "sent" ? (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
            <Check size={18} className="mt-0.5 text-gold" /> Thanks — our curator will reply about this piece shortly.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div><label className="font-mono-tag text-[10px] text-gold-soft">Full name</label><input className={input} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="font-mono-tag text-[10px] text-gold-soft">Email or WhatsApp</label><input className={input} value={contact} maxLength={120} onChange={(e) => setContact(e.target.value)} /></div>
            <div><label className="font-mono-tag text-[10px] text-gold-soft">Question</label><textarea rows={3} className={input} value={message} maxLength={2000} onChange={(e) => setMessage(e.target.value)} placeholder="Availability, condition, delivery…" /></div>
            {state === "error" && <div className="text-xs text-destructive">Couldn't send — please try again.</div>}
            <button disabled={!ready || state === "sending"} className="btn-gold w-full disabled:opacity-40">{state === "sending" ? "Sending…" : "Send enquiry"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
