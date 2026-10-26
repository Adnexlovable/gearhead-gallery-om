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
      { title: "GearHead RC Hub — A New RC Experience for Oman · Bousher, Muscat" },
      { name: "description", content: "Explore GearHead RC Hub, a proposed premium RC retail, crawler-track and service experience near Bousher Sand Dunes, Muscat. A brand of Adnex.World." },
      { property: "og:title", content: "GearHead RC Hub — A New RC Experience for Oman" },
      { property: "og:description", content: "A proposed Bousher-based RC flagship: performance models, scale crawlers, track-to-retail, service and strategic partnership opportunities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
