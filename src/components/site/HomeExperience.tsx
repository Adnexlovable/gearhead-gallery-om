import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight, BatteryCharging, CarFront, CheckCircle2, ChevronRight,
  Gauge, Handshake, MapPin, Mountain, PackageCheck, Route, ShieldCheck, Sparkles,
  Wrench, Zap,
} from "lucide-react";
import { InvestorDeckRequest } from "./InvestorDeckRequest";
import { CinematicScene } from "./CinematicScene";

// Images are visual concepts from the GearHead RC shop-design references.
// They do not represent photographs of a finished or trading storefront.
const art = {
  desert: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/0530ccd4-2eb8-4d34-98b7-c890ccb70c38.png",
  showroom: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a7fbbad-e215-4d63-a8c3-550220dcd0c3.jpg",
  display: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/143af584-f2db-4030-9dee-dea755f2bcac.jpg",
  interior: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/f92c9489-55d1-4c7d-9819-a7294ce8a7cd.jpg",
  concept: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/6a42db62-b4c4-4df2-b2e1-d82e50c20cb4.png",
};

const motion = {
  showroomMobile: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/68499411-3243-4bb8-b263-693c499e95ef.mp4",
  showroomDesktop: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/240fa4da-8a24-4bd5-b52d-ec77257493fd.mp4",
  track: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/19986706-a56f-4ac1-8542-9f1a432b8c92.mp4",
  service: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/3b8318e1-4713-4c93-9673-c8c1798ac307.mp4",
  retail: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/c396cda3-deca-4982-8354-ebe8d13e06d8.mp4",
};

function Atmosphere({ image, position = "center", video }: {
  image: string; position?: string; video?: "showroom" | "track";
}) {
  if (video) {
    return <CinematicScene className="gh-chapter-visual" poster={image}
      mobileSrc={video === "track" ? motion.track : motion.showroomMobile}
      desktopSrc={video === "track" ? motion.track : motion.showroomDesktop} />;
  }
  return (
    <div aria-hidden="true" className="gh-chapter-visual" style={{
      backgroundImage: "url('" + image + "')",
      backgroundPosition: position,
    } as CSSProperties} />
  );
}

function Heading({ eyebrow, children, description }: { eyebrow: string; children: ReactNode; description?: string }) {
  return (
    <div className="gh-intro">
      <div className="gh-eyebrow"><span className="gh-eyebrow-bolt" />{eyebrow}</div>
      <h2 className="gh-chapter-title">{children}</h2>
      {description && <p className="gh-chapter-desc">{description}</p>}
    </div>
  );
}

const domains = [
  { icon: CarFront, label: "RC CARS", sub: "Racing & Fun", href: "/store#performance" },
  { icon: Mountain, label: "CRAWLERS", sub: "Scale & Adventure", href: "/store#crawlers" },
  { icon: PackageCheck, label: "SPARE PARTS", sub: "Wide Selection", href: "/store#parts" },
  { icon: Wrench, label: "SERVICE", sub: "Tuning & Repairs", href: "/#commercial-thesis" },
  { icon: Route, label: "INDOOR TRACK", sub: "Test & Play", href: "/#commercial-thesis" },
];

const categories = [
  {
    icon: Gauge,
    cover: art.concept,
    href: "/store#performance",
    eyebrow: "01 / Speed",
    title: "Performance RC",
    subtitle: "Built for speed and control",
    models: ["Nitro Gas Buggy · 1:8", "Brushless Speed Truck · 1:10", "Rally Truggy · 1:14", "RC Drift Car · 1:10"],
  },
  {
    icon: Mountain,
    cover: art.showroom,
    href: "/store#crawlers",
    eyebrow: "02 / Adventure",
    title: "Scale Crawlers",
    subtitle: "Trail realism and technical terrain",
    models: ["Wrangler Metal · 1:10", "Land Cruiser LC80 · 1:12", "Ultra4 Bronco · 1:18", "Defender D110 · 1:10"],
  },
  {
    icon: CarFront,
    cover: art.interior,
    href: "/store#diecast",
    eyebrow: "03 / Collectors",
    title: "Diecast Gallery",
    subtitle: "Automotive collection and display",
    models: ["F1 Championship Editions", "Premium Exotic Supercars", "Hot Wheels Premium Sets", "Limited-Edition Series"],
  },
  {
    icon: BatteryCharging,
    cover: art.display,
    href: "/store#parts",
    eyebrow: "04 / Workshop",
    title: "Parts & Upgrades",
    subtitle: "Maintain, tune and personalise",
    models: ["LiPo 3S–6S Batteries", "Smart Fast Chargers", "Precision RC Tool Kits", "Custom Body Paint & Accessories"],
  },
];

