import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ArrowUpRight, ShoppingBag } from "lucide-react";

// User-approved cinematic reference. The RC vehicle area is composed
// separately from accessible headline text and functional navigation.
const referenceVisual = "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f17b4c0a-2cef-4fbb-baac-2536b2ce0018.jpg";

export function VisionHero({ mode = "investor" }: { mode?: "investor" | "app" }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!sceneRef.current) return;
      const shift = Math.min(38, Math.max(0, window.scrollY * 0.12));
      sceneRef.current.style.transform = `translate3d(0, ${shift}px, 0) scale(1.035)`;
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
    <section id="top" className="gh-reference-hero" aria-label="GearHead RC Hub — A New RC Experience for Oman">
      <div className="gh-hero-sky" aria-hidden="true" />
      <div ref={sceneRef} className="gh-hero-buggy" aria-hidden="true" style={{ backgroundImage: `url("${referenceVisual}")` }} />
      <div className="gh-hero-vignette" aria-hidden="true" />
      <div className="gh-hero-inner">
        <div className="gh-hero-copy">
          <h1 className="gh-hero-brand" aria-label="GEARHEAD RC HUB">
            <span className="gh-hero-steel">GEARHEAD</span>
            <span className="gh-hero-copper">RC HUB</span>
          </h1>
          <p className="gh-hero-tagline">A NEW RC EXPERIENCE FOR OMAN</p>
  
        </div>
        <div className="gh-hero-cta-row">
            <Link to="/store" className="gh-hero-button gh-hero-button-primary">
              <ShoppingBag size={16} aria-hidden="true" /> Explore RC Products <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            {mode === "investor" ? (
              <a href="#investor-deck" className="gh-hero-button gh-hero-button-secondary">
                Investor Opportunity <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ) : (
              <a href="#app-categories" className="gh-hero-button gh-hero-button-secondary">
                Browse Categories <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
      </div>
    </section>
  );
}
