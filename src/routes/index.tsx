import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Navbar } from "@/components/site/Navbar";
import { VisionHero } from "@/components/site/VisionHero";
import { HomeExperience } from "@/components/site/HomeExperience";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "GearHead RC Hub — A New RC Experience for Oman" },
      {
        name: "description",
        content:
          "Explore Performance RC Cars, Scale Crawlers, Drift & Micro RC, Spare Parts, Tuning & Repairs, and Oman's Premier Indoor RC Track in Bousher, Muscat.",
      },
      { property: "og:title", content: "GearHead RC Hub — A New RC Experience for Oman" },
      {
        property: "og:description",
        content:
          "Explore Performance RC Cars, Scale Crawlers, Drift & Micro RC, Spare Parts, Tuning & Repairs, and Oman's Premier Indoor RC Track in Bousher, Muscat.",
      },
      { name: "twitter:title", content: "GearHead RC Hub — A New RC Experience for Oman" },
      {
        name: "twitter:description",
        content:
          "Explore Performance RC Cars, Scale Crawlers, Drift & Micro RC, Spare Parts, Tuning & Repairs, and Oman's Premier Indoor RC Track in Bousher, Muscat.",
      },
      { property: "og:url", content: "https://gearheadrc.store/" },
      { property: "og:image", content: "https://gearheadrc.store/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      {
        property: "og:image:alt",
        content: "GearHead RC Hub — A World of RC Excitement — A New RC Experience for Oman",
      },
      { name: "twitter:image", content: "https://gearheadrc.store/og-image.jpg" },
      {
        name: "twitter:image:alt",
        content: "GearHead RC Hub — A World of RC Excitement — A New RC Experience for Oman",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="gearhead-home relative min-h-screen bg-background text-foreground">
      <CustomCursor />
      <Navbar />
      <main>
        <VisionHero />
        <HomeExperience />
      </main>
      <Footer />
    </div>
  );
}
