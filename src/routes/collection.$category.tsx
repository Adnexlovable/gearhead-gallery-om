import { useSiteMedia, siteMediaStyle } from "@/lib/site-media";
import { useMemo, useState } from "react";
import { shareMeta } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { shopCatalogQuery } from "@/lib/shop-queries";
import { PRICE_BAND_LABEL, WHATSAPP_NUMBER, type ShopProduct } from "@/lib/shop";

export const Route = createFileRoute("/collection/$category")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(shopCatalogQuery);
    const category = data.categories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { name: category.name, description: category.description, tagline: category.tagline };
  },
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.name} — GearHead RC Hub, Muscat` : "Category — GearHead RC Hub";
    const description = loaderData ? `${loaderData.description} Browse scales and models at GearHead RC Hub, Bausher, Muscat. Order on WhatsApp.` : "GearHead RC Hub category.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...shareMeta(`/collection/${params.category}`, title, description),
      ],
      links: [{ rel: "canonical", href: `https://gearheadrc.store/collection/${params.category}` }],
    };
  },
  notFoundComponent: () => (
    <div className="gearhead-home ghx-shop min-h-screen"><AppNavbar /><main className="ghx-wrap ghx-empty-page"><h1>Category not found</h1><Link to="/store" className="ghx-btn ghx-btn-primary">See all products</Link></main></div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { category: slug } = Route.useParams();
  const { data } = useSuspenseQuery(shopCatalogQuery);
  const category = data.categories.find((c) => c.slug === slug)!;
  const items = data.products.filter((p) => p.category === slug);
  const scaleOptions = useMemo(() => [...new Set(items.map((p) => p.scale))], [items]);
  const [scale, setScale] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const shown = items.filter((p) => (scale === "all" || p.scale === scale) && (level === "all" || p.priceBand === level));
  const spotlight = items.slice(0, 4);
  const [slide, setSlide] = useState(0);
  const hero: ShopProduct | undefined = spotlight[slide];
  const others = data.categories.filter((c) => c.slug !== slug);

  const siteMedia = useSiteMedia();
  return (
    <div className="gearhead-home ghx-shop" style={siteMediaStyle(siteMedia)}>
      <AppNavbar />
      <main className="ghx-page">
        <section className="ghx-cat-hero" data-parallax-section>
          <img src={category.cover} alt="" className="ghx-cat-hero-img" data-parallax="0.12" />
          <div className="ghx-cat-hero-shade" aria-hidden="true" />
          <div className="ghx-wrap ghx-cat-hero-inner">
            <Link to="/app" hash="categories" className="ghx-back"><ArrowLeft size={15} /> All categories</Link>
            <h1>{category.name.split(" ").slice(0, -1).join(" ")} <em>{category.name.split(" ").slice(-1)}</em></h1>
            <p className="ghx-cat-tagline">{category.tagline}</p>
            <p className="ghx-cat-desc">{category.description}</p>
          </div>
        </section>

        {hero && (
          <section className="ghx-wrap ghx-spotlight" aria-label={`${category.name} spotlight`}>
            <div className="ghx-spot-media">
              <Link to="/product/$productId" params={{ productId: hero.slug }}><img src={hero.gallery[0]} alt={hero.name} /></Link>
              {spotlight.length > 1 && (
                <>
                  <button type="button" className="ghx-spot-arrow ghx-spot-prev" aria-label="Previous product" onClick={() => setSlide((slide - 1 + spotlight.length) % spotlight.length)}><ChevronLeft size={20} /></button>
                  <button type="button" className="ghx-spot-arrow ghx-spot-next" aria-label="Next product" onClick={() => setSlide((slide + 1) % spotlight.length)}><ChevronRight size={20} /></button>
                  <div className="ghx-dots">{spotlight.map((p, i) => <button key={p.slug} type="button" aria-label={`Show ${p.name}`} aria-current={i === slide} onClick={() => setSlide(i)} />)}</div>
                </>
              )}
              {!hero.inStock && <span className="ghx-chip ghx-chip-solid ghx-chip-left">Preorder</span>}
            </div>
            <div className="ghx-spot-info">
              <div className="min-w-0">
                <h2>{hero.name}</h2>
                <p>{hero.scale} · {hero.type} · {PRICE_BAND_LABEL[hero.priceBand]}</p>
              </div>
              <div className="ghx-spot-thumbs" aria-label="Photo styles">
                {hero.gallery.map((g, i) => <Link key={g} to="/product/$productId" params={{ productId: hero.slug }} aria-label={`Photo ${i + 1} of ${hero.name}`}><img src={g} alt="" loading="lazy" /></Link>)}
              </div>
            </div>
          </section>
        )}

        <section className="ghx-wrap ghx-collection">
          <div className="ghx-head-row">
            <h2 className="ghx-collection-title"><span aria-hidden="true" />{category.name} collection</h2>
            <span className="ghx-muted">{shown.length} of {items.length} items</span>
          </div>
          {items.length > 0 && (
            <div className="ghx-filters" role="group" aria-label="Filter by scale and level">
              <button type="button" className="ghx-pill" aria-pressed={scale === "all"} onClick={() => setScale("all")}>All scales</button>
              {scaleOptions.map((s) => <button key={s} type="button" className="ghx-pill" aria-pressed={scale === s} onClick={() => setScale(s)}>{s}</button>)}
              <span className="ghx-filter-gap" />
              {(["all", "entry", "mid", "premium"] as const).map((l) => (
                <button key={l} type="button" className="ghx-pill" aria-pressed={level === l} onClick={() => setLevel(l)}>{l === "all" ? "All levels" : PRICE_BAND_LABEL[l]}</button>
              ))}
            </div>
          )}
          {items.length === 0 ? (
            <div className="ghx-coming">
              <h3>Coming soon</h3>
              <p>We're sourcing this range now. Tell us what you're looking for.</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello GearHead, I'm looking for ${category.name}.`)}`} target="_blank" rel="noopener noreferrer" className="ghx-btn ghx-btn-primary"><MessageCircle size={16} /> Ask on WhatsApp</a>
            </div>
          ) : (
            <div className="ghx-grid">{shown.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          )}
          {items.length > 0 && shown.length === 0 && <p className="ghx-muted mt-4">No items match these filters.</p>}
        </section>

        <section className="ghx-wrap ghx-more-cats">
          <h2 className="ghx-collection-title"><span aria-hidden="true" />More categories</h2>
          <div className="ghx-rail">
            {others.map((c) => (
              <Link key={c.slug} to="/collection/$category" params={{ category: c.slug }} className="ghx-rail-item ghx-mini-cat">
                <img src={c.cover} alt="" loading="lazy" /><span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer variant="app" />
    </div>
  );
}
