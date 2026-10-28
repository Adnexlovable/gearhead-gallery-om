import footerLogo from "@/assets/gearhead-footer-logo.png";
import { ArrowLeftRight, ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { DEFAULT_SHOP_DETAILS } from "@/lib/shop-details";

const quickLinks = [
  { label: "The Vision", href: "/#foundation" },
  { label: "Showroom Experience", href: "/#experience-detail" },
  { label: "RC Inventory", href: "/#catalog" },
  { label: "RC Shopping App", href: "/app" },
  { label: "Indoor RC Track", href: "/#commercial-thesis" },
  { label: "Investor Opportunity", href: "/#investor-deck" },
];

const appLinks = [
  { label: "Shop Home", href: "/app" },
  { label: "Full RC Collection", href: "/store" },
  { label: "Performance RC", href: "/collection/performance" },
  { label: "Scale Crawlers", href: "/collection/crawlers" },
  { label: "Diecast Models", href: "/collection/diecast" },
  { label: "Spare Parts & Upgrades", href: "/collection/parts" },
  { label: "Product Finder", href: "/app#finder" },
  { label: "Your Order", href: "/cart" },
];

export function Footer({ variant = "investor" }: { variant?: "investor" | "app" }) {
  const links = variant === "app" ? appLinks : quickLinks;
  return (
    <footer className="gh-theme-footer relative overflow-hidden border-t-2 border-[#ff9125] px-5 pb-7 pt-12 text-[#fff8ed] md:px-10 md:pb-9 md:pt-16">
      <div className="gh-footer-shell relative z-10 mx-auto grid max-w-7xl gap-9 md:grid-cols-[1.25fr_1fr_1fr] md:gap-12">
        <div className="gh-footer-brand">
          <a href={variant === "app" ? "/app" : "/"} aria-label="GearHead RC Hub home" className="inline-block">
            <img
              src={footerLogo}
              width={520}
              height={500}
              alt="GearHead RC Hub — Jeep Wrangler, gear ring and mountain emblem"
              loading="lazy"
              decoding="async"
              className="gh-footer-logo h-auto w-[200px] object-contain drop-shadow-[0_0_14px_rgba(255,140,30,.35)] sm:w-[230px]"
            />
          </a>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#fff2e5]">
            A new RC experience for Oman. RC vehicles, scale crawlers,
            technical service, parts and off-road hobby culture,
            planned for the Bousher flagship.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="gh-footer-heading font-display text-sm font-extrabold uppercase tracking-[.12em] text-[#ffb65c]">Explore</h2>
          <ul className="mt-5 grid gap-3">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="gh-footer-link inline-flex items-center gap-2 text-sm font-semibold text-[#fff1df] transition-colors hover:text-[#ffae45]">
                  <span className="h-[5px] w-[5px] rotate-45 bg-[#ff9d30]" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="gh-footer-heading font-display text-sm font-extrabold uppercase tracking-[.12em] text-[#ffb65c]">Muscat, Oman</h2>
          <p className="mt-5 flex items-start gap-2 text-sm text-[#fff4e8]">
            <MapPin size={17} className="mt-1 shrink-0 text-[#ffb45f]" />
            Bousher Sand Dunes, Muscat
          </p>
          <a href="tel:+96898675132" className="mt-5 flex items-center gap-2 text-sm font-bold text-[#ffe7c5] hover:text-white">
            <Phone size={16} className="shrink-0 text-[#ffb45f]" /> +968 98675132
          </a>
          <a href="mailto:Adnant.t636@gmail.com" className="mt-3 flex items-center gap-2 break-all text-sm font-medium text-[#fff0db] hover:text-white">
            <Mail size={16} className="shrink-0 text-[#ffb45f]" /> Adnant.t636@gmail.com
          </a>
          <div className="mt-4 flex gap-3">
            <a href={DEFAULT_SHOP_DETAILS.instagram} target="_blank" rel="noopener noreferrer" aria-label="GearHead on Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-[#ff9e39]/60 text-[#ffd098] hover:text-white"><Instagram size={18} /></a>
            <a href={DEFAULT_SHOP_DETAILS.facebook} target="_blank" rel="noopener noreferrer" aria-label="GearHead on Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-[#ff9e39]/60 text-[#ffd098] hover:text-white"><Facebook size={18} /></a>
          </div>
          <a href="https://wa.me/96898675132" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 border-b border-[#ff9e39]/70 pb-1 text-sm font-bold text-[#ffd098] hover:text-white">
            WhatsApp GearHead <ArrowUpRight size={17} />
          </a>
          <div className="mt-6 space-y-1.5 text-xs leading-6 text-[#eee1d2]">
            <p><strong>Planned RC shop:</strong> Bousher Sand Dunes, Muscat, Oman</p>
            <p><strong>Registered company address:</strong> Muscat, Muscat Governorate, Oman</p>
            <p>P.O. Box 1250 · Postal Code 120</p>
          </div>
          <p className="mt-7 max-w-xs text-xs leading-6 text-[#ddd5cc]">
            GearHead RC Hub is a proposed project of ADNAN TRADING SERVICES LLC (CR 1634293).
            Interior imagery and development stages are design concepts.
          </p>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-[#ffa34a]/55 pt-6 text-[11px] font-medium text-[#f5ddc3]">
        <span>© {new Date().getFullYear()} GearHead RC Hub · Adnan Trading Services LLC</span>
        <a href={variant === "app" ? "/" : "/app"} className="inline-flex items-center gap-2 rounded-full border border-[#ffa34a]/70 px-3 py-1.5 font-bold text-[#ffd098] hover:text-white">
          <ArrowLeftRight size={14} aria-hidden="true" /> {variant === "app" ? "Switch to investor site" : "Switch to GearHead App"}
        </a>
        <span>Muscat · Sultanate of Oman</span>
      </div>
    </footer>
  );
}
