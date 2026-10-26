import { useEffect, useState, type MouseEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, CarFront, ChevronDown, ChevronRight, Grid2X2, Home, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useActivePageSection, type PageSection } from "@/hooks/useActivePageSection";

const logo = "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/d33cbb38-c247-46d7-9fa2-08cdf797e71c.png";

const MAIN_PAGES = [
  { href: "/", label: "Investor Home", short: "Home" },
  { href: "/app", label: "RC Shopping App", short: "RC App" },
  { href: "/store", label: "Product Catalogue", short: "Products" },
] as const;

const APP_SECTIONS: readonly PageSection[] = [
  { id: "top", label: "App Home / Hero" },
  { id: "app-categories", label: "RC Categories" },
  { id: "app-shop", label: "Showroom" },
  { id: "app-products", label: "Featured Products" },
  { id: "app-service", label: "Service" },
  { id: "app-track", label: "Indoor Track" },
  { id: "app-contact", label: "Contact" },
];
const PRODUCT_SECTIONS: readonly PageSection[] = [
  { id: "top", label: "Product Catalogue" },
  { id: "performance", label: "Performance RC" },
  { id: "crawlers", label: "Scale Crawlers" },
  { id: "diecast", label: "Diecast & Collectibles" },
  { id: "parts", label: "Spare Parts" },
  { id: "contact", label: "Contact" },
];

