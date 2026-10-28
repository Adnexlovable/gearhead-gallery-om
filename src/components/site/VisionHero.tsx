// Owner's own GEARHEAD RC HUB poster (title, crawler and flag baked in), shown whole.
// The rocky ground is extended below the tyres so the 2 buttons + 5 boxes sit on the rocks.
import posterAsset from "@/assets/hero-poster-flag.jpg.asset.json";
import { HeroShowcase } from "./HeroShowcase";

export function VisionHero({ mode }: { mode?: "investor" | "app"; portraitSrc?: string }) {
  return (
    <section id="top" className="ghh-hero ghh-poster" aria-label="GearHead RC Hub — A New RC Experience for Oman">
      <h1 className="sr-only">GEARHEAD RC HUB — A New RC Experience for Oman</h1>
      <img src={posterAsset.url} alt="GEARHEAD RC HUB poster with RC crawler and flag" className="ghh-poster-img" width={1072} height={2100} fetchPriority="high" />
      <div className="ghh-showcase-on">
        <HeroShowcase variant={mode === "app" ? "app" : "investor"} />
      </div>
    </section>
  );
}
