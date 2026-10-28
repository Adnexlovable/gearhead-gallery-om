import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeftRight, ArrowRight, ArrowUpRight, CarFront, CheckCircle2, Facebook, Instagram, Mail, MapPin, MessageCircle,
  Mountain, PackageCheck, Phone, Route as TrackIcon, ShoppingBag, Wrench,
} from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { CinematicScene } from "@/components/site/CinematicScene";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFinder } from "@/components/shop/ProductFinder";
import { SectionHead } from "@/components/shop/SectionHead";
import { shopCatalogQuery } from "@/lib/shop-queries";
import { useHashScroll } from "@/hooks/useHashScroll";
import { WHATSAPP_NUMBER } from "@/lib/shop";
import { DEFAULT_SHOP_DETAILS } from "@/lib/shop-details";
import heroImage from "@/assets/shop-hero.jpg";

const art = {
  showroom: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a7fbbad-e215-4d63-a8c3-550220dcd0c3.jpg",
  display: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/143af584-f2db-4030-9dee-dea755f2bcac.jpg",
  workshop: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f92c9489-55d1-4c7d-9819-a7294ce8a7cd.jpg",
  terrain: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a42db62-b4c4-4df2-b2e1-d82e50c20cb4.png",
};
const motion = {
  track: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/19986706-a56f-4ac1-8542-9f1a432b8c92.mp4",
  service: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/3b8318e1-4713-4c93-9673-c8c1798ac307.mp4",
  retail: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/c396cda3-deca-4982-8354-ebe8d13e06d8.mp4",
  showroomMobile: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/68499411-3243-4bb8-b263-693c499e95ef.mp4",
  showroomDesktop: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/240fa4da-8a24-4bd5-b52d-ec77257493fd.mp4",
};

const tiles = [
  { icon: CarFront, name: "RC Cars", sub: "Racing & Fun", category: "performance" },
  { icon: Mountain, name: "Crawlers", sub: "Scale & Adventure", category: "crawlers" },
  { icon: PackageCheck, name: "Spare Parts", sub: "Wide Selection", category: "parts" },
  { icon: Wrench, name: "Service", sub: "Tuning & Repairs", hash: "service" },
  { icon: TrackIcon, name: "Indoor Track", sub: "Test & Play", hash: "explore-rc-world" },
] as const;

const milestones = [
  { no: "01", title: "Secure the shop", note: "Finalise the Bausher premises and approvals." },
  { no: "02", title: "Build the experience", note: "Shopfront, indoor terrain, display racks and service bench." },
  { no: "03", title: "Stock & test", note: "Receive opening stock, check every model and set up orders." },
  { no: "04", title: "Open the doors", note: "Welcome the RC community to the shop and track." },
];

export const Route = createFileRoute("/app")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(shopCatalogQuery),
  head: () => ({
    meta: [
      { title: "GearHead RC Hub — RC Cars, Crawlers, Diecast & Parts Shop in Muscat" },
      { name: "description", content: "Shop GearHead RC Hub in Bausher, Muscat: performance RC, scale crawlers, drift & micro RC, diecast models, construction RC, batteries and spare parts. Order on WhatsApp." },
      { property: "og:title", content: "GearHead RC Hub — RC Shop & Indoor Track, Muscat" },
      { property: "og:description", content: "Explore RC categories, find the right model with our product finder and order on WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gearheadrc.store/app" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/app" }],
  }),
  component: ShopHome,
});