export function AppNavbar() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const [open, setOpen] = useState(false);
  const onStore = pathname === "/store";
  const sections = onStore ? PRODUCT_SECTIONS : APP_SECTIONS;
  const activeSection = useActivePageSection(pathname, sections);
  const currentSection = sections.find(section => section.id === activeSection)?.label ?? sections[0].label;
  const currentPage = onStore ? "Product Catalogue" : "RC Shopping App";

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, pathname]);

  const jumpSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const dest = id === "top" ? pathname : pathname + "#" + id;
    window.history.pushState(null, "", dest);
    el.scrollIntoView({ behavior: "instant", block: "start" });
    window.dispatchEvent(new Event("hashchange"));
  };

  const sectionURL = (id: string) => id === "top" ? pathname : pathname + "#" + id;

  return (
    <>
      <header className="gh-app-header gh-primary-header fixed inset-x-0 top-0 z-[110] border-b border-[#f89a31]/65 bg-[#040b15]/96 py-2 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
          <Link to="/app" onClick={() => setOpen(false)} aria-label="GearHead RC Hub shopping app home" className="gh-navbar-brand flex min-w-0 items-center gap-2.5">
            <img src={logo} alt="" width={50} height={50} className="h-11 w-11 shrink-0 object-contain drop-shadow-[0_0_9px_rgba(255,148,42,.4)]" />
            <span className="gh-app-brand-wordmark flex min-w-0 flex-col leading-none">
              <span className="font-display text-[15px] font-black tracking-tight text-white">GEAR<span className="text-[#ff9829]">HEAD</span> <span className="text-[11px] text-white">RC HUB</span></span>
              <span className="mt-1 text-[8px] leading-tight text-[#ffe1b7]">A brand of <strong className="tracking-wide text-[#ffb34e]">ADNEX.WORLD</strong></span>
            </span>
          </Link>
          <nav className="gh-page-nav hidden items-center gap-1 lg:flex" aria-label="Main website pages">
            {MAIN_PAGES.map(page => (
              <Link key={page.href} to={page.href}
                aria-current={pathname === page.href ? "page" : undefined}
                className={`gh-page-nav-item rounded-md px-3 py-2 text-xs font-bold transition-colors ${pathname === page.href ? "is-active bg-[#ff9b29]/18 text-[#ffc182]" : "text-[#f5eada] hover:text-[#ffc182] hover:bg-white/5"}`}>
                {page.short}
              </Link>
            ))}
            <details className="gh-sections-dropdown relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-xs font-bold text-[#f5eada] hover:bg-white/5">Sections <ChevronDown size={13}/></summary>
              <div className="gh-sections-flyout absolute right-0 top-full z-[125] mt-2 w-60 overflow-y-auto rounded-xl border border-[#ffac59]/60 bg-[#071421] p-2 shadow-2xl">
                {sections.map(section => (
                  <a key={section.id} href={sectionURL(section.id)} onClick={event => jumpSection(event, section.id)}
                    aria-current={activeSection === section.id ? "location" : undefined}
                    className={`gh-section-menu-item block rounded-lg px-3 py-2.5 text-xs font-bold ${activeSection === section.id ? "is-active bg-[#ff9c27]/17 text-[#ffca8b]" : "text-[#f5e8d8] hover:bg-[#ff9c27]/10"}`}>{section.label}</a>
                ))}
              </div>
            </details>
            <a href="https://wa.me/96898675132" target="_blank" rel="noopener noreferrer"
              className="ml-2 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#ffb45b] bg-[#f99c30] px-3 text-xs font-black text-[#111b28]"><MessageCircle size={15}/> Enquire to Buy</a>
          </nav>
          <button type="button" aria-expanded={open} aria-controls="gh-app-mobile-menu"
            aria-label={open ? "Close shopping menu" : "Open shopping menu"}
            onClick={() => setOpen(!open)}
            className="gh-mobile-menu-toggle grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#ff9e3d]/70 bg-[#ff981b]/10 text-[#ffb768] lg:hidden">
            {open ? <X size={21}/> : <Menu size={21}/>}
          </button>
        </div>

        <div className="gh-location-strip mx-auto mt-1 flex max-w-7xl items-center gap-1.5 px-4 pb-0.5 text-[10px] font-bold text-[#d4c4b4] md:px-8" aria-label="Current page and section">
          <Link to={onStore ? "/app" : "/"} aria-label={onStore ? "Back to RC Shopping App" : "Back to Investor Home"} title={onStore ? "Back to RC App" : "Back to Investor Home"} className="mr-1 inline-flex shrink-0 items-center gap-1 rounded border border-[#ffac57]/35 px-1.5 py-1 text-[#ffbe73] hover:border-[#ffbe73]">
            <ArrowLeft size={12} aria-hidden="true" /><span className="hidden sm:inline">Back</span>
          </Link>
          <Home size={11} className="shrink-0 text-[#ffae54]"/>
          <span className="whitespace-nowrap">{currentPage}</span>
          <ChevronRight size={11} className="shrink-0 text-[#e89844]"/>
          <span className="gh-location-current min-w-0 truncate text-[#ffc282]">{currentSection}</span>
          <span className="ml-auto font-mono text-[9px] font-black tracking-[.12em] text-[#ffae58] lg:hidden">{open ? "CLOSE MENU" : "MENU"}</span>
        </div>

        {open && (
          <nav id="gh-app-mobile-menu" aria-label="Shopping app mobile pages and sections"
            className="gh-mobile-drawer absolute inset-x-2 top-full z-[145] mt-1 max-h-[min(76vh,620px)] overflow-y-auto rounded-xl border border-[#ff9d41]/75 bg-[#071321]/98 px-4 py-4 shadow-[0_20px_60px_#000d] lg:hidden">
            <div className="gh-nav-group-caption">MAIN PAGES</div>
            <div className="mt-2 grid gap-1.5">
              {MAIN_PAGES.map(page => (
                <Link key={page.href} to={page.href} onClick={() => setOpen(false)}
                  aria-current={pathname === page.href ? "page" : undefined}
                  className={`gh-nav-drawer-link flex min-h-11 items-center justify-between rounded-lg border px-3 text-sm font-extrabold ${pathname === page.href ? "is-active border-[#ffb769] bg-[#ff981e]/18 text-[#ffce90]" : "border-[#ec963d]/20 text-white hover:bg-[#ff981e]/10"}`}>
                  {page.label} {pathname === page.href ? <span className="text-[10px] text-[#ffd198]">CURRENT</span> : <ChevronRight size={16}/>}
                </Link>
              ))}
            </div>
            <div className="gh-nav-group-caption mt-5">{onStore ? "PRODUCT CATEGORIES" : "SHOPPING APP SECTIONS"}</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {sections.map(section => (
                <a key={section.id} href={sectionURL(section.id)} onClick={event => jumpSection(event, section.id)}
                  aria-current={activeSection === section.id ? "location" : undefined}
                  className={`gh-nav-drawer-link flex min-h-11 items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px] font-bold ${activeSection === section.id ? "is-active border-[#ffb769] bg-[#ff981e]/18 text-[#ffd39e]" : "border-[#ef913b]/25 text-[#f6ecde] hover:bg-[#ff981e]/10"}`}>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeSection === section.id ? "bg-[#ffaf4c]" : "bg-[#e0a259]/45"}`}/>{section.label}
                </a>
              ))}
            </div>
            <div className="mt-5 grid gap-3 border-t border-[#efa048]/30 pt-4 text-xs text-[#ffd09c]">
              <a href="tel:+96898675132" className="flex items-center gap-2"><Phone size={15}/>+968 98675132</a>
              <a href="mailto:Adnant.t636@gmail.com" className="flex items-center gap-2"><Mail size={15}/>Email GearHead</a>
            </div>
          </nav>
        )}
      </header>
      <nav aria-label="App bottom navigation" className="gh-app-bottomnav fixed inset-x-0 bottom-0 z-[105] border-t border-[#ff9d42]/60 bg-[#050c15]/95 px-2 pb-[max(.4rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_35px_#0008] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          <Link to="/app" aria-current={!onStore ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold ${!onStore ? "bg-[#ff9b25]/12 text-[#ffbf75]" : "text-[#f7dfbc]"}`}><Home size={19}/>App Home</Link>
          <Link to="/store" aria-current={onStore ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold ${onStore ? "bg-[#ff9b25]/12 text-[#ffbf75]" : "text-[#f7dfbc]"}`}><CarFront size={19}/>Products</Link>
          <a href={onStore ? "/store#performance" : "/app#app-categories"}
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold text-[#ffe6c3]"><Grid2X2 size={19}/>Categories</a>
          <a href="https://wa.me/96898675132" target="_blank" rel="noopener noreferrer"
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold text-[#ffe6c3]"><MessageCircle size={19}/>Enquire</a>
        </div>
      </nav>
    </>
  );
}
