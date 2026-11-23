import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import mobileDefault from "@/assets/home-hero-916-v2.jpg";
import desktopDefault from "@/assets/home-hero-169-flag.jpg";
import { SITE_MEDIA_SLOTS, siteMediaQueryKey, useSiteMedia } from "@/lib/site-media";

const DEFAULT_MOBILE = mobileDefault;
const DEFAULT_DESKTOP = desktopDefault;
const DEFAULT_OG = "/og-image.jpg";
const DEFAULT_TITLE = "GearHead RC Hub — A New RC Experience for Oman";
const DEFAULT_DESCRIPTION =
  "Explore Performance RC Cars, Scale Crawlers, Drift & Micro RC, Spare Parts, Tuning & Repairs, and Oman's Premier Indoor RC Track in Bousher, Muscat.";

function imageDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Video could not be read."));
    };
    video.src = url;
  });
}

export function ShopPhotosAdmin() {
  const media = useSiteMedia();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  useEffect(() => {
    if (media.og_title) setTitle(media.og_title);
    if (media.og_description) setDescription(media.og_description);
  }, [media.og_title, media.og_description]);

  const refresh = () => qc.invalidateQueries({ queryKey: siteMediaQueryKey });

  async function saveValue(slot: string, value: string) {
    const { error } = await supabase
      .from("site_media")
      .upsert({ slot, url: value, updated_at: new Date().toISOString() });
    if (error) return toast.error("Could not save: " + error.message);
    toast.success("Saved and published");
    refresh();
  }

  async function upload(slot: string, file: File) {
    const isVideo = slot === "hero_video";
    if (isVideo && !["video/mp4", "video/webm"].includes(file.type))
      return toast.error("Choose an MP4 or WebM video.");
    if (!isVideo && !file.type.startsWith("image/")) return toast.error("Please choose an image.");
    const limit = isVideo ? 20 : 8;
    if (file.size > limit * 1024 * 1024) return toast.error(`File is too large (max ${limit} MB).`);
    if (isVideo) {
      try {
        const duration = await imageDuration(file);
        if (!Number.isFinite(duration) || duration > 10)
          return toast.error("Hero video must be 10 seconds or shorter.");
      } catch {
        return toast.error("Video could not be read. Please choose another file.");
      }
    }
    setBusy(slot);
    const ext = isVideo
      ? file.type === "video/webm"
        ? "webm"
        : "mp4"
      : file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `products/site-${slot}-${Date.now()}.${ext}`;
    const up = await supabase.storage
      .from("gearhead-product-images")
      .upload(path, file, { contentType: file.type });
    if (up.error) {
      setBusy(null);
      return toast.error("Upload failed: " + up.error.message);
    }
    const url = supabase.storage.from("gearhead-product-images").getPublicUrl(path).data.publicUrl;
    const { error } = await supabase
      .from("site_media")
      .upsert({ slot, url, updated_at: new Date().toISOString() });
    setBusy(null);
    if (error) return toast.error("Could not save: " + error.message);
    toast.success(isVideo ? "Hero video updated" : "Photo updated on the live hero");
    refresh();
  }

  async function reset(slot: string) {
    setBusy(slot);
    const { error } = await supabase.from("site_media").delete().eq("slot", slot);
    setBusy(null);
    if (error) return toast.error("Could not remove: " + error.message);
    toast.success("Using the built-in media again");
    refresh();
  }

  const uploadInput = (slot: string, label: string, accept: string, disabled = false) => (
    <label
      className={`inline-flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {busy === slot ? "Saving…" : label}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || busy !== null}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void upload(slot, f);
        }}
      />
    </label>
  );

  const photoCard = (
    slot: string,
    heading: string,
    ratio: string,
    fallback: string,
    buttonText: string,
  ) => (
    <section key={slot} className="rounded-2xl border border-border p-4">
      <h3 className="mb-1 text-sm font-bold">{heading}</h3>
      <p className="mb-3 text-xs text-muted-foreground">Locked preview ratio {ratio}</p>
      <div
        className="mb-3 overflow-hidden rounded-xl border border-border bg-muted"
        style={{ aspectRatio: ratio }}
      >
        <img
          src={media[slot] || fallback}
          alt={`${heading} preview`}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {uploadInput(slot, buttonText, "image/*")}
        {media[slot] && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy !== null}
            onClick={() => void reset(slot)}
          >
            Use default
          </Button>
        )}
      </div>
    </section>
  );

  const extraSlots = SITE_MEDIA_SLOTS.filter(({ slot }) =>
    /^(bg[1-4]|showroom_|video_track|video_service|video_retail)/.test(slot),
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {photoCard(
          "hero_mobile",
          "Mobile Home Screen Hero",
          "9 / 16",
          DEFAULT_MOBILE,
          "Upload / Change Mobile Photo",
        )}
        {photoCard(
          "hero_desktop",
          "Desktop / Laptop Home Screen Hero",
          "16 / 9",
          DEFAULT_DESKTOP,
          "Upload / Change Desktop Photo",
        )}
        <section className="rounded-2xl border border-border p-4">
          <h3 className="mb-1 text-sm font-bold">10-Second Hero Video</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            MP4 or WebM · up to 10 seconds · up to 20 MB
          </p>
          <div className="mb-3 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
            {media.hero_video ? (
              <video
                src={media.hero_video}
                className="h-full w-full object-cover"
                controls
                muted
                playsInline
              />
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No hero video uploaded
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {uploadInput(
              "hero_video",
              media.hero_video ? "Change Video" : "Upload Video",
              "video/mp4,video/webm",
            )}
            <Button
              type="button"
              size="sm"
              variant={media.hero_video_active === "true" ? "default" : "outline"}
              disabled={!media.hero_video || busy !== null}
              onClick={() =>
                void saveValue(
                  "hero_video_active",
                  media.hero_video_active === "true" ? "false" : "true",
                )
              }
            >
              {media.hero_video_active === "true" ? "Active" : "Inactive"}
            </Button>
            {media.hero_video && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy !== null}
                onClick={() => void reset("hero_video")}
              >
                Remove video
              </Button>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-border p-4 sm:col-span-2">
          <h3 className="mb-1 text-sm font-bold">Social & Search Sharing Preview</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Open Graph image · 1200 × 630 (16:9 preview)
          </p>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,.8fr)]">
            <div
              className="overflow-hidden rounded-xl border border-border bg-muted"
              style={{ aspectRatio: "1200 / 630" }}
            >
              <img
                src={media.og_image || DEFAULT_OG}
                alt="Social share preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => void saveValue("og_title", title)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  maxLength={120}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => void saveValue("og_description", description)}
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  maxLength={300}
                />
              </label>
              {uploadInput("og_image", "Upload / Change OG Image", "image/*")}
              {media.og_image && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() => void reset("og_image")}
                >
                  Use default image
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold">Shop Section Photos & Media</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extraSlots.map(({ slot, label, type }) => (
            <section key={slot} className="rounded-2xl border border-border p-4">
              <div className="mb-3 text-sm font-bold">{label}</div>
              <div className="mb-3 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                {media[slot] ? (
                  type === "video" ? (
                    <video
                      src={media[slot]}
                      className="h-full w-full object-cover"
                      controls
                      muted
                    />
                  ) : (
                    <img src={media[slot]} alt={label} className="h-full w-full object-contain" />
                  )
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    Using original {type}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadInput(
                  slot,
                  media[slot] ? `Change ${type}` : `Upload ${type}`,
                  type === "video" ? "video/*" : "image/*",
                )}
                {media[slot] && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy !== null}
                    onClick={() => void reset(slot)}
                  >
                    Use original
                  </Button>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
