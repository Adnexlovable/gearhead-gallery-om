import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SITE_MEDIA_SLOTS, siteMediaQueryKey, useSiteMedia } from "@/lib/site-media";

export function ShopPhotosAdmin() {
  const media = useSiteMedia();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: siteMediaQueryKey });

  async function upload(slot: string, file: File) {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return toast.error("Please choose a photo or video.");
    if (file.size > (isVideo ? 50 : 8) * 1024 * 1024) return toast.error(isVideo ? "Video is too big (max 50 MB)." : "Photo is too big (max 8 MB).");
    setBusy(slot);
    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const path = `products/site-${slot}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("gearhead-product-images").upload(path, file, { contentType: file.type });
    if (up.error) { setBusy(null); return toast.error("Upload failed: " + up.error.message); }
    const url = supabase.storage.from("gearhead-product-images").getPublicUrl(path).data.publicUrl;
    const { error } = await supabase.from("site_media").upsert({ slot, url, updated_at: new Date().toISOString() });
    setBusy(null);
    if (error) return toast.error("Could not save: " + error.message);
    toast.success(isVideo ? "Video updated" : "Photo updated");
    refresh();
  }

  async function reset(slot: string) {
    setBusy(slot);
    const { error } = await supabase.from("site_media").delete().eq("slot", slot);
    setBusy(null);
    if (error) return toast.error("Could not remove: " + error.message);
    toast.success("Back to the original");
    refresh();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SITE_MEDIA_SLOTS.map(({ slot, label, type }) => (
        <div key={slot} className="rounded-2xl border border-border p-4">
          <div className="mb-3 text-sm font-bold">{label}</div>
          <div className="mb-3 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
            {media[slot] ? (
              type === "video" ? (
                <video src={media[slot]} className="h-full w-full object-cover" controls muted />
              ) : (
                <img src={media[slot]} alt={label} className="h-full w-full object-cover" />
              )
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">Using the original {type}</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
              {busy === slot ? "Saving…" : media[slot] ? `Change ${type}` : `Upload ${type}`}
              <input type="file" accept={type === "video" ? "video/*" : "image/*"} className="sr-only" disabled={busy !== null}
                onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(slot, f); }} />
            </label>
            {media[slot] && <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => reset(slot)}>Use original</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}
