import { useRef, useState } from "react";
import { Reveal } from "./Reveal";
import bat from "@/assets/frame-batmobile.jpg";
import def from "@/assets/frame-defender.jpg";
import bmw from "@/assets/frame-bmw.jpg";
import por from "@/assets/frame-porsche.jpg";

interface Piece {
  img: string; title: string; subtitle: string; tag: string;
  tagColor: string; desc: string;
}

const PIECES: Piece[] = [
  { img: bat, title: "The Dark Knight Rises", subtitle: "Batmobile · Six-Generation Evolution",
    tag: "Limited Set", tagColor: "from-amber-300 to-yellow-500",
    desc: "Six era-defining Batmobiles, mounted in a single deep-set vitrine. From 1966 lacquer to Tumbler tactical." },
  { img: def, title: "Land Rover Defender", subtitle: "Gold Edition · Hand-leafed",
    tag: "Gold Edition", tagColor: "from-yellow-400 to-amber-600",
    desc: "A Defender re-finished in 24k leaf, suspended on Omani green velvet. One of twelve." },
  { img: bmw, title: "BMW M3 Competition", subtitle: "Backlit · LED Vitrine",
    tag: "Backlit · LED", tagColor: "from-sky-300 to-blue-500",
    desc: "Cool LED edge-lighting throws the alpine-white M3 into icy relief. Wall-mount, dimmable." },
  { img: por, title: "Porsche 911 Trinity", subtitle: "Black · White · Red",
    tag: "Trinity Series", tagColor: "from-rose-300 to-red-600",
    desc: "Three flat-six silhouettes, one frame. A study in restraint and proportion." },
];

export function FramedArt() {
  return (
    <section id="framed" className="relative bg-surface/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="text-center">
          <div className="pill mx-auto mb-4 inline-flex">Shadow-Box Editions</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Framed automotive <span className="italic text-gold-gradient">art</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
            Top-down, gallery-lit shadow-boxes. Built to hang where paintings used to.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {PIECES.map((p, i) => <FrameCard key={p.title} p={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function FrameCard({ p, index }: { p: Piece; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    setHover(false);
    if (ref.current) ref.current.style.transform = "perspective(1100px) rotateX(0) rotateY(0)";
  };

  return (
    <Reveal delay={index * 80}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={onLeave}
        data-cursor="hover"
        className="vitrine relative overflow-hidden transition-transform duration-300 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={p.img} alt={p.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover" />
          {/* Cursor-following glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,235,180,0.28), transparent 40%)",
              mixBlendMode: "screen",
              opacity: hover ? 1 : 0.3,
              transition: "opacity .3s",
            }}
          />
          {/* glass reflection */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, transparent 75%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="absolute left-4 top-4">
            <span className={`inline-block rounded-full bg-gradient-to-r ${p.tagColor} px-3 py-1 font-mono-tag text-[9px] font-bold text-[#0B1D15]`}>
              {p.tag}
            </span>
          </div>
        </div>
        <div className="relative z-10 p-6">
          <h3 className="font-display text-2xl font-bold text-foreground">{p.title}</h3>
          <p className="mt-1 font-mono-tag text-[10px] text-gold-soft/80">{p.subtitle}</p>
          <div
            className="grid overflow-hidden transition-[grid-template-rows] duration-500"
            style={{ gridTemplateRows: hover ? "1fr" : "0fr" }}
          >
            <p className="min-h-0 mt-0 text-sm text-muted-foreground">
              <span className="block pt-3">{p.desc}</span>
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
