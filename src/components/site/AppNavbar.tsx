import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Home, LayoutGrid, Menu, MessageCircle, Phone, Search, ShoppingCart, Sparkles, X } from "lucide-react";
import { SearchOverlay } from "@/components/shop/SearchOverlay";
import { useCartCount } from "@/lib/cart";
import { shopCatalogQuery } from "@/lib/shop-queries";
import { WHATSAPP_NUMBER } from "@/lib/shop";

const logo = "https://d2ol7oe51mr4n9.cloudfront.net/user_3KtZITH2XBnLOogmIhMqcChJhCe/d33cbb38-c247-46d7-9fa2-08cdf797e71c.png";

const NAV = [
  { label: "Home", to: "/app" },
  { label: "Investors", to: "/" },
  { label: "RC Collection", to: "/store" },
  { label: "Accessories", to: "/collection/$category", params: { category: "parts" } },
] as const;

export function AppNavbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const count = useCartCount();
  const { data } = useQuery({ ...shopCatalogQuery, enabled: open });

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: string, params?: { category: string }) =>
    params ? pathname === `/collection/${params.category}` : pathname === to;

  return (
    <>
      <header className="ghx-header gh-primary-header">
        <div className="ghx-header-row">
          <Link to="/app" className="ghx-brand" aria-label="GearHead RC Hub shop home">
            <img src={logo} alt="" width={48} height={48} />
            <span className="ghx-brand-copy">
              <span className="ghx-brand-name">GEAR<em>HEAD</em> <small>RC HUB</small></span>
              <span className="ghx-brand-sub">A brand of <strong>ADNEX.WORLD</strong></span>
            </span>
          </Link>
          <nav className="ghx-nav" aria-label="Shop pages">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} params={"params" in n ? n.params : undefined} className={isActive(n.to, "params" in n ? n.params : undefined) ? "is-active" : undefined}>{n.label}</Link>
            ))}
            <a href="/app#contact">Contact</a>
          </nav>
          <div className="ghx-header-tools">
            <button type="button" className="ghx-icon-btn" onClick={() => setSearching(true)} aria-label="Search products"><Search size={20} /></button>
            <Link to="/cart" className="ghx-icon-btn ghx-cart-btn" aria-label={`Your order, ${count} items`}>
              <ShoppingCart size={20} />
              {count > 0 && <span className="ghx-badge">{count}</span>}
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="ghx-btn ghx-btn-primary ghx-hide-sm">Get in touch</a>
            <button type="button" className="ghx-icon-btn ghx-menu-btn" aria-expanded={open} aria-controls="ghx-drawer" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="ghx-drawer" className="ghx-drawer" aria-label="Shop menu" data-lenis-prevent>
            <div className="ghx-drawer-caption">Pages</div>
            <div className="grid gap-1.5">
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} params={"params" in n ? n.params : undefined} className="ghx-drawer-link">{n.label}</Link>
              ))}
              <a href="/app#contact" className="ghx-drawer-link" onClick={() => setOpen(false)}>Contact</a>
              <a href="/app#finder" className="ghx-drawer-link" onClick={() => setOpen(false)}>Product finder</a>
            </div>
            {data && (
              <>
                <div className="ghx-drawer-caption">Categories</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {data.categories.map((c) => (
                    <Link key={c.slug} to="/collection/$category" params={{ category: c.slug }} className="ghx-drawer-link ghx-drawer-small">{c.name}</Link>
                  ))}
                </div>
              </>
            )}
            <div className="ghx-drawer-foot">
              <a href="tel:+96878308991"><Phone size={14} /> +968 7830 8991</a>
              <Link to="/" className="ghx-switch"><ArrowLeftRight size={14} /> Investor site</Link>
            </div>
          </nav>
        )}
      </header>

      <nav aria-label="App bottom navigation" className="ghx-bottomnav gh-app-bottomnav">
        <Link to="/app" className={pathname === "/app" ? "is-active" : undefined}><Home size={19} />Home</Link>
        <Link to="/store" className={pathname === "/store" || pathname.startsWith("/collection") || pathname.startsWith("/product") ? "is-active" : undefined}><LayoutGrid size={19} />Shop</Link>
        <a href="/app#finder"><Sparkles size={19} />Finder</a>
        <Link to="/cart" className={pathname === "/cart" ? "is-active" : undefined}>
          <span className="relative"><ShoppingCart size={19} />{count > 0 && <span className="ghx-badge ghx-badge-sm">{count}</span>}</span>Order
        </Link>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />WhatsApp</a>
      </nav>
      {searching && <SearchOverlay onClose={() => setSearching(false)} />}
    </>
  );
}
