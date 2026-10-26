import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BatteryCharging, CarFront, ChevronRight, Compass, Mail, MapPin, Mountain, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { VisionHero } from "@/components/site/VisionHero";
import { ProductCatalog } from "@/components/site/ProductCatalog";

const images = {
  buggy: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f17b4c0a-2cef-4fbb-baac-2536b2ce0018.jpg",
  terrain: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a42db62-b4c4-4df2-b2e1-d82e50c20cb4.png",
  interior: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a7fbbad-e215-4d63-a8c3-550220dcd0c3.jpg",
  racks: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/143af584-f2db-4030-9dee-dea755f2bcac.jpg",
  workshop: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f92c9489-55d1-4c7d-9819-a7294ce8a7cd.jpg",
  logo: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/d33cbb38-c247-46d7-9fa2-08cdf797e71c.png",
};

const departments = [
  { key: "performance", title: "Performance RC", tagline: "Nitro · Brushless · Racing", sub: "RC Cars", image: images.buggy, icon: CarFront, description: "Off-road buggies, brushless trucks, rally and drift platforms." },
  { key: "crawlers", title: "Scale Crawlers", tagline: "Trail · Rock · Realism", sub: "Crawlers", image: images.terrain, icon: Mountain, description: "Wrangler, Defender and technical terrain exploration." },
  { key: "diecast", title: "Diecast & Collectibles", tagline: "Motorsport · Premium Models", sub: "Collectibles", image: images.interior, icon: Compass, description: "Collector-focused Formula, supercar and miniature models." },
  { key: "parts", title: "Parts & Upgrades", tagline: "LiPo · Chargers · Tools", sub: "Accessories", image: images.racks, icon: BatteryCharging, description: "Power systems, chargers, maintenance tools and customisation." },
] as const;

const quickLinks = [
  { icon: CarFront, name: "RC CARS", sub: "Racing & Fun", href: "/store#performance" },
  { icon: Mountain, name: "CRAWLERS", sub: "Scale & Adventure", href: "/store#crawlers" },
  { icon: Settings2, name: "SPARE PARTS", sub: "Wide Selection", href: "/store#parts" },
  { icon: Wrench, name: "SERVICE", sub: "Tuning & Repairs", href: "#app-service" },
  { icon: Compass, name: "INDOOR TRACK", sub: "Test & Play", href: "#app-track" },
] as const;

export const Route = createFileRoute("/app")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "GearHead RC Hub App — Explore RC Cars, Crawlers & Parts in Oman" },
      { name: "description", content: "GearHead RC Hub shopping experience. Explore performance RC vehicles, crawlers, diecast models and parts in the proposed Oman catalogue. Price and availability on enquiry." },
      { property: "og:title", content: "GearHead RC Hub — RC Shopping App" },
      { property: "og:description", content: "A new RC experience for Oman — explore vehicles, parts and scale models." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/app" }],
  }),
  component: AppLanding,
});

