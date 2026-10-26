import { useMemo, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import sf24 from "@/assets/ferrari-sf24.jpg";
import w15 from "@/assets/mercedes-w15.jpg";
import huracan from "@/assets/huracan-sterrato.jpg";
import sf90 from "@/assets/sf90.jpg";
import wrangler from "@/assets/wrangler.jpg";
import defender from "@/assets/defender.jpg";
import gto from "@/assets/250gto.jpg";
import silverghost from "@/assets/silverghost.jpg";

type Category = "All" | "F1" | "Supercars" | "4x4 Off-Road" | "Vintage Classics";

interface Vehicle {
  img: string; make: string; year: string; title: string;
  desc: string; spec: string; origin: string;
  category: Exclude<Category, "All">; featured?: boolean;
}

const VEHICLES: Vehicle[] = [
  { img: sf24, make: "Ferrari", year: "2024", title: "SF-24", category: "F1",
    desc: "Maranello's silver-jubilee challenger — sharp aero, fierce posture.",
    spec: "1.6L V6 Hybrid · 1000 hp", origin: "Maranello, Italy" },
  { img: w15, make: "Mercedes-AMG", year: "2024", title: "W15 E Performance", category: "F1",
    desc: "Brackley's precision instrument, recast in matte stealth.",
    spec: "1.6L V6 Hybrid · 1000 hp", origin: "Brackley, UK" },
  { img: huracan, make: "Lamborghini", year: "2023", title: "Huracán Sterrato", category: "Supercars",
    desc: "A supercar that bites gravel — raised, ridged, untamed.",
    spec: "5.2L V10 · 610 hp", origin: "Sant'Agata Bolognese" },
  { img: sf90, make: "Ferrari", year: "2022", title: "SF90 Stradale", category: "Supercars",
    desc: "Plug-in apex predator — three motors, one thesis.",
    spec: "4.0L V8 Hybrid · 986 hp", origin: "Maranello, Italy" },
  { img: wrangler, make: "Jeep", year: "2024", title: "Wrangler Rubicon 4xe", category: "4x4 Off-Road", featured: true,
    desc: "Flagship of the gallery — electrified torque meets icon silhouette.",
    spec: "2.0L Turbo PHEV · 375 hp", origin: "Toledo, Ohio" },
  { img: defender, make: "Land Rover", year: "2024", title: "Defender 130 V8", category: "4x4 Off-Road",
    desc: "Eight cylinders of expedition-grade composure.",
    spec: "5.0L Supercharged V8 · 525 hp", origin: "Solihull, UK" },
  { img: gto, make: "Ferrari", year: "1962", title: "250 GTO", category: "Vintage Classics",
    desc: "The grail. A racing soul wrapped in Pininfarina silk.",
    spec: "3.0L V12 · 296 hp", origin: "Maranello, Italy" },
  { img: silverghost, make: "Rolls-Royce", year: "1907", title: "Silver Ghost", category: "Vintage Classics",
    desc: "The best car in the world — when the world was just learning to drive.",
    spec: "7.0L Inline-6 · 48 hp", origin: "Manchester, UK" },
];

const CATEGORIES: Category[] = ["All", "F1", "Supercars", "4x4 Off-Road", "Vintage Classics"];

export function Gallery() {
  const [active, setActive] = useState<Category>("All");
  const filtered = useMemo(
    () => (active === "All" ? VEHICLES : VEHICLES.filter((v) => v.category === active)),
    [active]
  );

  return (
    <section id="collection" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="text-center">
          <div className="pill mx-auto mb-4 inline-flex">The Automotive Museum</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Every <span className="italic text-gold-gradient">vitrine</span>,<br className="md:hidden" /> a love letter.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
            Filter by chapter and step closer. Each card responds to your cursor like a real display case under museum glass.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono-tag rounded-full border px-4 py-2 text-[10px] transition-all ${
                active === c
                  ? "border-gold bg-gold text-[#0B1D15]"
                  : "border-gold/25 text-muted-foreground hover:border-gold/60 hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((v, i) => (
            <VehicleCard key={v.title} v={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ v, index }: { v: Vehicle; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };

  return (
    <Reveal delay={index * 60}>
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="hover"
        className="vitrine vitrine-light scanlines group relative h-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {v.featured && (
          <div className="absolute left-0 top-5 z-10 -translate-x-1.5 rounded-r-sm border border-gold bg-gold px-3 py-1 font-mono-tag text-[9px] font-bold text-[#0B1D15] shadow-[0_4px_20px_rgba(201,168,76,0.4)]">
            ★ Featured
          </div>
        )}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={v.img}
            alt={`${v.make} ${v.title}`}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* glare following cursor */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,235,180,0.35), transparent 45%)",
              mixBlendMode: "screen",
            }}
          />
          <div className="absolute right-3 top-3 z-10">
            <span className="pill !py-1 !px-2 !text-[8px]">{v.category}</span>
          </div>
        </div>
        <div className="relative z-10 p-5">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-mono-tag text-[10px] text-gold-soft/80">{v.make} · {v.year}</div>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold text-foreground">{v.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{v.desc}</p>
          <div className="mt-4 border-t border-gold/15 pt-3 space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-foreground/80">
              <span className="font-mono-tag text-[9px] text-gold/70">PWR</span>
              <span className="truncate">{v.spec}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-foreground/60">
              <span className="font-mono-tag text-[9px] text-gold/70">ORG</span>
              <span className="truncate">{v.origin}</span>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
