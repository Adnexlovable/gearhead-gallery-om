import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SITE_MEDIA_SLOTS, siteMediaQueryKey, useSiteMedia } from "@/lib/site-media";

const GROUPS = ["Cover", "5 boxes", "Backgrounds"] as const;

export function ShopPhotosAdmin() {
  const media = useSiteMedia();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: siteMediaQueryKey });

  async function upload(slot: string, file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please choose a photo.");
    if (file.size > 8 * 1024 * 1024) return toast.error("Photo is too big (max 8 MB).");
    setBusy(slot);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `products/site-${slot}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("gearhead-product-images").upload(path, file, { contentType: file.type });
    if (up.error) { setBusy(null); return toast.error("Upload failed: " + up.error.message); }
    const url = supabase.storage.from("gearhead-product-images").getPublicUrl(path).data.publicUrl;
    const { error } = await supabase.from("site_media").upsert({ slot, url, updated_at: new Date().toISOString() });
    setBusy(null);
    if (error) return toast.error("Could not save: " + error.message);
    toast.success("Photo updated — live on the website now");
    void refresh();
  }

  async function reset(slot: string) {
    setBusy(slot);
    const { error } = await supabase.from("site_media").delete().eq("slot", slot);
    setBusy(null);
    if (error) return toast.error("Could not remove: " + error.message);
    toast.success("Back to the original photo");
    void refresh();
  }

  return (
    <div className="space-y-8">
      {GROUPS.map((group) => (
        <div key={group}>
          <div className="mb-3 font-mono-tag text-[10px] uppercase text-gold-soft">{group}</div>
          <div className={`grid gap-4 ${group === "Cover" ? "sm:grid-cols-[minmax(0,320px)]" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {SITE_MEDIA_SLOTS.filter((s) => s.group === group).map(({ slot, label, hint }) => (
              <div key={slot} className="vitrine min-w-0 p-4">
                <div className="text-sm font-bold text-foreground">{label}</div>
                <div className="mb-3 text-xs text-muted-foreground">{hint}</div>
                {/* Whole photo shown — never cropped */}
                <div className={`mb-3 overflow-hidden rounded-xl border border-gold/20 bg-surface ${slot === "hero" ? "aspect-[9/16]" : "aspect-video"}`}>
                  {media[slot] ? <img src={media[slot]} alt={label} className="h-full w-full object-contain" /> :
                    <div className="grid h-full place-items-center px-3 text-center text-xs text-muted-foreground">Using the original photo</div>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="btn-gold inline-flex cursor-pointer items-center !px-4 !py-2 !text-[10px]">
                    {busy === slot ? "Saving…" : media[slot] ? "Change photo" : "Upload photo"}
                    <input type="file" accept="image/*" className="sr-only" disabled={busy !== null}
                      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(slot, f); }} />
                  </label>
                  {media[slot] && <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => reset(slot)}>Use original</Button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
