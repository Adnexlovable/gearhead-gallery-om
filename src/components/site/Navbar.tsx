import { useEffect, useState, type MouseEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Menu, X, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActivePageSection, type PageSection } from "@/hooks/useActivePageSection";

const SECTIONS: readonly PageSection[] = [
  { id: "top", label: "Home / Hero" },
  { id: "experience", label: "RC Showroom" },
  { id: "catalog", label: "RC Categories" },
  { id: "commercial-thesis", label: "Indoor Track" },
  { id: "foundation", label: "About / Vision" },
  { id: "experience-detail", label: "Retail Experience" },
  { id: "investor-deck", label: "Investors" },
  { id: "future-roadmap", label: "Roadmap" },
  { id: "partnerships", label: "Contact / Partnership" },
];

const MAIN_PAGES = [
  { label: "Investor Home", href: "/", short: "Home" },
  { label: "RC Shopping App", href: "/app", short: "RC App" },
  { label: "Product Catalogue", href: "/store", short: "Products" },
] as const;

import headerLogo from "@/assets/gearhead-header-logo.png";

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const activeSection = useActivePageSection(pathname, SECTIONS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      setSignedIn(Boolean(data.user));
      if (!data.user) {
        setIsAdmin(false);
        return;
      }
      const { data: allowed } = await supabase.rpc("is_admin");
      setIsAdmin(Boolean(allowed));
    };
    void check();
    const { data: subscriber } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        window.setTimeout(() => { void check(); }, 0);
      }
    });
    return () => subscriber.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const jumpToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (pathname !== "/") return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const dest = id === "top" ? "/" : "/#" + id;
    window.history.pushState(null, "", dest);
    target.scrollIntoView({ behavior: "instant", block: "start" });
    window.dispatchEvent(new Event("hashchange"));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  return (
    <header className={`gh-primary-header fixed inset-x-0 top-0 z-[110] transition-[padding,background-color,border-color] duration-300 ${scrolled || open ? "gh-header-solid py-1" : "gh-header-clear py-1"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
        <Link to="/" onClick={() => setOpen(false)} className="gh-navbar-brand flex min-w-0 shrink-0 items-center gap-2.5" aria-label="GearHead RC Hub — Investor Home">
          <img src={headerLogo} width={900} height={388} decoding="async" alt="GearHead RC Hub, a brand of ADNEX.WORLD" className="gh-header-logo" />
            <span className="gh-logo-sub">A BRAND OF ADNEX.WORLD</span>
        </Link>

        <nav className="gh-page-nav hidden items-center gap-1 lg:flex" aria-label="Main pages">
          {MAIN_PAGES.map((page) => (
            <Link key={page.href} to={page.href} aria-current={pathname === page.href ? "page" : undefined}
              className={`gh-page-nav-item rounded-md px-3 py-2 text-xs font-extrabold transition-colors ${pathname === page.href ? "is-active bg-[#ff961b]/15 text-[#ffb75b]" : "text-[#f5ece1] hover:bg-white/5 hover:text-[#ffc17d]"}`}>
              {page.short}
            </Link>
          ))}
          <details className="gh-sections-dropdown relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold text-[#f5ece1] hover:bg-white/5 hover:text-[#ffc17d]">Sections <ChevronDown size={13}/></summary>
            <div className="gh-sections-flyout absolute right-0 top-full z-[130] mt-2 w-60 overflow-y-auto rounded-xl border border-[#ff973c]/60 bg-[#081320]/98 p-2 shadow-2xl">
              {SECTIONS.map((section) => (
                <a key={section.id} href={section.id === "top" ? "/" : "/#" + section.id}
                  aria-current={activeSection === section.id && pathname === "/" ? "location" : undefined}
                  onClick={(event) => jumpToSection(event, section.id)}
                  className={`gh-section-menu-item flex rounded-lg px-3 py-2 text-xs font-bold ${pathname === "/" && activeSection === section.id ? "is-active bg-[#ff921c]/18 text-[#ffbd74]" : "text-[#f5e8d9] hover:bg-[#ff921c]/10"}`}>{section.label}</a>
              ))}
            </div>
          </details>
          <a href="/#investor-deck" onClick={(e)=>jumpToSection(e,"investor-deck")} className="gh-page-nav-item ml-1 rounded-md border border-[#ff9c36]/70 bg-[#ff9b25]/12 px-3 py-2 text-xs font-bold text-[#ffbf79] hover:bg-[#ff921c]/20">Investors</a>
          {isAdmin && <Link to="/admin" className="px-2 py-1 text-xs font-bold text-[#ffb970]">Dashboard</Link>}
          {signedIn ? (
            <button onClick={signOut} className="inline-flex items-center gap-1 px-2 text-xs text-[#e9ddce]"><LogOut size={14}/> Sign out</button>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-1 px-2 text-xs text-[#e9ddce]"><User size={14}/> Sign in</Link>
          )}
        </nav>

        <button type="button" aria-expanded={open} aria-controls="gh-investor-mobile-menu" aria-label={open ? "Close main menu" : "Open main menu"}
          onClick={() => setOpen(v => !v)}
          className="gh-mobile-menu-toggle grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#ff9c42]/70 bg-[#ff961e]/10 text-[#ffbd70] lg:hidden">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>


      {open && (
        <nav id="gh-investor-mobile-menu" aria-label="Mobile page and section navigation"
          className="gh-mobile-drawer absolute inset-x-2 top-full z-[140] mt-1 max-h-[min(76vh,620px)] overflow-y-auto rounded-xl border border-[#ff9534]/75 bg-[#071321]/98 px-4 py-4 shadow-[0_25px_60px_#000c] lg:hidden">
          <div className="gh-nav-group-caption">MAIN PAGES</div>
          <div className="mt-2 grid gap-1.5">
            {MAIN_PAGES.map((page) => (
              <Link key={page.href} to={page.href} onClick={() => setOpen(false)}
                aria-current={pathname === page.href ? "page" : undefined}
                className={`gh-nav-drawer-link flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 text-sm font-extrabold ${pathname === page.href ? "is-active border-[#ffad57] bg-[#ff9c2b]/18 text-[#ffce87]" : "border-[#f28f37]/20 text-white hover:bg-[#ff9c2b]/12"}`}>
                {page.label} {pathname === page.href ? <span className="text-[10px] text-[#ffd195]">CURRENT</span> : <ChevronRight size={15}/>}
              </Link>
            ))}
          </div>
          <div className="gh-nav-group-caption mt-5">INVESTOR HOME SECTIONS</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SECTIONS.map((section) => (
              <a key={section.id} href={section.id === "top" ? "/" : "/#" + section.id}
                onClick={(e) => jumpToSection(e, section.id)}
                aria-current={pathname === "/" && activeSection === section.id ? "location" : undefined}
                className={`gh-nav-drawer-link flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold ${pathname === "/" && activeSection === section.id ? "is-active border-[#ffb967] bg-[#ff921e]/18 text-[#ffd092]" : "border-[#e59242]/25 text-[#f9ede2] hover:bg-[#ff921c]/12"}`}>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeSection === section.id ? "bg-[#ffab43]" : "bg-[#e4a760]/40"}`}/>{section.label}
              </a>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#f4983e]/30 pt-4">
            {isAdmin ? <Link to="/admin" onClick={()=>setOpen(false)} className="text-xs font-bold text-[#ffbb64]">Admin Dashboard</Link> : <span className="text-xs text-[#d4c3b3]">GearHead RC Hub · Muscat</span>}
            {signedIn ? <button onClick={signOut} className="text-xs font-bold text-[#ffcf99]">Sign out</button> : <Link to="/auth" onClick={()=>setOpen(false)} className="text-xs font-bold text-[#ffcf99]">Sign in</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
