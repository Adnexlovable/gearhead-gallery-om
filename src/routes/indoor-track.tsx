import { shareMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/shop/InfoPage";
import bridgeTrack from "@/assets/showroom/shop-bridge-track.jpg.asset.json";
import floor from "@/assets/showroom/shop-floor-wide.jpg.asset.json";
import shelves from "@/assets/showroom/shop-shelves.jpg.asset.json";

const title = "Indoor RC Crawler Track — GearHead RC Hub, Muscat";
const description = "Test-drive RC crawlers on the indoor bridge and rock track at GearHead RC Hub, Bausher, Muscat. Ask us on WhatsApp.";

export const Route = createFileRoute("/indoor-track")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
        ...shareMeta("/indoor-track", title, description),
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/indoor-track" }],
  }),
  component: () => (
    <InfoPage
      kicker="Indoor track"
      title={<>Test it on <em>our track.</em></>}
      text="Our indoor crawler track has a bridge rail, rocks, ramps and obstacles. Try a crawler before you buy, or bring your own and play."
      photos={[
        { src: bridgeTrack.url, label: "Crawler bridge track" },
        { src: floor.url, label: "Track & showroom" },
        { src: shelves.url, label: "Crawlers on display" },
      ]}
      points={[
        ["Bridge rail", "Drive across the raised bridge and test your control."],
        ["Rocks & ramps", "Real climbing obstacles for scale crawlers."],
        ["Try before you buy", "Test a crawler from the shop on the track."],
        ["Bring your own", "Ask us on WhatsApp to come and drive your RC."],
      ]}
      whatsappText="Hello GearHead, I want to visit the indoor track."
      ctaLabel="Ask about the track"
      more={{ label: "See scale crawlers", category: "crawlers" }}
    />
  ),
});
