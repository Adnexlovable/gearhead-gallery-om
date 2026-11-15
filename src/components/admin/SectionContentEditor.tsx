import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSiteSections } from "@/lib/site-media";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const HOME_SECTIONS = [
  { id: "catalog", label: "Explore the RC world." },
  { id: "foundation", label: "Built for real RC adventure." },
  { id: "experience-detail", label: "The shop experience." },
] as const;

export function SectionContentEditor() {
  const rows = useSiteSections();
  const qc = useQueryClient();
  return <div className="space-y-4">{HOME_SECTIONS.map((s) => {
    const saved = rows.find((r) => r.id === s.id);
    return <Editor key={`${s.id}-${saved?.label}-${saved?.note}-${saved?.visible}`} id={s.id} title={saved?.label ?? s.label} note={saved?.note ?? ""} visible={saved?.visible ?? true} onSave={async (label, note, visible) => {
      const { error } = await supabase.from("site_sections").upsert({ id: s.id, label, note, visible });
      if (error) return toast.error("Could not save section");
      await qc.invalidateQueries({ queryKey: ["site-sections"] }); toast.success("Section saved");
    }} />;
  })}</div>;
}

function Editor({ id, title, note, visible, onSave }: { id: string; title: string; note: string; visible: boolean; onSave: (title: string, note: string, visible: boolean) => Promise<void> }) {
  const [d, setD] = useState({ title, note, visible });
  const [busy, setBusy] = useState(false);
  const cls = "w-full rounded-md border border-border bg-background/60 p-3 text-foreground";
  return <form className="vitrine grid gap-3 p-5" onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { await onSave(d.title, d.note, d.visible); } finally { setBusy(false); } }}>
    <span className="text-xs uppercase text-gold">{id === "catalog" ? "Inventory Blueprint" : id === "foundation" ? "Showroom Design Concept" : "Showroom sections"}</span>
    <label className="grid gap-2 text-sm">Title<input required maxLength={120} className={cls} value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} /></label>
    <label className="grid gap-2 text-sm">Description<textarea maxLength={1200} className={cls} value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} /></label>
    <div className="flex items-center justify-between"><label className="flex gap-2 text-sm"><input type="checkbox" checked={d.visible} onChange={(e) => setD({ ...d, visible: e.target.checked })} />Visible</label><Button type="submit" disabled={busy}><Save />Save section</Button></div>
  </form>;
}