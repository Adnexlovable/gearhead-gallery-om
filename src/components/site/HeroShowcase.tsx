import { Link } from "@tanstack/react-router";
import { ArrowRight, Route as TrackIcon, ShoppingBag } from "lucide-react";
import carPhoto from "@/assets/mercedes-w15.jpg";
import crawlerPhoto from "@/assets/defender.jpg";
import partsPhoto from "@/assets/250gto.jpg";
import servicePhoto from "@/assets/frame-bmw.jpg";
import trackPhoto from "@/assets/ferrari-sf24.jpg";

/** Strip right under the cover on both home pages: 2 buttons + 5 category boxes. */
export function HeroShowcase({ variant }: { variant: "investor" | "app" }) {
  const app = variant === "app";
  const productsHref = app ? "#categories" : "/store";

  const tiles = [
    { photo: carPhoto, name: "RC CARS", sub: "Racing & Fun", category: "performance" },
    { photo: crawlerPhoto, name: "CRAWLERS", sub: "Scale & Adventure", category: "crawlers" },
    { photo: partsPhoto, name: "SPARE PARTS", sub: "Wide Selection", category: "parts" },
    { photo: servicePhoto, name: "SERVICE", sub: "Tuning & Repairs", page: "/service" },
    { photo: trackPhoto, name: "INDOOR TRACK", sub: "Test & Play", page: "/indoor-track" },
  ] as const;

  return (
    <section className="ghs-showcase" aria-label="Shop GearHead RC Hub">
      <div className="ghs-inner">
        <div className="ghs-ctas">
          <a href={productsHref} className="ghs-btn ghs-btn-solid">
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Explore RC Products</span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <Link to="/indoor-track" className="ghs-btn ghs-btn-glass">
            <TrackIcon size={18} aria-hidden="true" />
            <span>Visit Our Indoor Track</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <nav className="ghs-tiles" aria-label="Quick links">
          {tiles.map((t) => {
            const inner = (
              <>
                <img src={t.photo} alt="" className="ghs-tile-photo" loading="lazy" />
                <strong>{t.name}</strong>
                <span>{t.sub}</span>
              </>
            );
            return "category" in t ? (
              <Link
                key={t.name}
                to="/collection/$category"
                params={{ category: t.category }}
                className="ghs-tile"
              >
                {inner}
              </Link>
            ) : (
              <Link key={t.name} to={t.page} className="ghs-tile">
                {inner}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
