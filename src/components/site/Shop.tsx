import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";
import { EnquiryDialog } from "./EnquiryDialog";
import p4 from "@/assets/catalog/p4.asset.json";
import p6 from "@/assets/catalog/p6.asset.json";
import p7 from "@/assets/catalog/p7.asset.json";
import p8 from "@/assets/catalog/p8.asset.json";
import p9 from "@/assets/catalog/p9.asset.json";
import p13 from "@/assets/catalog/p13.asset.json";
import p14 from "@/assets/catalog/p14.asset.json";
import p15 from "@/assets/catalog/p15.asset.json";
import p16 from "@/assets/catalog/p16.asset.json";
import p19 from "@/assets/catalog/p19.asset.json";
import p20 from "@/assets/catalog/p20.asset.json";
import p22 from "@/assets/catalog/p22.asset.json";
import p24 from "@/assets/catalog/p24.asset.json";
import p25 from "@/assets/catalog/p25.asset.json";
import p26 from "@/assets/catalog/p26.asset.json";
import p18 from "@/assets/catalog/p18.asset.json";

type VehicleType = "High-Performance" | "Scale Realism" | "Diecast Gallery" | "Parts & Spares";
type Edition = "RC Edition" | "Scale Model" | "Accessory";

interface Product {
  img: string;
  tag: string;
  name: string;
  price: number;
  priceMax: number;
  type: VehicleType;
  edition: Edition;
  inStock: boolean;
}

const P = (img: { url: string }, tag: string, name: string, price: number, priceMax: number, type: VehicleType, edition: Edition): Product => ({ img: img.url, tag, name, price, priceMax, type, edition, inStock: true });

const PRODUCTS: Product[] = [
  P(p6, "1/8 · Nitro RTR", "Nitro Gas Buggy", 140, 180, "High-Performance", "RC Edition"),
  P(p7, "1/10 · Brushless", "Brushless Speed Truck", 85, 110, "High-Performance", "RC Edition"),
  P(p9, "1/14 · Rally", "High-Speed Rally Truggy", 45, 60, "High-Performance", "RC Edition"),
  P(p4, "1/10 · Electric", "Racing Drift Car (Hobby)", 70, 95, "High-Performance", "RC Edition"),
  P(p8, "1/12 · Crawler", "Extreme Rock Crawler", 65, 85, "High-Performance", "RC Edition"),
  P(p16, "1/10 · Metal", "Realistic Wrangler", 160, 240, "Scale Realism", "RC Edition"),
  P(p15, "1/12 · Licensed", "Land Cruiser LC80", 40, 55, "Scale Realism", "RC Edition"),
  P(p14, "1/18 · Brushless", "Ultra4 Bronco", 60, 80, "Scale Realism", "RC Edition"),
  P(p13, "1/10 · Premium", "Defender D110", 220, 350, "Scale Realism", "RC Edition"),
  P(p19, "1/18 · Diecast", "F1 Championship Edition", 35, 65, "Diecast Gallery", "Scale Model"),
  P(p20, "1/24 · Diecast", "Exotic Supercars (Premium)", 15, 25, "Diecast Gallery", "Scale Model"),
  P(p18, "1/64 · Sets", "Hot Wheels Premium Sets", 6, 12, "Diecast Gallery", "Scale Model"),
  P(p18, "1/64 · Limited", "Limited Edition RLC Series", 25, 45, "Diecast Gallery", "Scale Model"),
  P(p26, "3S–6S · 100C", "LiPo High-Power Battery", 15, 45, "Parts & Spares", "Accessory"),
  P(p25, "AC/DC Dual Port", "Smart Fast-Charger", 25, 40, "Parts & Spares", "Accessory"),
  P(p24, "25-Piece Metal", "RC Precision Tool Kit", 18, 25, "Parts & Spares", "Accessory"),
  P(p22, "Airbrush / Spray", "Custom Polycarbonate Paint", 2.5, 5, "Parts & Spares", "Accessory"),
];

const TYPES: Array<VehicleType | "All"> = ["All", "High-Performance", "Scale Realism", "Diecast Gallery", "Parts & Spares"];
const EDITIONS: Array<Edition | "All"> = ["All", "RC Edition", "Scale Model", "Accessory"];
const PRICES: Array<{ label: string; min: number; max: number }> = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 50", min: 0, max: 49.99 },
  { label: "50 – 150", min: 50, max: 150 },
  { label: "150+", min: 150.01, max: Infinity },
];
const AVAILABILITY = ["All", "In Stock", "Pre-Order"] as const;

