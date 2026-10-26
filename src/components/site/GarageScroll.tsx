import { useEffect, useRef } from "react";
import sf90 from "@/assets/sf90.jpg";
import huracan from "@/assets/huracan-sterrato.jpg";
import defender from "@/assets/defender.jpg";
import gto from "@/assets/250gto.jpg";

const ITEMS = [
  { img: sf90, title: "Hall I — Hypercars", caption: "Engineering as art. Carbon, fire, and obsession." },
  { img: huracan, title: "Hall II — Off-Road", caption: "Where the road ends, the legend begins." },
  { img: defender, title: "Hall III — Expeditions", caption: "Built for continents, scaled for the shelf." },
  { img: gto, title: "Hall IV — Vintage", caption: "Time-honored silhouettes, lovingly preserved." },
];

export function GarageScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const max = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(${-progress * max}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section id="experience" ref={wrapRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-10 left-0 right-0 z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="pill mb-3">The Garage Walk</div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                A <span className="italic text-gold-gradient">museum</span> in motion.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
              Scroll to walk the halls — each vitrine reveals a new chapter of automotive culture.
            </p>
          </div>
        </div>
        <div ref={trackRef} className="flex h-full items-center gap-8 pl-[8vw] pr-[20vw] pt-32 will-change-transform">
          {ITEMS.map((it, i) => (
            <article key={i} className="vitrine vitrine-light scanlines relative h-[70vh] w-[80vw] shrink-0 md:w-[55vw] lg:w-[40vw]">
              <img src={it.img} alt={it.title} className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D15] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
                <div className="font-mono-tag text-[10px] text-gold-soft/80">Hall {String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 font-display text-3xl md:text-4xl font-bold text-foreground">{it.title}</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{it.caption}</p>
              </div>
            </article>
          ))}
          <div className="shrink-0 px-12 text-right">
            <div className="font-mono-tag text-[10px] text-gold-soft/70">End of corridor</div>
            <div className="mt-2 font-display text-2xl text-foreground/80">Continue ↓</div>
          </div>
        </div>
      </div>
    </section>
  );
}
