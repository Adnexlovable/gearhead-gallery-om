import { useEffect } from "react";
import { HeroShowcase } from "./HeroShowcase";
import { useSiteMedia } from "@/lib/site-media";
import mobileDefault from "@/assets/home-hero-916-flag.jpg";
import desktopDefault from "@/assets/home-hero-169-flag.jpg";

const DEFAULT_TITLE = "GearHead RC Hub — A New RC Experience for Oman";
const DEFAULT_DESCRIPTION =
  "Explore Performance RC Cars, Scale Crawlers, Drift & Micro RC, Spare Parts, Tuning & Repairs, and Oman's Premier Indoor RC Track in Bousher, Muscat.";

export function VisionHero({ mode }: { mode?: "investor" | "app" }) {
  const media = useSiteMedia();
  const title = media.og_title || DEFAULT_TITLE;
  const description = media.og_description || DEFAULT_DESCRIPTION;
  const videoActive = media.hero_video_active === "true" && Boolean(media.hero_video);

  useEffect(() => {
    document.title = title;
    const updateMeta = (selector: string, attribute: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        const [key, content] = attribute.split("=");
        tag.setAttribute(key, content.replaceAll('"', ""));
        document.head.append(tag);
      }
      tag.content = value;
    };
    updateMeta('meta[property="og:title"]', 'property="og:title"', title);
    updateMeta('meta[property="og:description"]', 'property="og:description"', description);
    updateMeta(
      'meta[property="og:image"]',
      'property="og:image"',
      media.og_image || "/og-image.jpg",
    );
    updateMeta('meta[name="twitter:title"]', 'name="twitter:title"', title);
    updateMeta('meta[name="twitter:description"]', 'name="twitter:description"', description);
    updateMeta(
      'meta[name="twitter:image"]',
      'name="twitter:image"',
      media.og_image || "/og-image.jpg",
    );
  }, [title, description, media.og_image]);

  return (
    <section
      id="top"
      className={`ghh-hero ghh-dual-hero ${mode === "app" ? "ghh-shop-hero" : ""}`}
      aria-label="GearHead RC Hub — A New RC Experience for Oman"
    >
      <h1 className="sr-only">GEARHEAD RC HUB — A New RC Experience for Oman</h1>
      <img
        src={media.hero_mobile || mobileDefault}
        alt=""
        aria-hidden="true"
        className="ghh-dual-image ghh-mobile-image"
      />
      <img
        src={media.hero_desktop || desktopDefault}
        alt=""
        aria-hidden="true"
        className="ghh-dual-image ghh-desktop-image"
      />
      {videoActive && (
        <video
          className="ghh-dual-video"
          src={media.hero_video}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="ghh-dual-shade" aria-hidden="true" />
      <div className="ghh-dual-copy">
        <strong className="ghh-dual-title">
          <span className="ghh-dual-title-main">GEARHEAD</span>
          <span className="ghh-dual-title-accent">RC HUB</span>
        </strong>
        <span className="ghh-dual-brand">A brand of <span className="ghh-dual-brand-accent">ADNEX.WORLD</span></span>
        <span className="ghh-dual-tagline">A NEW RC EXPERIENCE FOR OMAN</span>
      </div>
      <div className="ghh-showcase-on">
        <HeroShowcase variant={mode === "app" ? "app" : "investor"} />
      </div>
    </section>
  );
}
