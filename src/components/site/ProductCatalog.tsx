import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Camera, Check, ChevronRight, Image as ImageIcon, ShoppingBag, X } from "lucide-react";
import p4 from "@/assets/catalog/p4.asset.json";
import p6 from "@/assets/catalog/p6.asset.json";
import p7 from "@/assets/catalog/p7.asset.json";
import p8 from "@/assets/catalog/p8.asset.json";
import p9 from "@/assets/catalog/p9.asset.json";
import p13 from "@/assets/catalog/p13.asset.json";
import p14 from "@/assets/catalog/p14.asset.json";
import p15 from "@/assets/catalog/p15.asset.json";
import p18 from "@/assets/catalog/p18.asset.json";
import p19 from "@/assets/catalog/p19.asset.json";
import p20 from "@/assets/catalog/p20.asset.json";
import p22 from "@/assets/catalog/p22.asset.json";
import p24 from "@/assets/catalog/p24.asset.json";
import p25 from "@/assets/catalog/p25.asset.json";
import p26 from "@/assets/catalog/p26.asset.json";
import wranglerPhoto from "@/assets/wrangler.jpg";
import formulaPhoto from "@/assets/ferrari-sf24.jpg";

export type CatalogCategory = "performance" | "crawlers" | "diecast" | "parts";

type CroppedImage = {
  src: string;
  // Fractional bounding rectangle selecting only the product photograph,
  // excluding the wholesale prices printed alongside it in the source slide.
  rect?: readonly [number, number, number, number];
  caption: string;
};

type Product = {
  id: string;
  category: CatalogCategory;
  name: string;
  scale: string;
  type: string;
  details: string;
  features: readonly string[];
  image: CroppedImage;
};

const crop = (
  page: { url: string },
  rect: readonly [number, number, number, number],
  caption = "Catalogue product reference",
): CroppedImage => ({ src: page.url, rect, caption });

const photo = (src: string, caption = "Illustrative model photo"): CroppedImage => ({ src, caption });

