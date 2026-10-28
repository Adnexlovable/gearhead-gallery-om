import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSiteMedia } from "@/lib/shop.functions";

/** Owner-replaceable photos. Empty slot = the built-in photo, so nothing breaks. */
export const SITE_MEDIA_SLOTS = [
  { slot: "hero", group: "Cover", label: "Home cover (/ and /app)", hint: "Tall 9:16 photo, shown whole. The bottom quarter sits under the 2 buttons + 5 boxes." },
  { slot: "tile_cars", group: "5 boxes", label: "Box: RC CARS", hint: "Square photo works best." },
  { slot: "tile_crawlers", group: "5 boxes", label: "Box: CRAWLERS", hint: "Square photo works best." },
  { slot: "tile_parts", group: "5 boxes", label: "Box: SPARE PARTS", hint: "Square photo works best." },
  { slot: "tile_service", group: "5 boxes", label: "Box: SERVICE", hint: "Square photo works best." },
  { slot: "tile_track", group: "5 boxes", label: "Box: INDOOR TRACK", hint: "Square photo works best." },
  { slot: "bg1", group: "Backgrounds", label: "Background 1 · track / floor", hint: "Wide shop photo behind page sections." },
  { slot: "bg2", group: "Backgrounds", label: "Background 2 · counter", hint: "Wide shop photo behind page sections." },
  { slot: "bg3", group: "Backgrounds", label: "Background 3 · service room", hint: "Wide shop photo behind page sections." },
  { slot: "bg4", group: "Backgrounds", label: "Background 4 · shelves", hint: "Wide shop photo behind page sections." },
] as const;

export const siteMediaQueryKey = ["site-media"] as const;

export const siteMediaQuery = queryOptions({
  queryKey: siteMediaQueryKey,
  queryFn: () => getSiteMedia(),
  staleTime: 30_000,
});

export function useSiteMedia(): Record<string, string> {
  return useQuery(siteMediaQuery).data ?? {};
}

/** CSS variables for the shop wrapper so custom background photos replace the defaults. */
export function siteMediaStyle(media: Record<string, string>): React.CSSProperties {
  const s: Record<string, string> = {};
  for (const k of ["bg1", "bg2", "bg3", "bg4"]) if (media[k]) s[`--ghx-${k}`] = `url("${media[k]}")`;
  return s as React.CSSProperties;
}
