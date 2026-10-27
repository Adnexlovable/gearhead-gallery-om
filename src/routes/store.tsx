import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BatteryCharging, CarFront, ChevronRight, Gauge, Mountain } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { ProductCatalog } from "@/components/site/ProductCatalog";
import { useHashScroll } from "@/hooks/useHashScroll";

const visual = {
  rc: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/0530ccd4-2eb8-4d34-98b7-c890ccb70c38.png",
  showroom: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a7fbbad-e215-4d63-a8c3-550220dcd0c3.jpg",
  garage: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a42db62-b4c4-4df2-b2e1-d82e50c20cb4.png",
  display: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f92c9489-55d1-4c7d-9819-a7294ce8a7cd.jpg",
};

const groups = [
  {
    slug: "performance", no: "01", name: "Performance RC", subtitle: "Nitro • Brushless • Drift • Rally",
    icon: Gauge, image: visual.rc,
    models: [
      { name: "Nitro Gas Buggy (RTR)", scale: "1:8", detail: "Nitro-powered off-road · Ready to Run" },
      { name: "Brushless Speed Truck", scale: "1:10", detail: "Electric power • Speed and handling" },
      { name: "High-Speed Rally Truggy", scale: "1:14", detail: "Electric hobby-grade off-road platform" },
      { name: "Racing Drift Car", scale: "1:10", detail: "Electric chassis • Drift & tuning" },
    ],
  },
  {
    slug: "crawlers", no: "02", name: "Scale Crawlers", subtitle: "Trail • Rock • Realism",
    icon: Mountain, image: visual.garage,
    models: [
      { name: "Realistic Wrangler (Metal)", scale: "1:10", detail: "Scale detail • Off-road crawler" },
      { name: "Land Cruiser LC80", scale: "1:12", detail: "Licensed-design reference • Trail model" },
      { name: "Ultra4 Bronco (Brushless)", scale: "1:18", detail: "Compact rock and trail performance" },
      { name: "Defender D110 (Premium)", scale: "1:10", detail: "Collector-grade scale crawler" },
    ],
  },
  {
    slug: "diecast", no: "03", name: "Diecast & Collectibles", subtitle: "F1 • Supercars • Limited Editions",
    icon: CarFront, image: visual.showroom,
    models: [
      { name: "F1 Championship Editions", scale: "1:18", detail: "Formula racing collection" },
      { name: "Exotic Supercars", scale: "1:24", detail: "Premium automotive models" },
      { name: "Hot Wheels Premium Sets", scale: "1:64", detail: "Collector-oriented miniature sets" },
      { name: "Limited Edition RLC Series", scale: "1:64", detail: "Special collector-edition sourcing" },
    ],
  },
  {
    slug: "parts", no: "04", name: "Parts & Upgrades", subtitle: "LiPo • Chargers • Tools • Customisation",
    icon: BatteryCharging, image: visual.display,
    models: [
      { name: "High-Power LiPo Battery", scale: "3S–6S", detail: "RC power and performance" },
      { name: "Smart Fast Charger", scale: "AC/DC", detail: "Dual-port charging systems" },
      { name: "RC Precision Tool Kit", scale: "25-piece", detail: "Maintenance and workshop essentials" },
      { name: "Custom Polycarbonate Paint", scale: "RC body", detail: "Paint and personalisation" },
    ],
  },
];

export const Route = createFileRoute("/store")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "GearHead RC Hub | RC Cars, Crawlers, Diecast & Parts Catalogue · Muscat" },
      { name: "description", content: "Explore the proposed GearHead RC Hub catalogue: performance RC buggies, scale crawlers, diecast collections, LiPo batteries and RC parts for the planned Bousher, Muscat flagship." },
      { property: "og:title", content: "GearHead RC Hub — RC Catalogue" },
      { property: "og:description", content: "Performance RC, Scale Crawlers, Diecast and Parts — the proposed inventory range in Oman." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/store" }],
  }),
  component: StorePage,
});

function StorePage() {
  useHashScroll();
  return (
    <div className="gearhead-home gh-has-bottomnav min-h-screen bg-[#07101c] text-white">
      <AppNavbar />
      <main>
        <section id="top" className="relative isolate flex min-h-[65svh] items-center overflow-hidden border-b-2 border-[#ef8c29]/70 px-6 py-36">
          <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('" + visual.rc + "')" }} aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06101bf7] via-[#06101bd9] to-[#05102099]" aria-hidden="true" />
          <div className="mx-auto w-full max-w-7xl">
            <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" /> GearHead RC Hub / Sourcing Range</div>
            <h1 className="mt-7 max-w-3xl font-display text-[clamp(3rem,7.8vw,7rem)] font-black uppercase leading-[.91] tracking-[-.06em] text-white">
              Explore the <span className="text-[#ff981e]">RC Fleet.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#fff5e9]">
              Explore the planned GearHead RC range with catalogue photos and individual product details: performance, scale crawlers, diecast collectibles and RC parts.
            </p>
            <div className="mt-7 inline-flex max-w-xl rounded-lg border border-[#ffa14a]/50 bg-[#07101c]/80 px-4 py-3 text-xs leading-6 text-[#ffe0bb]">
              Browse real catalogue product reference images, scales and technical descriptions. Retail prices and stock status will be added after supplier confirmation; product enquiries are available now.
            </div>
          </div>
        </section>
        <div className="gh-capabilities">
          <div className="gh-capabilities-inner">
            {groups.map(({ icon: Icon, name, slug }) => (
              <a href={"#" + slug} key={slug} className="gh-capability transition-colors hover:bg-[#ff8f1f]/10"><Icon size={23} aria-hidden="true" /><div><strong>{name}</strong><span>View planned range</span></div></a>
            ))}
          </div>
        </div>
        {groups.map(({ slug, name, no, subtitle, image }) => (
          <section key={slug} id={slug} className="gh-chapter scroll-mt-24">
            <div className="gh-chapter-visual" aria-hidden="true" style={{ backgroundImage: "url('" + image + "')" }} />
            <div className="gh-chapter-inner">
              <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" /> Category {no}</div>
              <h2 className="gh-chapter-title">{name}</h2>
              <p className="gh-chapter-desc">{subtitle}</p>
              <ProductCatalog category={slug as "performance" | "crawlers" | "diecast" | "parts"} />
              <a className="gh-outline-action mt-7" target="_blank" rel="noopener noreferrer"
                href={"https://wa.me/96898675132?text=" + encodeURIComponent("Hello GearHead, please share updates for " + name + " products.")}>
                Enquire about {name} <ArrowUpRight size={16} />
              </a>
            </div>
          </section>
        ))}
        <section id="contact" className="gh-chapter">
          <div className="gh-chapter-visual" aria-hidden="true" style={{ backgroundImage: "url('" + visual.showroom + "')" }} />
          <div className="gh-chapter-inner">
            <div className="gh-metal-frame max-w-3xl p-7 md:p-12">
              <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" /> Stay connected</div>
              <h2 className="gh-chapter-title">Your next <em>RC adventure.</em></h2>
              <p className="gh-chapter-desc">Ask about sourcing, specifications, the planned Bousher showroom and future inventory arrivals.</p>
              <a href="https://wa.me/96898675132" target="_blank" rel="noopener noreferrer" className="gh-solid-action mt-7">Contact GearHead RC <ChevronRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="app" />
    </div>
  );
}