function ShopHome() {
  useHashScroll();
  const { data } = useSuspenseQuery(shopCatalogQuery);
  const count = (slug: string) => data.products.filter((p) => p.category === slug).length;
  const scales = (slug: string) => [...new Set(data.products.filter((p) => p.category === slug).map((p) => p.scale))].slice(0, 4).join(" · ");
  const featured = data.categories.flatMap((c) => data.products.filter((p) => p.category === c.slug).slice(0, 1)).slice(0, 8);
  const catName = new Map(data.categories.map((c) => [c.slug, c.name]));
  const cover = (slug: string) => data.categories.find((c) => c.slug === slug)?.cover;
  const d = DEFAULT_SHOP_DETAILS;

  return (
    <div className="gearhead-home ghx-shop gh-has-bottomnav">
      <AppNavbar />
      <main>
        {/* 1. Hero */}
        <section id="top" className="ghx-hero" aria-label="GearHead RC Hub">
          <img src={heroImage} alt="" className="ghx-hero-img" data-parallax="0.18" width={1920} height={1280} fetchPriority="high" />
          <div className="ghx-hero-shade" aria-hidden="true" />
          <div className="ghx-hero-inner">
            <h1 className="ghx-hero-title gh-hero-brand" aria-label="GearHead RC Hub">
              <span className="gh-hero-steel">GEARHEAD</span>
              <span className="gh-hero-copper">RC HUB</span>
            </h1>
            <p className="ghx-hero-brandline">A brand of <strong>ADNEX.WORLD</strong></p>
            <p className="ghx-hero-tagline">A NEW RC EXPERIENCE FOR OMAN</p>
            <div className="ghx-hero-ctas">
              <a href="#categories" className="ghx-btn ghx-btn-primary ghx-btn-lg"><ShoppingBag size={18} aria-hidden="true" /> Explore RC Products <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#explore-rc-world" className="ghx-btn ghx-btn-outline ghx-btn-lg"><TrackIcon size={18} aria-hidden="true" /> Visit Our Indoor Track <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
            <nav className="ghx-tiles" aria-label="Quick links">
              {tiles.map((t) => {
                const Icon = t.icon;
                const inner = <><Icon size={26} strokeWidth={1.8} aria-hidden="true" /><strong>{t.name}</strong><span>{t.sub}</span></>;
                return "category" in t
                  ? <Link key={t.name} to="/collection/$category" params={{ category: t.category }} className="ghx-tile">{inner}</Link>
                  : <a key={t.name} href={`#${t.hash}`} className="ghx-tile">{inner}</a>;
              })}
            </nav>
          </div>
        </section>

        <div className="ghx-feature-cards">
          {[
            { label: "Off-road", strong: "Adventure", img: cover("crawlers"), to: "crawlers" },
            { label: "Parts &", strong: "Upgrades", img: cover("parts"), to: "parts" },
            { label: "Service &", strong: "Tuning", img: art.workshop, hash: "service" },
          ].map((c) => {
            const body = <><img src={c.img} alt="" loading="lazy" width={600} height={400} /><span className="ghx-feature-copy">{c.label}<strong>{c.strong}</strong></span><span className="ghx-round"><ArrowRight size={18} /></span></>;
            return c.to
              ? <Link key={c.strong} to="/collection/$category" params={{ category: c.to }} className="ghx-feature-card">{body}</Link>
              : <a key={c.strong} href={`#${c.hash}`} className="ghx-feature-card">{body}</a>;
          })}
        </div>

        {/* 2. About / Explore RC World */}
        <section id="explore-rc-world" className="ghx-section" data-parallax-section>
          <div className="ghx-wrap">
            <SectionHead kicker="About the shop" title={<>Explore the <em>RC world.</em></>}
              text="GearHead RC Hub is a hands-on RC shop at the Bausher sand dunes in Muscat. Browse the showroom, test-drive on the indoor terrain track, and get parts, batteries and service in one place." />
            <div className="ghx-stats">
              <div><strong>84 <small>m²</small></strong><span>Showroom & track</span></div>
              <div><strong>7 × 12 <small>m</small></strong><span>Shop size</span></div>
              <div><strong>9</strong><span>Product categories</span></div>
              <div><strong>{data.products.length}</strong><span>Catalogue items</span></div>
            </div>
            <div className="ghx-offer-grid">
              {[
                ["RC showroom", "Performance RC, crawlers, diecast and construction models on display."],
                ["Indoor terrain track", "Rocks, ramps and obstacles to test a crawler before you buy."],
                ["Parts & batteries", "Model-matched tyres, gears, servos, LiPo packs and chargers."],
                ["Service bench", "Repairs, tuning and upgrades for your RC."],
              ].map(([t, s]) => <div key={t} className="ghx-offer"><CheckCircle2 size={18} aria-hidden="true" /><div><strong>{t}</strong><span>{s}</span></div></div>)}
            </div>
            <div className="ghx-media-grid">
              <figure className="ghx-media ghx-media-wide"><CinematicScene className="ghx-media-fill" poster={art.terrain} mobileSrc={motion.track} /><figcaption><strong>Indoor track</strong><span>Test drive · Obstacles</span></figcaption></figure>
              <figure className="ghx-media"><CinematicScene className="ghx-media-fill" poster={art.display} mobileSrc={motion.retail} /><figcaption><strong>Display racks</strong><span>RC cars · Parts</span></figcaption></figure>
              <figure className="ghx-media"><CinematicScene className="ghx-media-fill" poster={art.workshop} mobileSrc={motion.service} /><figcaption><strong>Service bench</strong><span>Repairs · Upgrades</span></figcaption></figure>
              <figure className="ghx-media"><img src={art.showroom} alt="GearHead showroom interior design" loading="lazy" /><figcaption><strong>Showroom interior</strong><span>Design concept</span></figcaption></figure>
            </div>
            <p className="ghx-note">Interior photos and videos are design concepts for the shop.</p>
          </div>
        </section>

        {/* 3. Categories */}
        <section id="categories" className="ghx-section ghx-section-alt" data-parallax-section>
          <div className="ghx-wrap">
            <div className="ghx-head-row">
              <SectionHead kicker="Shop by category" title={<>Explore <em>RC categories.</em></>} />
              <Link to="/store" className="ghx-link">View all products <ArrowRight size={15} /></Link>
            </div>
            <div className="ghx-cat-grid">
              {data.categories.map((c) => (
                <Link key={c.slug} to="/collection/$category" params={{ category: c.slug }} className="ghx-cat-card">
                  <div className="ghx-cat-media"><img src={c.cover} alt={c.name} loading="lazy" width={600} height={400} /></div>
                  <div className="ghx-cat-body">
                    <div className="min-w-0">
                      <h3>{c.name}</h3>
                      <p>{c.tagline}</p>
                      <small>{count(c.slug) ? `${count(c.slug)} items · ${scales(c.slug)}` : "Coming soon"}</small>
                    </div>
                    <span className="ghx-round"><ArrowRight size={17} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AI product finder */}
        <section id="finder" className="ghx-section">
          <div className="ghx-wrap ghx-finder-wrap">
            <SectionHead kicker="Product finder" title={<>Tell us what you <em>want to drive.</em></>}
              text="Describe the RC car, scale model, use or budget you have in mind. Our AI-powered finder picks matching items from the GearHead catalogue." />
            <ProductFinder />
          </div>
        </section>

        {/* Featured products */}
        <section id="featured" className="ghx-section ghx-section-alt">
          <div className="ghx-wrap">
            <div className="ghx-head-row">
              <SectionHead kicker="Picked from every category" title={<>Featured <em>RC picks.</em></>} />
              <Link to="/store" className="ghx-link">Full collection <ArrowRight size={15} /></Link>
            </div>
            <div className="ghx-rail" data-lenis-prevent-wheel>
              {featured.map((p) => <div key={p.slug} className="ghx-rail-item"><ProductCard product={p} categoryName={catName.get(p.category)} /></div>)}
            </div>
          </div>
        </section>

        {/* 4. Flagship */}
        <section id="flagship" className="gh-approved-showroom" aria-labelledby="ghx-flagship-heading">
          <CinematicScene className="gh-approved-showroom-photo" poster={art.showroom} mobileSrc={motion.showroomMobile} desktopSrc={motion.showroomDesktop} />
          <div className="gh-approved-showroom-shade" aria-hidden="true" />
          <div className="gh-approved-showroom-inner">
            <div className="gh-approved-showroom-copy">
              <div className="gh-showroom-kicker">EXPLORE OUR FLAGSHIP</div>
              <h2 id="ghx-flagship-heading">RC SHOWROOM <span>EXPERIENCE</span></h2>
              <p>Retail, an indoor crawler track, a service bench and a complete hobby experience at the Bausher sand dunes, Muscat.</p>
              <Link to="/store" className="gh-approved-shop-button">Explore the Shop <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="gh-showroom-footnote">Bausher sand dunes flagship • Interior design concept</div>
        </section>

        {/* Service */}
        <section id="service" className="ghx-section" data-parallax-section>
          <div className="ghx-wrap ghx-split">
            <div>
              <SectionHead kicker="Service & tuning" title={<>Keep your <em>RC rolling.</em></>}
                text="Bring your RC for repairs, tuning and custom upgrades. Ask us on WhatsApp and we'll check parts for your exact model." />
              <div className="ghx-hero-ctas mt-6">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello GearHead, I need RC service.")}`} target="_blank" rel="noopener noreferrer" className="ghx-btn ghx-btn-primary"><MessageCircle size={16} /> Service enquiry</a>
                <Link to="/collection/$category" params={{ category: "parts" }} className="ghx-btn ghx-btn-outline">Browse spare parts <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="ghx-media ghx-media-tall"><img src={art.workshop} alt="GearHead service bench design" loading="lazy" /></div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="ghx-section ghx-section-alt">
          <div className="ghx-wrap">
            <SectionHead kicker="Opening roadmap" title={<>From plan <em>to opening day.</em></>} />
            <ol className="ghx-roadmap">
              {milestones.map((m) => (
                <li key={m.no}><span className="ghx-roadmap-no">{m.no}</span><div><h3>{m.title}</h3><p>{m.note}</p></div></li>
              ))}
            </ol>
            <p className="ghx-note">Milestones describe planned work, not confirmed dates.</p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="ghx-section">
          <div className="ghx-wrap ghx-contact">
            <SectionHead kicker="Get in touch" title={<>Visit <em>GearHead RC Hub.</em></>} text={d.address} />
            <div className="ghx-contact-grid">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="ghx-contact-item"><MessageCircle size={20} /><span><strong>WhatsApp</strong>{d.whatsapp}</span></a>
              <a href="tel:+96878308991" className="ghx-contact-item"><Phone size={20} /><span><strong>Phone</strong>{d.phone}</span></a>
              <a href={`mailto:${d.email}`} className="ghx-contact-item"><Mail size={20} /><span><strong>Email</strong>{d.email}</span></a>
              <a href={d.instagram} target="_blank" rel="noopener noreferrer" className="ghx-contact-item"><Instagram size={20} /><span><strong>Instagram</strong>@gearhead_oman</span></a>
              <a href={d.facebook} target="_blank" rel="noopener noreferrer" className="ghx-contact-item"><Facebook size={20} /><span><strong>Facebook</strong>GearHead Oman</span></a>
              <a href="https://maps.google.com/?q=Al+Maha+Petrol+Station+Bausher+Muscat" target="_blank" rel="noopener noreferrer" className="ghx-contact-item"><MapPin size={20} /><span><strong>Location</strong>Bausher, Muscat</span></a>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="app" />
    </div>
  );
}
