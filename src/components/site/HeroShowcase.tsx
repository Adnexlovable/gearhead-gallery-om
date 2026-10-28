import { Link } from "@tanstack/react-router";
import { ArrowRight, Route as TrackIcon, ShoppingBag } from "lucide-react";
import carPhoto from "@/assets/products/hsp-buggy-pro-1.jpg.asset.json";
import crawlerPhoto from "@/assets/products/trx4-defender-1.jpg.asset.json";
import partsPhoto from "@/assets/products/crawler-tyres-beadlocks-1.jpg.asset.json";
import servicePhoto from "@/assets/showroom/shop-service-room.jpg.asset.json";
import trackPhoto from "@/assets/showroom/shop-bridge-track.jpg.asset.json";
import { useSiteMedia } from "@/lib/site-media";

/** Strip right under the cover on both home pages: 2 buttons + 5 category boxes. */
export function HeroShowcase({ variant }: { variant: "investor" | "app" }) {
  const app = variant === "app";
  const media = useSiteMedia();
  const productsHref = app ? "#categories" : "/store";

  const tiles = [
    { photo: media.tile_cars || carPhoto.url, name: "RC CARS", sub: "Racing & Fun", category: "performance" },
    { photo: media.tile_crawlers || crawlerPhoto.url, name: "CRAWLERS", sub: "Scale & Adventure", category: "crawlers" },
    { photo: media.tile_parts || partsPhoto.url, name: "SPARE PARTS", sub: "Wide Selection", category: "parts" },
    { photo: media.tile_service || servicePhoto.url, name: "SERVICE", sub: "Tuning & Repairs", page: "/service" },
    { photo: media.tile_track || trackPhoto.url, name: "INDOOR TRACK", sub: "Test & Play", page: "/indoor-track" },
  ] as const;

  return (
    <section className="ghs-showcase" aria-label="Shop GearHead RC Hub">
      <div className="ghs-inner">
        <div className="ghs-ctas">
          <a href={productsHref} className="ghs-btn ghs-btn-solid">
            <ShoppingBag size={18} aria-hidden="true" /><span>Explore RC Products</span><ArrowRight size={16} aria-hidden="true" />
          </a>
          <Link to="/indoor-track" className="ghs-btn ghs-btn-glass">
            <TrackIcon size={18} aria-hidden="true" /><span>Visit Our Indoor Track</span><ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <nav className="ghs-tiles" aria-label="Quick links">
          {tiles.map((t) => {
            const inner = <><img src={t.photo} alt="" className="ghs-tile-photo" loading="lazy" /><strong>{t.name}</strong><span>{t.sub}</span></>;
            return "category" in t
              ? <Link key={t.name} to="/collection/$category" params={{ category: t.category }} className="ghs-tile">{inner}</Link>
              : <Link key={t.name} to={t.page} className="ghs-tile">{inner}</Link>;
          })}
        </nav>
      </div>
    </section>
  );
}
