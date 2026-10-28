import { useEffect, useRef } from "react";

// Owner's 9:16 cover (phones) and a wide version (computers) of the same scene:
// sunset sky, the whole white-and-red RC crawler, and the GEARHEAD feather flag.
import heroPortrait from "@/assets/home-hero-916-v2.jpg";
import heroWide from "@/assets/home-hero-169-flag.jpg";
import posterAsset from "@/assets/hero-poster.jpg.asset.json";
import { HeroShowcase } from "./HeroShowcase";

export function VisionHero({ portraitSrc, mode }: { mode?: "investor" | "app"; portraitSrc?: string }) {
  const portrait = portraitSrc || heroPortrait;
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!sceneRef.current) return;
      const shift = Math.min(40, Math.max(0, window.scrollY * 0.12));
      sceneRef.current.style.transform = `translate3d(0, ${shift}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
    <section id="top" className="ghh-hero ghh-poster" aria-label="GearHead RC Hub — A New RC Experience for Oman">
      <h1 className="sr-only">GEARHEAD RC HUB — A New RC Experience for Oman</h1>
      <img src={posterAsset.url} alt="GEARHEAD RC HUB poster with RC crawler and flag" className="ghh-poster-img" width={1072} height={1600} fetchPriority="high" />
    </section>
      <div className="ghh-showcase-below">
        <HeroShowcase variant={mode === "app" ? "app" : "investor"} />
      </div>
    </>
  );
}
