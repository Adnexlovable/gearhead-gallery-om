import { useEffect, useState } from "react";
import { Clock, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { parseShopDetails, type ShopDetails } from "@/lib/shop-details";

const fields: Array<{ key: keyof ShopDetails; label: string; type?: string }> = [
  { key: "address", label: "Shop address" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "whatsapp", label: "WhatsApp", type: "tel" },
  { key: "email", label: "Contact email", type: "email" },
  { key: "instagram", label: "Instagram link", type: "url" },
  { key: "facebook", label: "Facebook link", type: "url" },
  { key: "tiktok", label: "TikTok link", type: "url" },
];

export function ShopDetailsEditor({ value, onSaved }: { value: unknown; onSaved: () => void }) {
  const [details, setDetails] = useState(() => parseShopDetails(value));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { setDetails(parseShopDetails(value)); }, [value]);
  return (
    <form className="mb-8 border-b border-border pb-8" onSubmit={async (event) => {
      event.preventDefault(); setBusy(true); setMessage("");
      try {
        const clean = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v.trim()]));
        const { data, error } = await supabase.from("site_sections").update({ contact_details: clean }).eq("id", "contact").select("id").single();
        if (error || !data) throw new Error("Unable to save shop details. Please try again.");
        setMessage("Shop details saved."); onSaved();
      } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save shop details."); }
      finally { setBusy(false); }
    }}>
      <div className="mb-5 flex items-center gap-3"><MapPin className="text-gold" size={20} /><h3 className="font-display text-xl font-bold">Shop details</h3></div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(({ key, label, type }) => <label key={key} className={`grid min-w-0 gap-2 ${key === "address" ? "md:col-span-2" : ""}`}>
          <span className="text-xs text-muted-foreground">{label}</span>
          <input type={type ?? "text"} maxLength={500} value={details[key]} onChange={(e) => setDetails({ ...details, [key]: e.target.value })} className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-gold" />
        </label>)}
        <label className="grid gap-2 md:col-span-2"><span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock size={14} />Opening hours</span>
          <textarea rows={4} maxLength={1000} value={details.hours} onChange={(e) => setDetails({ ...details, hours: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-gold" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4"><Button type="submit" disabled={busy}><Save />{busy ? "Saving…" : "Save details"}</Button><p role="status" className="text-sm text-muted-foreground">{message}</p></div>
    </form>
  );
}