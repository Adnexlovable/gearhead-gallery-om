import { shareMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/shop/InfoPage";
import serviceRoom from "@/assets/showroom/shop-service-room.jpg.asset.json";
import counter from "@/assets/showroom/shop-counter.jpg.asset.json";
import shelves from "@/assets/showroom/shop-shelves.jpg.asset.json";

const title = "RC Service & Repairs — GearHead RC Hub, Muscat";
const description = "Repairs, tuning and upgrades for your RC car or crawler at GearHead RC Hub, Bausher, Muscat. Ask us on WhatsApp.";

export const Route = createFileRoute("/service")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      ...shareMeta("/service", title, description),
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/service" }],
  }),
  component: () => (
    <InfoPage
      kicker="Service & tuning"
      title={<>Keep your <em>RC rolling.</em></>}
      text="Bring your RC to our service room for repairs, tuning and custom upgrades. Ask us on WhatsApp and we'll check parts for your exact model."
      photos={[
        { src: serviceRoom.url, label: "Service room" },
        { src: counter.url, label: "Shop counter" },
        { src: shelves.url, label: "Parts shelves" },
      ]}
      points={[
        ["Repairs", "Broken parts, steering, motors and electronics checked and fixed."],
        ["Tuning", "Set-up for crawling, speed or drifting to suit how you drive."],
        ["Upgrades", "Model-matched tyres, gears, servos and batteries fitted."],
        ["Parts check", "Send your model on WhatsApp and we check what fits."],
      ]}
      whatsappText="Hello GearHead, I need RC service."
      ctaLabel="Service enquiry"
      more={{ label: "Browse spare parts", category: "parts" }}
    />
  ),
});
