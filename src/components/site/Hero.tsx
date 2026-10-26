import { useEffect, useRef, useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import heroPoster from "@/assets/hero-bg.jpg";


export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);

  // Mouse-tracked 3D parallax tilt
  useEffect(() => {
    const stage = stageRef.current;
    const media = mediaRef.current;
    if (!stage || !media) return;
    let rx = 0, ry = 0, tx = 0, ty = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      tx = -cy * 6;
      ty = cx * 8;
    };
    const loop = () => {
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      media.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Scroll-scrubbed zoom + text fade
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const text = textRef.current;
    if (!section || !media || !text) return;
    const onScroll = () => {
      const h = window.innerHeight;
      const y = Math.min(Math.max(window.scrollY / h, 0), 1.2);
      media.style.setProperty("--zoom", `${1.05 + y * 0.25}`);
      media.style.setProperty("--shift", `${y * -60}px`);
      text.style.opacity = `${1 - y * 1.4}`;
      text.style.transform = `translateY(${y * -120}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-background"
      style={{ perspective: "1400px" }}
    >
      <div ref={stageRef} className="absolute inset-0">
        {/* Tilting 3D media layer */}
        <div
          ref={mediaRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transformOrigin: "center center",
            transform: "perspective(1400px) scale(1.05)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: "translate3d(0, var(--shift, 0), 0) scale(var(--zoom, 1.05))",
              transition: "transform 0.05s linear",
            }}
          >
            <img
              src={heroPoster}
              alt="Scale model car gallery showroom"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Color grade + vignette */}
        <div className="pointer-events-none absolute inset-0 radial-grade" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,29,21,0.4) 0%, rgba(11,29,21,0.1) 30%, rgba(11,29,21,0.6) 100%)" }} />

        {/* Letterbox bars */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 letterbox-top" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 letterbox-bottom" />
      </div>

      {/* Text */}
      <div ref={textRef} className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div
          className={`pill mb-8 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Muscat, Oman · Est. 2024
        </div>

        <h1 className="font-display text-[16vw] leading-[0.85] font-extrabold tracking-tighter text-foreground md:text-[10rem]">
          <span className="block overflow-hidden">
            <span
              className={`inline-block transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? "translate-y-0" : "translate-y-full"}`}
              style={{ transitionDelay: "400ms" }}
            >
              GearH<span className="italic text-gold-gradient">ead</span>
            </span>
          </span>
          <span className="block overflow-hidden mt-1">
            <span
              className={`inline-block transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? "translate-y-0" : "translate-y-full"}`}
              style={{ transitionDelay: "650ms" }}
            >
              GALLERY
            </span>
          </span>
        </h1>

        <p
          className={`mt-8 max-w-xl text-base md:text-lg text-muted-foreground transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "1050ms" }}
        >
          The Art of Automotive Passion — a cinematic, hand-curated collection of scale model legends.
        </p>

        <div
          className={`mt-10 flex flex-col gap-3 sm:flex-row transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "1250ms" }}
        >
          <button onClick={() => scrollTo("#collection")} className="btn-gold">
            Explore Collection
          </button>
          <button onClick={() => scrollTo("#experience-360")} className="btn-ghost-gold">
            <Play size={14} /> 360° Experience
          </button>
        </div>

        <div
          className={`mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "1500ms" }}
        >
          {[
            { v: "200+", l: "Vehicles" },
            { v: "4", l: "Categories" },
            { v: "∞", l: "Passion" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">{s.v}</div>
              <div className="font-mono-tag mt-1 text-[10px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono-tag text-[9px] text-gold-soft/70">Scroll</span>
        <ChevronDown size={16} className="scroll-chevron text-gold/80" />
      </div>

      {/* Oman plate badge */}
      <div className="absolute bottom-6 right-6 z-10 hidden md:block">
        <div className="flex items-center gap-2 rounded-md border border-gold/40 bg-[oklch(0.78_0.13_85)] px-3 py-1.5">
          <span className="font-mono-tag text-[9px] font-bold text-[#0B1D15]">OMAN</span>
          <span className="font-display text-sm font-extrabold tracking-widest text-[#0B1D15]">GH · 2024</span>
        </div>
        <div className="mt-1 text-center font-mono-tag text-[8px] text-gold-soft/60">Yellow Plate</div>
      </div>
    </section>
  );
}