// Public-facing product models and technical descriptions only.
// DO NOT put wholesale/import cost, target gross margin, supplier quotations,
// or placeholder retail prices in this file or in client-side JavaScript.
const PRODUCTS: readonly Product[] = [
  {
    id: "nitro-gas-buggy", category: "performance", name: "Nitro Gas Buggy (RTR)", scale: "1:8", type: "Nitro / Off-road",
    details: "Ready-to-run nitro-powered buggy for off-road hobby driving. Supplier model, final engine specification and finish to be confirmed.",
    features: ["Ready-to-run concept", "Nitro power", "Off-road buggy platform"],
    image: crop(p6, [0.06, 0.25, 0.50, 0.91]),
  },
  {
    id: "brushless-speed-truck", category: "performance", name: "Brushless Speed Truck", scale: "1:10", type: "Electric / Performance",
    details: "Electric brushless RC platform focused on responsive handling and performance. Final electronics and motor specification are subject to stock confirmation.",
    features: ["Brushless electric", "Hobby-grade platform", "Performance focus"],
    image: crop(p7, [0.53, 0.34, 0.96, 0.91]),
  },
  {
    id: "rally-truggy", category: "performance", name: "High-Speed Rally Truggy", scale: "1:14", type: "Electric / Off-road",
    details: "Compact high-speed truggy option in the performance range, balancing off-road style and responsive driving.",
    features: ["Rally-inspired", "Compact performance", "Electric platform"],
    image: crop(p9, [0.52, 0.33, 0.95, 0.90]),
  },
  {
    id: "racing-drift-car", category: "performance", name: "Racing Drift Car (Hobby)", scale: "1:10", type: "Electric / Drift",
    details: "Hobby-grade drift chassis for enthusiasts who value steering precision and chassis tuning.",
    features: ["Electric", "Tunable chassis", "Drift control"],
    image: crop(p4, [0.065, 0.25, 0.50, 0.90]),
  },
  {
    id: "rock-crawler", category: "performance", name: "Extreme Rock Crawler", scale: "1:12", type: "Electric / Technical crawl",
    details: "Dedicated extreme terrain crawler concept for slow-speed control and obstacle navigation.",
    features: ["Rock-crawling setup", "Off-road geometry", "Technical terrain"],
    image: crop(p8, [0.52, 0.31, 0.96, 0.91]),
  },
  {
    id: "wrangler-metal", category: "crawlers", name: "Realistic Wrangler (Metal)", scale: "1:10", type: "Scale / Crawler",
    details: "Scale-realism Jeep Wrangler-style crawler listed in the inventory plan. Final licensed details, body colour and model configuration depend on the supplier.",
    features: ["Realistic scale", "Crawler platform", "Metal-detail concept"],
    image: photo(wranglerPhoto),
  },
  {
    id: "land-cruiser-lc80", category: "crawlers", name: "Land Cruiser LC80", scale: "1:12", type: "Trail / Scale",
    details: "Compact scale trail crawler based on the Land Cruiser LC80 style, intended for technical driving and detailed vehicle display.",
    features: ["Trail crawler", "Scale-realism styling", "Compact platform"],
    image: crop(p15, [0.055, 0.30, 0.51, 0.92]),
  },
  {
    id: "ultra4-bronco", category: "crawlers", name: "Ultra4 Bronco (Brushless)", scale: "1:18", type: "Brushless / Trail",
    details: "Smaller-format brushless crawler concept combining aggressive off-road styling with compact trail capability.",
    features: ["Brushless drive", "Technical crawler", "Compact size"],
    image: crop(p14, [0.055, 0.30, 0.51, 0.92]),
  },
  {
    id: "defender-d110", category: "crawlers", name: "Defender D110 (Premium)", scale: "1:10", type: "Premium / Scale",
    details: "Premium Defender-style crawler design for realism-focused collectors and hobbyists. Final body and equipment specification are subject to sourcing.",
    features: ["Detailed body", "Trail-ready concept", "Premium scale category"],
    image: crop(p13, [0.055, 0.30, 0.51, 0.92]),
  },
  {
    id: "f1-championship", category: "diecast", name: "F1 Championship Editions", scale: "1:18", type: "Diecast / Motorsport",
    details: "Planned 1:18 Formula racing scale-model collection. Teams and individual model editions are to be confirmed.",
    features: ["Motorsport editions", "Display-focused", "Collector range"],
    image: photo(formulaPhoto),
  },
  {
    id: "exotic-supercars", category: "diecast", name: "Exotic Supercars (Premium)", scale: "1:24", type: "Diecast / Supercar",
    details: "Premium model supercar category as described in the inventory blueprint, for collectors interested in automotive design.",
    features: ["Premium diecast", "Detailed finish", "Supercar subjects"],
    image: crop(p20, [0.055, 0.28, 0.58, 0.92]),
  },
  {
    id: "hot-wheels-premium", category: "diecast", name: "Hot Wheels Premium Sets", scale: "1:64", type: "Collector / Diecast",
    details: "1:64 collectible sets included in the sourcing plan. Individual editions and licensed product availability require confirmation.",
    features: ["Collector sets", "Small-scale diecast", "Curated selection"],
    image: crop(p19, [0.51, 0.32, 0.95, 0.91], "Representative diecast collection"),
  },
  {
    id: "rlc-limited-edition", category: "diecast", name: "Limited Edition RLC Series", scale: "1:64", type: "Collector / Limited",
    details: "Proposed special-edition collector line. Availability, originality and specific editions will be checked before listing for sale.",
    features: ["Limited-run category", "Collector interest", "Edition subject to sourcing"],
    image: crop(p18, [0.58, 0.33, 0.96, 0.91], "Representative collector model"),
  },
  {
    id: "lipo-battery", category: "parts", name: "High-Power LiPo Battery", scale: "3S–6S", type: "Power / Electrical",
    details: "RC lithium polymer power packs specified in the inventory plan. Exact chemistry, connector, capacity and safe handling details are supplier-dependent.",
    features: ["3S–6S product class", "RC high-power battery", "Specification confirmation needed"],
    image: crop(p26, [0.05, 0.31, 0.48, 0.94]),
  },
  {
    id: "smart-fast-charger", category: "parts", name: "Smart Fast Charger", scale: "AC/DC", type: "Charging / Equipment",
    details: "Planned dual-port AC/DC charging systems for RC batteries. Compatibility and charging protections must be verified on the selected model.",
    features: ["Dual-port concept", "AC/DC input class", "Battery compatibility check"],
    image: crop(p25, [0.05, 0.30, 0.48, 0.92]),
  },
  {
    id: "precision-tool-kit", category: "parts", name: "RC Precision Tool Kit", scale: "25-piece", type: "Tools / Maintenance",
    details: "Precision maintenance tools for hobby-grade RC vehicles and scale models.",
    features: ["25-piece class", "Mechanical servicing", "Workshop essentials"],
    image: crop(p24, [0.05, 0.30, 0.49, 0.93]),
  },
  {
    id: "polycarbonate-paint", category: "parts", name: "Custom Polycarbonate Paint", scale: "RC body", type: "Finish / Customisation",
    details: "Airbrush and spray finishing products for compatible RC polycarbonate body shells.",
    features: ["Airbrush/spray options", "Body shell finishes", "Customisation"],
    image: crop(p22, [0.05, 0.29, 0.52, 0.93]),
  },
];