const experiences = [
  { num: "01", title: "Explore", desc: "Discover curated RC vehicles and scale models in the planned retail display." },
  { num: "02", title: "Experience", desc: "See crawler capability on a modular indoor micro-dune and rocky obstacle course." },
  { num: "03", title: "Tune", desc: "Get workshop advice, spare parts and performance-upgrade support." },
];

const milestones = [
  { no: "01", title: "Secure the flagship", note: "Finalise the Bousher premises agreement and statutory approvals." },
  { no: "02", title: "Build the experience", note: "Complete the shopfront, RC terrain, display racks and service area." },
  { no: "03", title: "Stock & test", note: "Verify supplier orders, inventory quality, POS and customer journeys." },
  { no: "04", title: "Open & learn", note: "Activate the local off-road community and refine the retail model." },
];

export function HomeExperience() {
  const [deckOpen, setDeckOpen] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".gearhead-home .gh-chapter, .gearhead-home .gh-approved-showroom"));
    if (!sections.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const center = window.innerHeight / 2;
      for (const section of sections) {
        const box = section.getBoundingClientRect();
        if (box.bottom < -150 || box.top > window.innerHeight + 150) continue;
        const offset = (box.top + box.height / 2 - center) / window.innerHeight;
        section.style.setProperty("--gh-parallax", Math.max(-65, Math.min(65, offset * -32)).toFixed(1) + "px");
      }
    };
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <nav className="gh-capabilities gh-approved-category-strip" aria-label="Explore GearHead RC categories">
        <div className="gh-capabilities-inner">
          {domains.map(({ icon: Icon, label, sub, href }) => (
            <a href={href} className="gh-capability" key={label} aria-label={label + " — " + sub}>
              <Icon aria-hidden="true" size={25} strokeWidth={1.9} />
              <div><strong>{label}</strong><span>{sub}</span></div>
            </a>
          ))}
        </div>
      </nav>

      <section id="experience" className="gh-approved-showroom" aria-labelledby="gh-showroom-heading">
        <div className="gh-approved-showroom-photo" style={{backgroundImage: `url("${art.showroom}")`}} aria-hidden="true" />
        <div className="gh-approved-showroom-shade" aria-hidden="true" />
        <div className="gh-approved-showroom-inner">
          <div className="gh-approved-showroom-copy">
            <div className="gh-showroom-kicker">EXPLORE OUR</div>
            <h2 id="gh-showroom-heading">RC SHOWROOM <span>EXPERIENCE</span></h2>
            <p>A premium RC destination planned for Muscat with retail, an indoor crawler track, a dedicated service centre and a complete hobby experience.</p>
            <Link to="/store" className="gh-approved-shop-button">
              Explore the Shop <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="gh-showroom-footnote">Proposed Bousher Sand Dunes flagship • Interior design concept</div>
      </section>

      <section id="catalog" className="gh-chapter gh-chapter-catalog">
        <Atmosphere image={art.desert} position="center 70%" />
        <div className="gh-chapter-inner">
          <Heading eyebrow="03 / Inventory Blueprint">Explore the <em>RC world.</em> 
          </Heading>
          <p className="gh-chapter-desc">Four focused product departments from the GearHead inventory plan. These are proposed sourcing categories, not a claim of stock availability or retail pricing.</p>
          <div className="gh-category-grid">
            {categories.map(({ icon: Icon, cover, href, eyebrow, title, subtitle, models }) => (
              <article className="gh-category-card gh-metal-frame" key={title}>
                <a href={href} className="gh-category-cover" aria-label={"Explore " + title}>
                  <img src={cover} alt={title + " GearHead RC concept cover"} loading="lazy" />
                  <div className="gh-category-icon"><Icon size={25} strokeWidth={1.65} aria-hidden="true" /></div>
                </a>
                <div className="gh-category-body">
                  <span className="gh-card-eyebrow">{eyebrow}</span>
                  <h3>{title}</h3>
                  <p>{subtitle}</p>
                  <ul>{models.map(model => <li key={model}><ChevronRight size={13} aria-hidden="true" />{model}</li>)}</ul>
                  <a href={href} className="gh-category-open">Explore Products <ArrowUpRight size={15} aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
          <div className="gh-small-action">
            <Link to="/store" className="gh-outline-action">Explore the online catalogue <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section id="commercial-thesis" className="gh-chapter gh-chapter-track">
        <Atmosphere image={art.concept} position="center" />
        <div className="gh-chapter-inner">
          <Heading eyebrow="04 / Our Model">More than a store. <em>A place to drive.</em></Heading>
          <div className="gh-track-grid">
            <div className="gh-metal-frame gh-track-summary">
              <div className="gh-big-number">84 <span>m²</span></div>
              <h3>One connected RC experience</h3>
              <p>Planned as an integrated 7 m × 12 m retail and experience environment, with RC showcases, a compact track, service facilities and customer circulation.</p>
              <div className="gh-track-capsules"><span>INDOOR TERRAIN</span><span>PRODUCT DEMO</span><span>RC SERVICE</span></div>
            </div>
            <div className="gh-track-steps">
              {experiences.map((item) => (
                <div className="gh-metal-frame gh-track-step" key={item.num}>
                  <div className="gh-track-num">{item.num}</div>
                  <div><h3>{item.title}</h3><p>{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="foundation" className="gh-chapter gh-chapter-foundation">
        <Atmosphere image={art.display} position="70% center" />
        <div className="gh-chapter-inner gh-feature-grid">
          <div className="gh-metal-frame gh-frame-dark">
            <Heading eyebrow="01 / The Vision">Built for <em>real RC adventure.</em></Heading>
            <p className="gh-prose">
              GearHead RC Hub brings performance RC vehicles, scale crawlers, hands-on
              experiences, spare parts and workshop expertise together in one proposed
              flagship destination near Bousher Sand Dunes, Muscat.
            </p>
            <div className="gh-stat-row">
              <div><strong>84 <small>m²</small></strong><span>Proposed flagship</span></div>
              <div><strong>7 × 12 <small>m</small></strong><span>Shop dimensions</span></div>
              <div><strong>13+ <small>yrs</small></strong><span>Founder Oman experience</span></div>
            </div>
            <div className="gh-brand-line"><ShieldCheck size={16} /> Project of Adnan Trading Services LLC <span>CR 1634293</span></div>
          </div>
          <div className="gh-feature-photo gh-industrial-border">
            <img src={art.showroom} loading="lazy" alt="Proposed GearHead Bousher RC flagship showroom concept" />
            <div className="gh-photo-caption"><span>DESIGN CONCEPT</span><strong>Bousher RC flagship</strong></div>
          </div>
        </div>
      </section>

      <section id="experience-detail" className="gh-chapter gh-chapter-experience">
        <Atmosphere image={art.showroom} position="center" />
        <div className="gh-chapter-inner">
          <Heading eyebrow="02 / Bousher Showroom">The <em>shop experience.</em></Heading>
          <p className="gh-chapter-desc">The proposed 84 m² site combines retail displays, an RC trial course, a dedicated service workshop and a practical customer journey.</p>
          <div className="gh-experience-grid gh-four-media-grid">
            <figure className="gh-showcase-main gh-industrial-border">
              <CinematicScene className="gh-showcase-motion" poster={art.concept} mobileSrc={motion.track} />
              <figcaption><strong>TRACK-TO-RETAIL</strong><span>Test drive • Experience</span></figcaption>
            </figure>
            <figure className="gh-industrial-border">
              <CinematicScene className="gh-showcase-motion" poster={art.display} mobileSrc={motion.retail} />
              <figcaption><strong>Retail Display</strong><span>RC cars • Parts</span></figcaption>
            </figure>
            <figure className="gh-industrial-border">
              <CinematicScene className="gh-showcase-motion" poster={art.concept} mobileSrc={motion.track} />
              <figcaption><strong>Indoor Terrain</strong><span>Obstacles • Crawlers</span></figcaption>
            </figure>
            <figure className="gh-industrial-border">
              <CinematicScene className="gh-showcase-motion" poster={art.interior} mobileSrc={motion.service} />
              <figcaption><strong>RC Service & Tuning</strong><span>Maintenance • Upgrades</span></figcaption>
            </figure>
          </div>
          <p className="gh-disclaimer">Interior images are design concepts for the planned shop, not photographs of a completed business.</p>
        </div>
      </section>

      <section id="investor-deck" className="gh-chapter gh-chapter-investors">
        <Atmosphere image={art.desert} position="right center" />
        <div className="gh-chapter-inner gh-investor-grid">
          <div className="gh-metal-frame gh-investor-copy" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
            <Heading eyebrow="05 / Investment Opportunity">Fuel the next <em>RC destination.</em></Heading>
            <p className="gh-prose">GearHead RC Hub is preparing a Bousher-based track-to-retail concept designed around four complementary revenue streams: RC vehicles, parts and batteries, testing experiences and workshop services.</p>
            <div className="gh-investment-number"><span>PROPOSED LAUNCH FUNDING FRAMEWORK</span><strong>15,000 <small>OMR</small></strong></div>
            <p className="gh-disclaimer">The 15,000 OMR figure is a planning target from the investor documents. Funding, returns and partnership terms remain subject to verification and a formal agreement; no return is guaranteed.</p>
            <button type="button" className="gh-solid-action" onClick={() => setDeckOpen(true)}>Request strategic investor deck <ArrowUpRight size={18} /></button>
          </div>
          <div className="gh-investor-points">
            {[
              { icon: PackageCheck, title: "Curated RC inventory", body: "Performance vehicles, crawlers, collectibles and parts." },
              { icon: Sparkles, title: "Immersive retail", body: "A premium 84 m² planned destination close to the dunes." },
              { icon: Zap, title: "Integrated demonstration", body: "An indoor track-to-retail product experience." },
              { icon: Handshake, title: "Strategic partners", body: "Private investment discussions, subject to due diligence." },
            ].map(({ icon: Icon, title, body }) => (
              <div className="gh-metal-frame gh-investor-point" key={title} style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}><Icon size={22} aria-hidden="true" /><div><strong>{title}</strong><span>{body}</span></div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="future-roadmap" className="gh-chapter gh-chapter-roadmap">
        <Atmosphere image={art.showroom} position="center" />
        <div className="gh-chapter-inner">
          <Heading eyebrow="06 / Launch Roadmap">From blueprint <em>to reality.</em></Heading>
          <div className="gh-milestones">
            {milestones.map(({ no, title, note }) => (
              <article className="gh-metal-frame gh-milestone" key={no}>
                <span className="gh-milestone-number">{no}</span>
                <CheckCircle2 size={22} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{note}</p>
              </article>
            ))}
          </div>
          <p className="gh-disclaimer">Roadmap milestones describe intended work, not completed work or confirmed launch dates.</p>
        </div>
      </section>

      <section id="partnerships" className="gh-chapter gh-chapter-contact">
        <Atmosphere image={art.display} position="60% center" />
        <div className="gh-chapter-inner">
          <div className="gh-metal-frame gh-contact-box" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
            <Heading eyebrow="07 / Connect With GearHead">Let's build the <em>RC future.</em></Heading>
            <p className="gh-prose">For strategic investment, distribution, off-road community or supplier partnerships, connect with the GearHead RC Hub team in Muscat.</p>
            <div className="gh-contact-actions">
              <button className="gh-solid-action" type="button" onClick={() => setDeckOpen(true)}>Request investor information <ArrowUpRight size={17} /></button>
              <a className="gh-outline-action" href="https://wa.me/96898675132" target="_blank" rel="noopener noreferrer">WhatsApp GearHead <ArrowUpRight size={17} /></a>
            </div>
            <div className="gh-contact-location"><MapPin size={16} /> Bousher Sand Dunes, Muscat, Oman <span>· A brand of Adnex.World</span></div>
          </div>
        </div>
      </section>

      <InvestorDeckRequest open={deckOpen} onClose={() => setDeckOpen(false)} />
    </>
  );
}
