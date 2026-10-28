import { Link } from "@tanstack/react-router";
import { ArrowRight, CarFront, Mountain, PackageCheck, Route as TrackIcon, ShoppingBag, Wrench } from "lucide-react";

/** Strip right under the cover on both home pages: 2 buttons + 5 category boxes. */
export function HeroShowcase({ variant }: { variant: "investor" | "app" }) {
  const app = variant === "app";
  const productsHref = app ? "#categories" : "/store";
  const trackHref = app ? "#explore-rc-world" : "#commercial-thesis";
  const serviceHref = app ? "#service" : "#commercial-thesis";

  const tiles = [
    { icon: CarFront, name: "RC CARS", sub: "Racing & Fun", category: "performance" },
    { icon: Mountain, name: "CRAWLERS", sub: "Scale & Adventure", category: "crawlers" },
    { icon: PackageCheck, name: "SPARE PARTS", sub: "Wide Selection", category: "parts" },
    { icon: Wrench, name: "SERVICE", sub: "Tuning & Repairs", href: serviceHref },
    { icon: TrackIcon, name: "INDOOR TRACK", sub: "Test & Play", href: trackHref },
  ] as const;

  return (
    <section className="ghs-showcase" aria-label="Shop GearHead RC Hub">
      <div className="ghs-inner">
        <div className="ghs-ctas">
          <a href={productsHref} className="ghs-btn ghs-btn-solid">
            <ShoppingBag size={18} aria-hidden="true" /><span>Explore RC Products</span><ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href={trackHref} className="ghs-btn ghs-btn-glass">
            <TrackIcon size={18} aria-hidden="true" /><span>Visit Our Indoor Track</span><ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <nav className="ghs-tiles" aria-label="Quick links">
          {tiles.map((t) => {
            const Icon = t.icon;
            const inner = <><Icon size={26} strokeWidth={1.7} aria-hidden="true" /><strong>{t.name}</strong><span>{t.sub}</span></>;
            return "category" in t
              ? <Link key={t.name} to="/collection/$category" params={{ category: t.category }} className="ghs-tile">{inner}</Link>
              : <a key={t.name} href={t.href} className="ghs-tile">{inner}</a>;
          })}
        </nav>
      </div>
    </section>
  );
}
