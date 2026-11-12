import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SITE_MEDIA_SLOTS = [
  { slot: "hero", label: "Cover photo (shop home)", type: "image" },
  { slot: "bg1", label: "Background photo 1", type: "image" },
  { slot: "bg2", label: "Background photo 2", type: "image" },
  { slot: "bg3", label: "Background photo 3", type: "image" },
  { slot: "bg4", label: "Background photo 4", type: "image" },
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
  return useQuery({ queryKey: siteMediaQueryKey, queryFn: fetchSiteMedia, staleTime: 60_000 }).data ?? {};
}

/** CSS variables for the shop wrapper so custom background photos replace the defaults. */
export function siteMediaStyle(media: Record<string, string>): React.CSSProperties {
  const s: Record<string, string> = {};
  for (const k of ["bg1", "bg2", "bg3", "bg4"]) if (media[k]) s[`--ghx-${k}`] = `url("${media[k]}")`;
  return s as React.CSSProperties;
}
