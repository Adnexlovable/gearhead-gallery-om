import { useEffect, useRef } from "react";

// Owner's 9:16 cover (phones) and a wide version (computers) of the same scene:
// sunset sky, the whole white-and-red RC crawler, and the GEARHEAD feather flag.
import heroPortrait from "@/assets/home-hero-916-flag.jpg";
import heroWide from "@/assets/home-hero-169-flag.jpg";

export function VisionHero({ portraitSrc }: { mode?: "investor" | "app"; portraitSrc?: string }) {
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
    <section
      id="top"
      className="ghh-hero"
      aria-label="GearHead RC Hub — A New RC Experience for Oman"
      style={{ ["--ghh-portrait" as string]: `url("${heroPortrait}")` }}
    >
      <div ref={sceneRef} className="ghh-scene" aria-hidden="true">
        <picture>
          <source media="(min-aspect-ratio: 1/1)" srcSet={heroWide} />
          <img src={heroPortrait} alt="" className="ghh-img" width={1072} height={1920} fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="ghh-shade" aria-hidden="true" />
      <div className="ghh-copy">
        <h1 className="ghh-title" aria-label="GEARHEAD RC HUB">
          <span className="ghh-steel">GEARHEAD</span>
          <span className="ghh-orange">RC HUB</span>
        </h1>
        <p className="ghh-brand">A brand of <span>ADNEX.WORLD</span></p>
        <p className="ghh-tagline">A NEW RC EXPERIENCE FOR OMAN</p>
      </div>
    </section>
  );
}
