import { useSiteMedia, siteMediaStyle } from "@/lib/site-media";
import { useEffect, useRef, useState } from "react";
import { shareMeta } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { shopCatalogQuery, shopProductQuery } from "@/lib/shop-queries";
import { addToCart } from "@/lib/cart";
import { PRICE_BAND_LABEL, productWhatsAppURL } from "@/lib/shop";

export const Route = createFileRoute("/product/$productId")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const [product] = await Promise.all([
      context.queryClient.ensureQueryData(shopProductQuery(params.productId)),
      context.queryClient.ensureQueryData(shopCatalogQuery),
    ]);
    if (!product) throw notFound();
    return { name: product.name, description: product.description, scale: product.scale };
  },
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.name} (${loaderData.scale}) — GearHead RC Hub` : "Product — GearHead RC Hub";
    const description = loaderData ? `${loaderData.description} Ask for price and availability at GearHead RC Hub, Muscat.` : "GearHead RC Hub product.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...shareMeta(`/product/${params.productId}`, title, description, "product"),
      ],
      links: [{ rel: "canonical", href: `https://gearheadrc.store/product/${params.productId}` }],
    };
  },
  notFoundComponent: () => (
    <div className="gearhead-home ghx-shop min-h-screen"><AppNavbar /><main className="ghx-wrap ghx-empty-page"><h1>Product not found</h1><Link to="/store" className="ghx-btn ghx-btn-primary">See all products</Link></main></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { data: product } = useSuspenseQuery(shopProductQuery(productId));
  const { data: catalog } = useSuspenseQuery(shopCatalogQuery);
  const p = product!;
  const category = catalog.categories.find((c) => c.slug === p.category);
  const related = catalog.products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 8);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState<string | undefined>(p.colors[0]?.name);
  const [qty, setQty] = useState(1);
  const track = useRef<HTMLDivElement>(null);
  const images = [...p.gallery, ...p.colors.flatMap((c) => (c.image ? [c.image] : []))];

  useEffect(() => { setActive(0); setQty(1); setColor(p.colors[0]?.name); track.current?.scrollTo({ left: 0 }); }, [p.slug, p.colors]);

  const go = (i: number) => {
    setActive(i);
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };
  const pickColor = (name: string, image?: string) => {
    setColor(name);
    if (image) { const i = images.indexOf(image); if (i >= 0) go(i); }
  };

  const siteMedia = useSiteMedia();
  return (
    <div className="gearhead-home ghx-shop" style={siteMediaStyle(siteMedia)}>
      <AppNavbar />
      <main className="ghx-page ghx-wrap">
        <nav className="ghx-crumbs" aria-label="Breadcrumb">
          <Link to="/app">Home</Link><span>/</span>
          {category && <><Link to="/collection/$category" params={{ category: category.slug }}>{category.name}</Link><span>/</span></>}
          <span aria-current="page">{p.name}</span>
        </nav>
        <div className="ghx-product">
          <div className="ghx-gallery">
            <div ref={track} className="ghx-gallery-track" onScroll={(e) => { const el = e.currentTarget; setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))); }}>
              {images.map((src, i) => <img key={src} src={src} alt={`${p.name} — photo ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} width={1200} height={800} />)}
            </div>
            <div className="ghx-gallery-thumbs" role="tablist" aria-label="Product photos">
              {images.map((src, i) => (
                <button key={src} type="button" role="tab" aria-selected={active === i} aria-label={`Show photo ${i + 1}`} onClick={() => go(i)}><img src={src} alt="" loading="lazy" /></button>
              ))}
            </div>
            <p className="ghx-note">Photos are illustrative. The exact model and finish are confirmed when you order.</p>
          </div>
          <div className="ghx-buybox">
            <Link to="/collection/$category" params={{ category: p.category }} className="ghx-back"><ArrowLeft size={15} /> {category?.name ?? "Back"}</Link>
            <h1>{p.name}</h1>
            <div className="ghx-tags">
              <span className="ghx-chip ghx-chip-solid">{p.scale}</span>
              <span className="ghx-chip">{p.type}</span>
              <span className="ghx-chip">{PRICE_BAND_LABEL[p.priceBand]}</span>
              <span className={`ghx-chip ${p.inStock ? "ghx-chip-ok" : ""}`}>{p.inStock ? "Opening stock" : "Preorder"}</span>
            </div>
            <p className="ghx-price">{p.price ? `OMR ${p.price.toFixed(3)}` : "Price on request"}</p>
            <p className="ghx-desc">{p.description}</p>
            <ul className="ghx-features">{p.features.map((f) => <li key={f}><Check size={15} aria-hidden="true" />{f}</li>)}</ul>

            <div className="ghx-colors">
              <span className="ghx-label">Colour{color ? `: ${color}` : ""}</span>
              {p.colors.length > 0 ? (
                <div className="ghx-swatches">
                  {p.colors.map((c) => (
                    <button key={c.name} type="button" aria-label={c.name} aria-pressed={color === c.name} title={c.name} onClick={() => pickColor(c.name, c.image)} style={{ background: c.hex }} />
                  ))}
                </div>
              ) : <p className="ghx-muted">More colour options on request — ask us on WhatsApp.</p>}
            </div>

            <div className="ghx-qty-row">
              <div className="ghx-qty" aria-label="Quantity">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(20, qty + 1))}><Plus size={16} /></button>
              </div>
              <button type="button" className="ghx-btn ghx-btn-outline ghx-grow" onClick={() => { addToCart({ slug: p.slug, name: p.name, scale: p.scale, color }, qty); toast.success(`${p.name} added to your order`, { action: { label: "View order", onClick: () => { window.location.href = "/cart"; } } }); }}>
                <ShoppingCart size={17} /> Add to order
              </button>
            </div>
            <a className="ghx-btn ghx-btn-primary ghx-btn-lg ghx-full" href={productWhatsAppURL(p, color)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Enquire on WhatsApp</a>
            <p className="ghx-note">No online payment. We confirm price, stock and pickup on WhatsApp.</p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="ghx-more-cats">
            <h2 className="ghx-collection-title"><span aria-hidden="true" />More {category?.name ?? "products"}</h2>
            <div className="ghx-rail">{related.map((r) => <div key={r.slug} className="ghx-rail-item"><ProductCard product={r} /></div>)}</div>
          </section>
        )}
      </main>
      <Footer variant="app" />
    </div>
  );
}