function CleanProductImage({ asset, productName, eager = false }: { asset: CroppedImage; productName: string; eager?: boolean }) {
  const host = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState<string | null>(asset.rect ? null : asset.src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!asset.rect) { setRendered(asset.src); setFailed(false); return; }
    let stopped = false;
    let observer: IntersectionObserver | null = null;
    const cropPhoto = () => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (stopped) return;
        const [left, top, right, bottom] = asset.rect!;
        const sx = Math.round(img.naturalWidth * left);
        const sy = Math.round(img.naturalHeight * top);
        const sw = Math.round(img.naturalWidth * (right - left));
        const sh = Math.round(img.naturalHeight * (bottom - top));
        const canvas = document.createElement("canvas");
        canvas.width = 660;
        canvas.height = 450;
        const ctx = canvas.getContext("2d");
        if (!ctx || sw <= 0 || sh <= 0) { setFailed(true); return; }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        try {
          setRendered(canvas.toDataURL("image/jpeg", 0.88));
          setFailed(false);
        } catch {
          // Never expose slide pricing even when a remote image blocks canvas access.
          setFailed(true);
        }
      };
      img.onerror = () => { if (!stopped) setFailed(true); };
      img.src = asset.src;
    };
    if (!eager && host.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some(item => item.isIntersecting)) {
          observer?.disconnect();
          cropPhoto();
        }
      }, { rootMargin: "300px" });
      observer.observe(host.current);
    } else cropPhoto();
    return () => { stopped = true; observer?.disconnect(); };
  }, [asset, eager]);

  return (
    <div ref={host} className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#263847,#071221)]">
      {rendered && !failed ? (
        <img
          src={rendered}
          alt={productName + " — " + asset.caption}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[#ffb778]" role="img" aria-label={productName + " photo preview unavailable"}>
          <ImageIcon size={40} aria-hidden="true" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030812]/70 to-transparent" />
      <span className="absolute bottom-3 left-3 rounded border border-[#ff9c3b]/45 bg-[#06121f]/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[#ffe0b5]">
        {asset.caption}
      </span>
    </div>
  );
}

const whatsappURL = (p: Product) =>
  "https://wa.me/96898675132?text=" +
  encodeURIComponent("Hello GearHead RC Hub. I am interested in " + p.name + " (" + p.scale + "). Please confirm availability, final retail price and purchasing options.");

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center overflow-y-auto bg-[#030710]/90 p-3 backdrop-blur-xl sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border-2 border-[#f79739]/70 bg-[#0d1725] shadow-[0_35px_100px_#000e]">
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close product details" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#fcb864]/70 bg-[#071322]/90 text-white hover:bg-[#253345]"><X size={20} /></button>
        <div className="grid md:grid-cols-[1fr_1fr]">
          <div className="p-4 md:flex md:items-center md:p-6">
            <div className="w-full overflow-hidden rounded-xl border border-[#e38b36]/60"><CleanProductImage key={product.id} asset={product.image} productName={product.name} eager /></div>
          </div>
          <div className="px-6 pb-7 pt-3 md:py-9 md:pl-2 md:pr-9">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#ffb565]">GearHead RC Hub · Planned Range</div>
            <h2 id="product-dialog-title" className="mt-4 font-display text-3xl font-extrabold leading-tight text-white">{product.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-[#fd9f3d]/55 px-3 py-1 font-mono text-xs text-[#ffc782]">{product.scale}</span>
              <span className="rounded-md border border-white/20 px-3 py-1 text-xs text-[#e8e1dc]">{product.type}</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#eae3dd]">{product.details}</p>
            <div className="mt-6 border-t border-[#ff982d]/30 pt-4">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 py-1.5 text-sm text-[#f0e7df]"><Check size={15} className="shrink-0 text-[#ffa32c]" />{feature}</div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-[#d0c6bd]">Pricing is not yet published. This is a sourcing proposal, not a confirmed in-stock retail offer.</p>
            <a className="gh-solid-action mt-6 w-full" href={whatsappURL(product)} target="_blank" rel="noopener noreferrer">Enquire to Purchase <ArrowUpRight size={17} /></a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductCatalog({ category }: { category: CatalogCategory }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const products = PRODUCTS.filter((product) => product.category === category);

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e4872e]/65 bg-[#0c1725]/95 shadow-[0_15px_40px_#0008] transition-colors hover:border-[#ffbe74]">
            <button type="button" onClick={() => setSelected(product)} className="block w-full overflow-hidden text-left" aria-label={"See photos and details for " + product.name}>
              <CleanProductImage asset={product.image} productName={product.name} />
            </button>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-[#ffae5a]">{product.type}</span>
                <span className="shrink-0 rounded border border-[#ffae5a]/50 px-2 py-1 font-mono text-[11px] text-[#ffd4a1]">{product.scale}</span>
              </div>
              <h3 className="font-display text-xl font-extrabold leading-snug text-white">{product.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#d5d0cd]">{product.details}</p>
              <p className="mt-auto border-t border-[#f28c36]/30 pt-5 text-[11px] font-medium text-[#ffc88c]">Price on enquiry · Range subject to confirmation</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSelected(product)} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#e88b37]/65 bg-[#162536] px-2 text-xs font-bold text-[#ffe4c0] hover:bg-[#253446]">
                  <Camera size={14} aria-hidden="true" /> Details
                </button>
                <a href={whatsappURL(product)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-[#ff9a26] px-2 text-xs font-extrabold text-[#0b1521] hover:bg-[#ffb15b]">
                  <ShoppingBag size={14} aria-hidden="true" /> Enquire <ChevronRight size={13} aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selected && <ProductModal key={selected.id} product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
