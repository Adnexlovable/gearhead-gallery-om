import { useEffect, useRef, useState } from "react";
import { RotateCw, MousePointer2, Sparkles, Gauge, X } from "lucide-react";
import sf90 from "@/assets/sf90.jpg";
import huracan from "@/assets/huracan-sterrato.jpg";
import defender from "@/assets/defender.jpg";
import gto from "@/assets/250gto.jpg";

const MODELS = [
  { id: "sf90", name: "Ferrari SF90 Stradale", tag: "Hybrid Hypercar", img: sf90, spec: "986 hp · V8 + 3 motors" },
  { id: "huracan", name: "Lamborghini Huracán Sterrato", tag: "All-Terrain Supercar", img: huracan, spec: "610 hp · V10" },
  { id: "defender", name: "Land Rover Defender 130 V8", tag: "Expedition Icon", img: defender, spec: "525 hp · Supercharged V8" },
  { id: "gto", name: "Ferrari 250 GTO", tag: "Vintage Grail", img: gto, spec: "300 hp · Colombo V12" },
];

type Hotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  title: string;
  detail: string;
  spec: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "livery",
    x: 22, y: 40,
    label: "Hand-painted livery",
    title: "Hand-painted livery",
    detail: "Each stripe, sponsor decal, and racing number is applied by hand under magnification in our Muscat atelier — no waterslides, no shortcuts.",
    spec: "Layered urethane · 3-stage clear coat",
  },
  {
    id: "etched",
    x: 62, y: 55,
    label: "Photo-etched details",
    title: "Photo-etched details",
    detail: "Grilles, badges, seatbelt buckles and wing mirrors are cut from stainless steel using photo-etch masters, then hand-fitted to the shell.",
    spec: "0.15 mm stainless · brass rivets",
  },
  {
    id: "body",
    x: 82, y: 38,
    label: "1:18 die-cast body",
    title: "1:18 die-cast body",
    detail: "The main shell is pressure-cast zinc alloy for a real, hand-heavy feel — with independent suspension and steering geometry that actually articulates.",
    spec: "Zinc alloy · working suspension",
  },
];


