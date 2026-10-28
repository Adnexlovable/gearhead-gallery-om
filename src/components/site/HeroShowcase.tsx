import { Link } from "@tanstack/react-router";
import { ArrowRight, Route as TrackIcon, ShoppingBag } from "lucide-react";
import carPhoto from "@/assets/products/hsp-buggy-pro-1.jpg.asset.json";
import crawlerPhoto from "@/assets/products/trx4-defender-1.jpg.asset.json";
import partsPhoto from "@/assets/products/crawler-tyres-beadlocks-1.jpg.asset.json";
import servicePhoto from "@/assets/showroom/shop-service-room.jpg.asset.json";
import trackPhoto from "@/assets/showroom/shop-bridge-track.jpg.asset.json";

/** Strip right under the cover on both home pages: 2 buttons + 5 category boxes. */
export function HeroShowcase({ variant }: { variant: "investor" | "app" }) {
  const app = variant === "app";
  const productsHref = app ? "#categories" : "/store";
  const trackHref = app ? "#explore-rc-world" : "#commercial-thesis";
  const serviceHref = app ? "#service" : "#commercial-thesis";

  const tiles = [
    { photo: carPhoto.url, name: "RC CARS", sub: "Racing & Fun", category: "performance" },
    { photo: crawlerPhoto.url, name: "CRAWLERS", sub: "Scale & Adventure", category: "crawlers" },
    { photo: partsPhoto.url, name: "SPARE PARTS", sub: "Wide Selection", category: "parts" },
    { photo: servicePhoto.url, name: "SERVICE", sub: "Tuning & Repairs", href: serviceHref },
    { photo: trackPhoto.url, name: "INDOOR TRACK", sub: "Test & Play", href: trackHref },
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
            const inner = <><img src={t.photo} alt="" className="ghs-tile-photo" loading="lazy" /><strong>{t.name}</strong><span>{t.sub}</span></>;
            return "category" in t
              ? <Link key={t.name} to="/collection/$category" params={{ category: t.category }} className="ghs-tile">{inner}</Link>
              : <a key={t.name} href={t.href} className="ghs-tile">{inner}</a>;
          })}
        </nav>
      </div>
    </section>
  );
}
