import { useSiteMedia, siteMediaStyle, siteMediaQuery } from "@/lib/site-media";
import { shareMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHead } from "@/components/shop/SectionHead";
import { shopCatalogQuery } from "@/lib/shop-queries";
import { useHashScroll } from "@/hooks/useHashScroll";

export const Route = createFileRoute("/store")({
  staticData: { sitemap: true },
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(shopCatalogQuery), context.queryClient.ensureQueryData(siteMediaQuery)]),
  head: () => ({
    meta: [
      { title: "RC Collection — Cars, Crawlers, Diecast, Parts | GearHead RC Hub Muscat" },
      { name: "description", content: "The full GearHead RC Hub collection: performance RC, realistic RC, scale crawlers, drift & micro RC, diecast models, construction RC, batteries, spare parts and tools in Bausher, Muscat." },
      { property: "og:title", content: "GearHead RC Hub — Full RC Collection" },
      { property: "og:description", content: "Every GearHead category in one place. Order on WhatsApp." },
        ...shareMeta("/store", "GearHead RC Hub — Full RC Collection", "Every GearHead category in one place. Order on WhatsApp."),
    ],
    links: [{ rel: "canonical", href: "https://gearheadrc.store/store" }],
  }),
  component: StorePage,
});

function StorePage() {
  useHashScroll();
  const { data } = useSuspenseQuery(shopCatalogQuery);
  const siteMedia = useSiteMedia();
  return (
    <div className="gearhead-home ghx-shop" style={siteMediaStyle(siteMedia)}>
      <AppNavbar />
      <main className="ghx-page">
        <div className="ghx-wrap">
          <SectionHead as="h1" kicker="GearHead RC Hub" title={<>The RC <em>collection.</em></>} text={`${data.products.length} items across ${data.categories.length} categories. Tap a category to filter by scale and level.`} />
          <nav className="ghx-filters" aria-label="Jump to category">
            {data.categories.map((c) => <a key={c.slug} href={`#${c.slug}`} className="ghx-pill">{c.name}</a>)}
          </nav>
        </div>
        {data.categories.map((c) => {
          const items = data.products.filter((p) => p.category === c.slug);
          return (
            <section key={c.slug} id={c.slug} className="ghx-wrap ghx-collection">
              <div className="ghx-head-row">
                <h2 className="ghx-collection-title"><span aria-hidden="true" />{c.name}<small>{c.tagline}</small></h2>
                <Link to="/collection/$category" params={{ category: c.slug }} className="ghx-link">Open {c.name} <ArrowRight size={15} /></Link>
              </div>
              {items.length ? <div className="ghx-rail">{items.map((p) => <div key={p.slug} className="ghx-rail-item"><ProductCard product={p} /></div>)}</div>
                : <p className="ghx-muted">Coming soon.</p>}
            </section>
          );
        })}
      </main>
      <Footer variant="app" />
    </div>
  );
}