function AppLanding() {
  return (
    <div className="gearhead-home gh-customer-app min-h-screen bg-[#07101c] pb-[80px] text-[#fff9ed] md:pb-0">
      <AppNavbar />
      <main>
        <VisionHero mode="app" />
        <nav className="gh-capabilities gh-approved-category-strip" aria-label="Browse GearHead shopping categories">
          <div className="gh-capabilities-inner">
            {quickLinks.map(({icon: Icon,name,sub,href}) => (
              <a href={href} key={name} className="gh-capability">
                <Icon size={25} aria-hidden="true" strokeWidth={1.85} />
                <div><strong>{name}</strong><span>{sub}</span></div>
              </a>
            ))}
          </div>
        </nav>

        <section id="app-categories" className="gh-app-categories gh-chapter scroll-mt-[75px]" aria-labelledby="app-categories-heading">
          <div className="gh-chapter-visual" style={{backgroundImage: `url("${images.terrain}")`}} aria-hidden="true" />
          <div className="gh-chapter-inner">
            <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" /> GEARHEAD RC HUB / SHOPPING APP</div>
            <h2 id="app-categories-heading" className="gh-chapter-title">Explore the <em>RC World.</em></h2>
            <p className="gh-chapter-desc">Discover the four proposed GearHead RC product departments. Select a cover to explore the matching product gallery.</p>
            <div className="gh-app-cover-grid mt-9">
              {departments.map(({key,title,sub,tagline,description,image,icon: Icon}) => (
                <a key={key} href={"/store#"+key} className="gh-app-cover-card group relative isolate block overflow-hidden rounded-xl border border-[#fa9937]/80 bg-[#08101d] shadow-[0_16px_35px_#000a]" aria-label={"Explore "+title+" product catalogue"}>
                  <img src={image} alt={title+" design concept"} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#020813f7] via-[#06111cc4] to-[#03091418]" />
                  <div className="flex h-full min-h-[285px] flex-col justify-end p-5 sm:min-h-[310px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ff9a3a]/80 bg-[#08111dd9] text-[#ffae54]"><Icon size={20}/></div>
                    <p className="mt-4 font-mono text-[10px] font-extrabold uppercase tracking-[.18em] text-[#ffc17d]">{sub} / {tagline}</p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase leading-tight text-white">{title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#fff1e2]">{description}</p>
                    <span className="mt-4 inline-flex items-center justify-between gap-3 self-start rounded-lg border border-[#ff9d3f]/75 bg-[#071321]/95 px-4 py-2.5 text-xs font-extrabold text-[#ffba6e]">Explore Products <ArrowUpRight size={16}/></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="app-shop" className="gh-approved-showroom scroll-mt-[75px]" aria-labelledby="gh-app-showroom-heading">
          <div className="gh-approved-showroom-photo" style={{backgroundImage: `url("${images.interior}")`}} aria-hidden="true"/>
          <div className="gh-approved-showroom-shade" aria-hidden="true" />
          <div className="gh-approved-showroom-inner">
            <div className="gh-approved-showroom-copy">
              <div className="gh-showroom-kicker">YOUR RC DESTINATION</div>
              <h2 id="gh-app-showroom-heading">GEARHEAD <span>RC HUB</span></h2>
              <p>GearHead brings product discovery, planned showroom demonstrations and RC hobby expertise together in one place.</p>
              <a href="/store" className="gh-approved-shop-button">Open RC Catalogue <ChevronRight size={17}/></a>
            </div>
          </div>
          <div className="gh-showroom-footnote">Proposed Bousher flagship • Interior concept image</div>
        </section>

        <section id="app-products" className="gh-chapter scroll-mt-[75px]">
          <div className="gh-chapter-visual" style={{backgroundImage: `url("${images.buggy}")`}} aria-hidden="true"/>
          <div className="gh-chapter-inner">
            <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" /> CATALOGUE PREVIEW</div>
            <h2 className="gh-chapter-title">Built for <em>RC Adventure.</em></h2>
            <p className="gh-chapter-desc">Open individual product details and photographs, then send an enquiry. Product pricing, sales availability and fulfilment will be enabled only after confirmation.</p>
            <ProductCatalog category="performance" />
            <a href="/store" className="gh-solid-action mt-7">Browse the full catalogue <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section id="app-service" className="gh-chapter scroll-mt-[75px]">
          <div className="gh-chapter-visual" style={{backgroundImage: `url("${images.workshop}")`}} aria-hidden="true" />
          <div className="gh-chapter-inner gh-feature-grid">
            <div className="gh-frame-dark gh-metal-frame max-w-lg">
              <div className="gh-eyebrow"><span className="gh-eyebrow-bolt"/> SERVICE & TUNING</div>
              <h2 className="gh-chapter-title">Keep your <em>RC rolling.</em></h2>
              <p className="gh-prose">Planned RC repair, performance tuning and custom build support at the future Bousher showroom. Contact us for launch updates and service enquiries.</p>
              <a href="https://wa.me/96898675132?text=Hello%20GearHead%2C%20please%20share%20RC%20service%20and%20launch%20updates." target="_blank" rel="noopener noreferrer" className="gh-solid-action mt-6">Service Enquiry <ArrowUpRight size={16}/></a>
            </div>
          </div>
        </section>

        <section id="app-track" className="gh-chapter scroll-mt-[75px]">
          <div className="gh-chapter-visual" style={{backgroundImage: `url("${images.terrain}")`}} aria-hidden="true" />
          <div className="gh-chapter-inner">
            <div className="gh-eyebrow"><span className="gh-eyebrow-bolt"/> INDOOR CRAWLER TRACK</div>
            <h2 className="gh-chapter-title">Test. Drive. <em>Discover.</em></h2>
            <p className="gh-chapter-desc">A technical indoor RC obstacle track is planned for the 84 m² Bousher shop. Track access is not yet open for booking.</p>
            <a href="https://wa.me/96898675132?text=Hello%20GearHead%2C%20please%20share%20indoor%20track%20opening%20updates." target="_blank" rel="noopener noreferrer" className="gh-outline-action mt-6">Ask about track opening <ArrowUpRight size={16}/></a>
          </div>
        </section>

        <section id="app-contact" className="gh-app-contact relative overflow-hidden border-t-2 border-[#ff9836]/70 bg-[#09111e] px-5 py-14 sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_55%,#b75c1644,transparent_65%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="gh-eyebrow"><span className="gh-eyebrow-bolt"/> GET IN TOUCH</div>
            <h2 className="mt-4 font-display text-3xl font-black uppercase text-white sm:text-5xl">GearHead <span className="text-[#ffac43]">RC Hub</span></h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#fff2e2]">GearHead RC Hub is a planned retail concept operated under ADNAN TRADING SERVICES LLC, CR 1634293.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:+96898675132" className="gh-solid-action">+968 98675132 <ArrowUpRight size={16}/></a>
              <a href="mailto:Adnant.t636@gmail.com" className="gh-outline-action"><Mail size={16}/> Email us</a>
            </div>
            <div className="mt-6 flex items-start gap-2 text-xs leading-6 text-[#eadbc9]"><MapPin size={16} className="mt-1 shrink-0 text-[#ffa23b]"/>Registered: Muscat, Muscat Governorate, Oman · Planned shop: Bousher Sand Dunes, Muscat</div>
          </div>
        </section>
      </main>

      <footer className="gh-theme-footer relative border-t border-[#ff9e3d]/70 px-5 pb-7 pt-10 text-[#f7eada] md:px-10">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <a href="/app" className="flex items-center gap-3">
            <img src={images.logo} alt="GearHead RC Hub logo" loading="lazy" width={84} height={82} className="w-20 object-contain"/>
            <div className="text-sm font-black text-white">GEARHEAD RC HUB<div className="mt-1 text-[10px] font-medium text-[#ffd297]">A brand of <strong>ADNEX.WORLD</strong></div></div>
          </a>
          <div className="text-xs leading-6 text-[#ffe7cc]">
            <p>ADNAN TRADING SERVICES LLC · CR 1634293</p>
            <p><a href="tel:+96898675132" className="hover:text-white">+968 98675132</a> · <a href="mailto:Adnant.t636@gmail.com" className="hover:text-white">Adnant.t636@gmail.com</a></p>
            <p>Muscat, Sultanate of Oman</p>
          </div>
        </div>
        <div className="relative mx-auto mt-8 max-w-7xl border-t border-[#f69938]/30 pt-4 text-[11px] text-[#eadcc8]">
          Shopping app preview · Products shown are sourcing concepts, not confirmed retail stock. Online payment and checkout are not active.
        </div>
      </footer>
    </div>
  );
}
