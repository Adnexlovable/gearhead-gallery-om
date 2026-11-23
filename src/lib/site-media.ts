import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SITE_MEDIA_SLOTS = [
  { slot: "hero_mobile", label: "Mobile home hero", type: "image" },
  { slot: "hero_desktop", label: "Desktop home hero", type: "image" },
  { slot: "hero_video", label: "Home hero video", type: "video" },
  { slot: "hero_video_active", label: "Home hero video active", type: "setting" },
  { slot: "og_image", label: "Social preview image", type: "image" },
  { slot: "og_title", label: "Social preview title", type: "setting" },
  { slot: "og_description", label: "Social preview description", type: "setting" },
  { slot: "bg1", label: "Background photo 1", type: "image" },
  { slot: "bg2", label: "Background photo 2", type: "image" },
  { slot: "bg3", label: "Background photo 3", type: "image" },
  { slot: "bg4", label: "Background photo 4", type: "image" },
  { slot: "showroom_design", label: "Showroom design concept", type: "image" },
  { slot: "showroom_track", label: "Showroom indoor track", type: "image" },
  { slot: "showroom_retail", label: "Showroom retail display", type: "image" },
  { slot: "showroom_terrain", label: "Showroom terrain", type: "image" },
  { slot: "showroom_service", label: "Showroom service", type: "image" },
  { slot: "video_track", label: "Home video: Indoor track", type: "video" },
  { slot: "video_service", label: "Home video: Service bench", type: "video" },
  { slot: "video_retail", label: "Home video: Display racks", type: "video" },
] as const;

export const siteMediaQueryKey = ["site-media"] as const;

export async function fetchSiteMedia(): Promise<Record<string, string>> {
  const { data } = await supabase.from("site_media").select("slot,url");
  const out: Record<string, string> = {};
  for (const r of data ?? []) if (r.url) out[r.slot] = r.url;
  return out;
}

/** Owner-uploaded shop photos & videos; empty map means "use the built-in media". */
export function useSiteMedia() {
  return (
    useQuery({ queryKey: siteMediaQueryKey, queryFn: fetchSiteMedia, staleTime: 60_000 }).data ?? {}
  );
}

/** CSS variables for the shop wrapper so custom background photos replace the defaults. */
export function useSiteSections() {
  return (
    useQuery({
      queryKey: ["site-sections"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("site_sections")
          .select("id,label,visible,note");
        if (error) throw error;
        return data ?? [];
      },
      staleTime: 0,
    }).data ?? []
  );
}

export function siteMediaStyle(media: Record<string, string>): React.CSSProperties {
  const s: Record<string, string> = {};
  for (const k of ["bg1", "bg2", "bg3", "bg4"])
    if (media[k]) s[`--ghx-${k}`] = `url("${media[k]}")`;
  return s as React.CSSProperties;
}