export function Experience360() {
  const [active, setActive] = useState(0);
  const [angle, setAngle] = useState(20);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; a: number } | null>(null);
  const rafRef = useRef<number | null>(null);


  // Auto rotate
  useEffect(() => {
    if (!auto || dragging) return;
    const step = () => {
      setAngle((a) => (a + 0.25) % 360);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [auto, dragging]);

  const onDown = (clientX: number) => {
    setDragging(true);
    dragRef.current = { x: clientX, a: angle };
  };
  const onMove = (clientX: number) => {
    if (!dragRef.current) return;
    const dx = clientX - dragRef.current.x;
    setAngle((dragRef.current.a + dx * 0.6) % 360);
  };
  const onUp = () => { setDragging(false); dragRef.current = null; };

  useEffect(() => {
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const tm = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      onMove(e.touches[0].clientX);
    };
    const up = () => onUp();
    if (dragging) {
      window.addEventListener("mousemove", mm);
      window.addEventListener("touchmove", tm, { passive: false });
      window.addEventListener("mouseup", up);
      window.addEventListener("touchend", up);
      window.addEventListener("touchcancel", up);
    }
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, [dragging]);

  // Keyboard: arrows spin, [ ] switch model, Esc closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") { setAuto(false); setAngle((a) => a - 5); }
      else if (e.key === "ArrowRight") { setAuto(false); setAngle((a) => a + 5); }
      else if (e.key === "[") setActive((i) => (i - 1 + MODELS.length) % MODELS.length);
      else if (e.key === "]") setActive((i) => (i + 1) % MODELS.length);
      else if (e.key === "Escape") setActiveHotspot(null);
      else if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key) - 1;
        const h = HOTSPOTS[idx];
        if (h) { setAuto(false); setActiveHotspot((cur) => (cur === h.id ? null : h.id)); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close hotspot panel when the model changes
  useEffect(() => { setActiveHotspot(null); }, [active]);

  const model = MODELS[active];
  // Normalize angle to a display rotation and subtle scale/skew for depth
  const norm = ((angle % 360) + 360) % 360;
  const rotY = norm - 180; // -180..180
  const scale = 0.92 + Math.abs(Math.cos((rotY * Math.PI) / 180)) * 0.12;
  const hotspotsVisible = Math.abs(rotY) < 45;
  const openHotspot = HOTSPOTS.find((h) => h.id === activeHotspot) ?? null;
  // Keep the last opened hotspot mounted so the panel can animate out
  const lastHotspotRef = useRef<Hotspot | null>(null);
  if (openHotspot) lastHotspotRef.current = openHotspot;
  const panelHotspot = openHotspot ?? lastHotspotRef.current;
  const panelOpen = !!openHotspot;


  return (
    <section id="experience-360" className="relative overflow-hidden bg-[#0A1A13] py-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(1000px 500px at 50% 20%, rgba(201,168,76,0.14), transparent 60%)" }} />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="pill mb-3"><Sparkles size={12} /> 360° Experience</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Step onto the <span className="italic text-gold-gradient">turntable</span>.
            </h2>
            <p className="mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
              Drag or swipe to rotate, and tap a numbered point for the craft details. Every model is inspected from every angle — like walking around the vitrine in our Muscat showroom.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuto((v) => !v)}
              className="btn-ghost-gold !py-2.5"
              aria-pressed={auto}
            >
              <RotateCw size={14} className={auto ? "animate-spin-slow" : ""} /> {auto ? "Auto-rotating" : "Auto-rotate off"}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-gold/25 bg-surface/60 px-3 py-2 backdrop-blur">
              <MousePointer2 size={14} className="text-gold" />
              <span className="font-mono-tag text-[10px] text-gold-soft/80 md:hidden">Swipe to spin</span>
              <span className="hidden font-mono-tag text-[10px] text-gold-soft/80 md:inline">Drag to spin</span>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div
            className="vitrine relative h-[52vh] min-h-[340px] touch-none overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b from-[#0E2219] to-[#07130E] select-none md:h-[62vh] md:min-h-[460px]"
            onMouseDown={(e) => { e.preventDefault(); onDown(e.clientX); }}
            onTouchStart={(e) => onDown(e.touches[0].clientX)}
            style={{ cursor: dragging ? "grabbing" : "grab", perspective: "1600px", touchAction: "none" }}
          >
            {/* Studio lighting */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(600px 300px at 50% 30%, rgba(255,225,150,0.25), transparent 65%)" }} />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 letterbox-top opacity-60" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 letterbox-bottom opacity-70" />

            {/* Car layer */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative aspect-[16/10] w-[86%] will-change-transform"
                style={{
                  transform: `rotateY(${rotY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  transition: dragging ? "none" : "transform 60ms linear",
                }}
              >
                <img
                  src={model.img}
                  alt={`${model.name} 360 view`}
                  draggable={false}
                  className="h-full w-full rounded-2xl object-cover shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
                  style={{ filter: `brightness(${0.85 + Math.cos((rotY * Math.PI) / 180) * 0.15})` }}
                />
                {/* Glass reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)" }} />
                {/* Hotspots (only when close to front) */}
                {hotspotsVisible && HOTSPOTS.map((h, i) => {
                  const isActive = activeHotspot === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      aria-label={`Hotspot ${i + 1}: ${h.label}`}
                      aria-pressed={isActive}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuto(false);
                        setActiveHotspot((cur) => (cur === h.id ? null : h.id));
                      }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      data-hotspot={h.id}
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    >
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ease-out md:h-7 md:w-7 ${
                          isActive
                            ? "scale-110 border-gold bg-gold text-[#0B1D15] shadow-[0_0_0_8px_rgba(201,168,76,0.25)]"
                            : "border-gold/60 bg-[#0B1D15]/70 text-gold shadow-[0_0_0_6px_rgba(201,168,76,0.15)] group-hover:scale-110 group-hover:bg-gold group-hover:text-[#0B1D15] group-focus-visible:scale-110 group-focus-visible:bg-gold group-focus-visible:text-[#0B1D15] group-focus-visible:ring-2 group-focus-visible:ring-gold/60"
                        }`}
                      >
                        <span className="font-mono-tag text-[10px] font-bold">{i + 1}</span>
                      </span>
                      <span
                        className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/40 bg-[#0B1D15]/95 px-2 py-1 font-mono-tag text-[10px] text-gold-soft transition-all duration-300 ease-out ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                        }`}
                      >
                        {h.label}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Turntable base */}
            <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
              <div className="relative h-6 w-[70%]">
                <div className="absolute inset-0 rounded-[50%]"
                  style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.35), rgba(201,168,76,0) 70%)" }} />
                <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              </div>
            </div>

            {/* Angle readout */}
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-gold/25 bg-black/40 px-3 py-1.5 backdrop-blur">
              <Gauge size={12} className="text-gold" />
              <span className="font-mono-tag text-[10px] text-gold-soft">{Math.round(norm)}°</span>
            </div>
            <div className="absolute right-5 top-5 rounded-full border border-gold/25 bg-black/40 px-3 py-1.5 backdrop-blur">
              <span className="font-mono-tag text-[10px] text-gold-soft/80">{model.tag}</span>
            </div>

            {/* Scrub bar */}
            <div className="absolute inset-x-6 bottom-4">
              <input
                type="range"
                min={0}
                max={359}
                value={Math.round(norm)}
                onChange={(e) => { setAuto(false); setAngle(parseInt(e.target.value)); }}
                className="w-full accent-[#C9A84C]"
                aria-label="Rotation angle"
              />
              <div className="mt-1 flex justify-between font-mono-tag text-[9px] text-gold-soft/60">
                <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="pointer-events-none absolute bottom-20 right-5 hidden items-center gap-1.5 rounded-full border border-gold/20 bg-black/40 px-2.5 py-1 backdrop-blur md:flex">
              <kbd className="rounded border border-gold/30 px-1 font-mono-tag text-[9px] text-gold-soft">←</kbd>
              <kbd className="rounded border border-gold/30 px-1 font-mono-tag text-[9px] text-gold-soft">→</kbd>
              <span className="font-mono-tag text-[9px] text-gold-soft/70">spin</span>
              <span className="font-mono-tag text-[9px] text-gold-soft/40">·</span>
              <kbd className="rounded border border-gold/30 px-1 font-mono-tag text-[9px] text-gold-soft">1–{HOTSPOTS.length}</kbd>
              <span className="font-mono-tag text-[9px] text-gold-soft/70">details</span>
            </div>

            {/* Hotspot detail panel */}
            {panelHotspot && (
              <div
                role="dialog"
                aria-label={panelHotspot.title}
                aria-hidden={!panelOpen}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`hotspot-panel absolute inset-x-3 bottom-20 z-20 md:inset-x-auto md:bottom-auto md:left-auto md:right-5 md:top-16 md:w-80 ${
                  panelOpen ? "hotspot-panel-open" : "hotspot-panel-closed"
                }`}
              >
                <div className="relative rounded-2xl border border-gold/30 bg-[#0B1D15]/95 p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    aria-label="Close details"
                    tabIndex={panelOpen ? 0 : -1}
                    className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-300 ease-out hover:rotate-90 hover:bg-gold hover:text-[#0B1D15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  >
                    <X size={13} />
                  </button>
                  <div className="font-mono-tag text-[10px] text-gold-soft/70">
                    Detail · Point {HOTSPOTS.findIndex((h) => h.id === panelHotspot.id) + 1}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground pr-6">{panelHotspot.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{panelHotspot.detail}</p>
                  <div className="mt-4 rounded-lg border border-gold/20 bg-black/30 px-3 py-2">
                    <div className="font-mono-tag text-[9px] text-gold-soft/60">Craft spec</div>
                    <div className="mt-0.5 font-mono-tag text-[11px] text-gold-soft">{panelHotspot.spec}</div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Sidebar: model picker + info */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gold/20 bg-surface/60 p-5 backdrop-blur">
              <div className="font-mono-tag text-[10px] text-gold-soft/70">Now inspecting</div>
              <div className="mt-1 font-display text-2xl font-bold text-foreground">{model.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{model.spec}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gold-soft/80">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                Live turntable · 1:18 scale reference
              </div>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-surface/40 p-3 backdrop-blur">
              <div className="mb-2 px-2 font-mono-tag text-[10px] text-gold-soft/70">Choose a model</div>
              <div className="grid grid-cols-2 gap-2">
                {MODELS.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => { setActive(i); setAngle(20); }}
                    className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                      i === active ? "border-gold shadow-[0_0_0_2px_rgba(201,168,76,0.25)]" : "border-gold/15 hover:border-gold/40"
                    }`}
                  >
                    <img src={m.img} alt={m.name} className="h-20 w-full object-cover opacity-90 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1D15] to-transparent p-2">
                      <div className="font-display text-[11px] font-bold text-foreground line-clamp-1">{m.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-surface/40 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono-tag text-[10px] text-gold-soft/70">Craft hotspots</div>
                <div className="font-mono-tag text-[9px] text-gold-soft/50">Press 1–{HOTSPOTS.length}</div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {HOTSPOTS.map((h, i) => {
                  const isActive = activeHotspot === h.id;
                  return (
                    <li key={h.id}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setAuto(false);
                          if (Math.abs(rotY) >= 45) setAngle(20);
                          setActiveHotspot((cur) => (cur === h.id ? null : h.id));
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all ${
                          isActive
                            ? "border-gold bg-gold/10"
                            : "border-gold/15 hover:border-gold/40 hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono-tag text-[10px] font-bold ${
                          isActive ? "border-gold bg-gold text-[#0B1D15]" : "border-gold/40 text-gold"
                        }`}>{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-foreground line-clamp-1">{h.title}</span>
                          <span className="block font-mono-tag text-[9px] text-gold-soft/60 line-clamp-1">{h.spec}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
