import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/lib/cart";
import { PRICE_BAND_LABEL, productWhatsAppURL, type ShopProduct } from "@/lib/shop";

export function ProductCard({ product, categoryName, adminActions }: { product: ShopProduct; categoryName?: string; adminActions?: ReactNode }) {
  const cover = product.gallery[0];
  return (
    <article className="ghx-card group">
      <Link to="/product/$productId" params={{ productId: product.slug }} className="ghx-card-media" aria-label={`View ${product.name}`}>
        {cover ? <img src={cover} alt={product.name} loading="lazy" width={600} height={400} /> : <div className="ghx-card-noimg" />}
        <span className="ghx-chip ghx-chip-solid">{product.scale}</span>
        {!product.inStock && <span className="ghx-chip ghx-chip-right">Preorder</span>}
      </Link>
      <div className="ghx-card-body">
        <p className="ghx-card-kicker">{categoryName ? `${categoryName} · ` : ""}{product.type}</p>
        <Link to="/product/$productId" params={{ productId: product.slug }} className="ghx-card-title">{product.name}</Link>
        <p className="ghx-card-meta">{product.price ? `OMR ${product.price.toFixed(3)}` : `${PRICE_BAND_LABEL[product.priceBand]} · Price on request`}</p>
        <div className="ghx-card-actions">
          {adminActions ?? <>
          <button type="button" className="ghx-btn ghx-btn-ghost" onClick={() => { addToCart({ slug: product.slug, name: product.name, scale: product.scale }); toast.success(`${product.name} added to your order`); }}>
            <Plus size={15} aria-hidden="true" /> Add
          </button>
          <a className="ghx-btn ghx-btn-primary" href={productWhatsAppURL(product)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} aria-hidden="true" /> Enquire
          </a>
          </>}
        </div>
      </div>
    </article>
  );
}