export function Shop() {
  const [type, setType] = useState<VehicleType | "All">("All");
  const [edition, setEdition] = useState<Edition | "All">("All");
  const [price, setPrice] = useState("All");
  const [enquire, setEnquire] = useState<string | null>(null);
  const [availability, setAvailability] = useState<(typeof AVAILABILITY)[number]>("All");
  const [live, setLive] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    supabase.from("products").select("name,price,price_max,in_stock,visible").then(({ data }) => {
      if (!data?.length) return;
      const byName = new Map(data.map((d) => [d.name, d]));
      setLive(
        PRODUCTS.flatMap((p) => {
          const d = byName.get(p.name);
          if (!d) return [p];
          if (!d.visible) return [];
          return [{ ...p, price: Number(d.price), priceMax: Number(d.price_max), inStock: d.in_stock }];
        }),
      );
    });
  }, []);

  const filtered = useMemo(() => {
    const band = PRICES.find((p) => p.label === price) ?? PRICES[0];
    return live.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (edition === "All" || p.edition === edition) &&
        p.price >= band.min &&
        p.price <= band.max &&
        (availability === "All" || (availability === "In Stock" ? p.inStock : !p.inStock)),
    );
  }, [type, edition, price, availability, live]);

  const reset = () => {
    setType("All");
    setEdition("All");
    setPrice("All");
    setAvailability("All");
  };

  return (
    <section id="shop" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="pill mb-4">The Boutique</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Take a piece <span className="italic text-gold-gradient">home</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Nitro & brushless RC, scale-realism crawlers, diecast and parts — shipped across the GCC, hand-delivered in Muscat.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12 rounded-2xl border border-gold/20 glass p-5 md:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FilterGroup label="Vehicle Type" options={TYPES} value={type} onChange={(v) => setType(v as VehicleType | "All")} />
            <FilterGroup label="Edition" options={EDITIONS} value={edition} onChange={(v) => setEdition(v as Edition | "All")} />
            <FilterGroup label="Price (OMR)" options={PRICES.map((p) => p.label)} value={price} onChange={setPrice} />
            <FilterGroup
              label="Availability"
              options={[...AVAILABILITY]}
              value={availability}
              onChange={(v) => setAvailability(v as (typeof AVAILABILITY)[number])}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-4">
            <div className="font-mono-tag text-[10px] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} available
            </div>
            <button
              onClick={reset}
              data-cursor="hover"
              className="font-mono-tag rounded-full border border-gold/25 px-4 py-2 text-[10px] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
            >
              Clear filters
            </button>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal delay={120} className="mt-12 rounded-2xl border border-gold/15 p-12 text-center">
            <div className="font-display text-xl font-bold text-foreground">No pieces match that combination.</div>
            <p className="mt-2 text-sm text-muted-foreground">Loosen a filter — or ask our curator to source it for you.</p>
          </Reveal>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article data-cursor="hover" className="group vitrine relative h-full overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D15]/80 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 pill !py-1 !px-2 !text-[8px]">{p.tag}</div>
                    <div className="absolute right-3 top-3 font-mono-tag rounded-full border border-gold/30 bg-[#0B1D15]/70 px-2 py-1 text-[8px] text-gold-soft">
                      {p.inStock ? "IN STOCK" : "PRE-ORDER"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                      <div className="font-mono-tag mt-1 text-[10px] text-gold-soft">OMR {p.price.toFixed(3)} – {p.priceMax.toFixed(3)}</div>
                    </div>
                    <button onClick={() => setEnquire(p.name)} data-cursor="hover" className="btn-gold !py-2 !px-4 !text-[10px]">Enquire</button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <EnquiryDialog product={enquire} onClose={() => setEnquire(null)} />
    </section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="font-mono-tag mb-3 text-[9px] text-gold/70">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            data-cursor="hover"
            aria-pressed={value === o}
            className={`font-mono-tag rounded-full border px-3 py-1.5 text-[10px] transition-all ${
              value === o
                ? "border-gold bg-gold text-[#0B1D15]"
                : "border-gold/25 text-muted-foreground hover:border-gold/60 hover:text-gold"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
