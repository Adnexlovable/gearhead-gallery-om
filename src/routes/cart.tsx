import { useSiteMedia, siteMediaStyle } from "@/lib/site-media";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { SectionHead } from "@/components/shop/SectionHead";
import { clearCart, setCartQty, useCart } from "@/lib/cart";
import { cartWhatsAppURL } from "@/lib/shop";

export const Route = createFileRoute("/cart")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Your Order — GearHead RC Hub" },
      { name: "description", content: "Review the RC items you picked and send your order to GearHead RC Hub on WhatsApp." },
      { property: "og:title", content: "Your Order — GearHead RC Hub" },
      { property: "og:description", content: "Send your RC order to GearHead RC Hub on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const lines = useCart();
  const total = lines.reduce((n, l) => n + l.qty, 0);
  const siteMedia = useSiteMedia();
  return (
    <div className="gearhead-home ghx-shop" style={siteMediaStyle(siteMedia)}>
      <AppNavbar />
      <main className="ghx-page ghx-wrap ghx-cart">
        <SectionHead as="h1" kicker="WhatsApp order" title={<>Your <em>order.</em></>} text="Pick your items here, then send the list to GearHead on WhatsApp. We confirm price, stock and pickup with you. No online payment." />
        {lines.length === 0 ? (
          <div className="ghx-coming">
            <ShoppingCart size={34} aria-hidden="true" />
            <h3>Your order is empty</h3>
            <p>Browse the collection and tap “Add” on anything you like.</p>
            <Link to="/store" className="ghx-btn ghx-btn-primary">Browse RC collection</Link>
          </div>
        ) : (
          <>
            <ul className="ghx-cart-list">
              {lines.map((l) => (
                <li key={l.slug + (l.color ?? "")} className="ghx-cart-line">
                  <div className="min-w-0">
                    <Link to="/product/$productId" params={{ productId: l.slug }} className="ghx-card-title">{l.name}</Link>
                    <p className="ghx-muted">{l.scale}{l.color ? ` · ${l.color}` : ""}</p>
                  </div>
                  <div className="ghx-qty">
                    <button type="button" aria-label={`Decrease ${l.name}`} onClick={() => setCartQty(l, l.qty - 1)}><Minus size={15} /></button>
                    <span>{l.qty}</span>
                    <button type="button" aria-label={`Increase ${l.name}`} onClick={() => setCartQty(l, l.qty + 1)}><Plus size={15} /></button>
                  </div>
                  <button type="button" className="ghx-icon-btn" aria-label={`Remove ${l.name}`} onClick={() => setCartQty(l, 0)}><Trash2 size={17} /></button>
                </li>
              ))}
            </ul>
            <div className="ghx-cart-foot">
              <span>{total} item{total === 1 ? "" : "s"}</span>
              <button type="button" className="ghx-btn ghx-btn-ghost" onClick={() => clearCart()}>Clear</button>
              <a href={cartWhatsAppURL(lines)} target="_blank" rel="noopener noreferrer" className="ghx-btn ghx-btn-primary ghx-btn-lg"><MessageCircle size={18} /> Send order on WhatsApp</a>
            </div>
          </>
        )}
      </main>
      <Footer variant="app" />
    </div>
  );
}
