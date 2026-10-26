import { useEffect, useRef, type RefObject } from "react";
import {
  Boxes,
  Coffee,
  MapPin,
  Mountain,
  Route,
  Users,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";

const PILLARS = [
  {
    icon: Mountain,
    tag: "Track",
    title: "Specialized indoor micro-dune & rock crawler track",
    body: "A purpose-built indoor course lets a model be seen working real terrain before anyone buys it — capability demonstrated, not described on a box.",
  },
  {
    icon: Wrench,
    tag: "Conversion",
    title: "Hands-on test-drive and tuning bay",
    body: "Visitors drive before they decide. Guided test-drives and an on-site tuning bay carry the sales conversation to the point of purchase, holding collectors in the room for 60+ minutes.",
  },
  {
    icon: Warehouse,
    tag: "Margin",
    title: "Zero-middleman direct supply chain",
    body: "Sourcing directly from manufacturers and custom builders keeps the range exclusive and underpins 40%–60% gross product margins.",
  },
];

const METRICS = [
  { value: "54", unit: "SQM", label: "Retail footprint" },
  { value: "60+", unit: "MIN", label: "Dwell time" },
  { value: "40–60", unit: "%", label: "Gross margin" },
];

type PhaseItem = { icon: LucideIcon; text: string };

const PHASES: {
  phase: string;
  stage: string;
  title: string;
  place: string;
  status: string;
  marker: string;
  body: string;
  items: PhaseItem[];
}[] = [
  {
    phase: "Phase 01",
    stage: "Flagship",
    title: "Bousher Flagship Launch",
    place: "Bousher Sand Dunes · Muscat",
    status: "In preparation",
    marker: "Now",
    body: "Oman’s first dedicated track-to-retail centre, situated directly near the Bousher Sand Dunes to capture active off-roaders and automotive hobbyists at the point of passion.",
    items: [
      { icon: Boxes, text: "54 Sqm retail floor with an indoor micro-dune and rock crawler track" },
      { icon: Wrench, text: "Test-drive and tuning bay feeding the purchase decision" },
      { icon: Warehouse, text: "Direct-supply catalogue of RC, off-road and scale collector models" },
    ],
  },
  {
    phase: "Phase 02",
    stage: "Expansion",
    title: "Qurum Lifestyle Expansion",
    place: "Qurum · Muscat",
    status: "Concept",
    marker: "Next",
    body: "A next-generation experiential adventure hub that widens the audience beyond collectors into regular lifestyle visits and community programming.",
    items: [
      { icon: Coffee, text: "Specialty coffee lounge running alongside the models" },
      { icon: Users, text: "Community social space for meets, launches and club nights" },
      { icon: Route, text: "Sandbox tracks for open play and event programming" },
    ],
  },
];

function useCardTilt(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let rx = 0;
    let ry = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tx = -(py - 0.5) * 5;
      ty = (px - 0.5) * 7;
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };

    const loop = () => {
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      if (tx === 0 && ty === 0 && Math.abs(rx) < 0.01 && Math.abs(ry) < 0.01) {
        el.style.transform = "";
        raf = 0;
        return;
      }
      el.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      el.style.setProperty("--gx", "50%");
      el.style.setProperty("--gy", "50%");
      start();
    };

    el.addEventListener("mouseenter", start);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", start);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

function Zone({
  x,
  y,
  w,
  h,
  label,
  children,
}: {
  x: string;
  y: string;
  w: string;
  h: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute rounded-sm border border-dashed border-primary/35 bg-primary/[0.04]"
      style={{ left: x, top: y, width: w, height: h }}
    >
      {children}
      <span className="font-mono-tag absolute bottom-1.5 left-2 text-[8px] leading-3 text-primary/85">
        {label}
      </span>
    </div>
  );
}

function FloorStudy() {
  const ref = useRef<HTMLDivElement>(null);
  useCardTilt(ref);

  return (
    <div className="executive-card h-full p-4 md:p-5">
      <div className="font-mono-tag flex items-center justify-between gap-3 text-[9px] uppercase text-muted-foreground">
        <span>Floor study · 54 sqm</span>
        <span className="text-primary">Bousher flagship</span>
      </div>

      <div
        ref={ref}
        className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-sm border border-primary/25 bg-background will-change-transform md:aspect-[16/11]"
        style={{ transformOrigin: "center center" }}
      >
        <div className="carbon-surface pointer-events-none absolute inset-0 opacity-80" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, color-mix(in oklab, var(--foreground) 5%, transparent) 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, color-mix(in oklab, var(--foreground) 5%, transparent) 0 1px, transparent 1px 40px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%)",
          }}
        />

        <Zone x="5%" y="8%" w="60%" h="56%" label="Indoor micro-dune &amp; rock crawler track">
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M 20 14 H 80 Q 90 14 90 24 V 36 Q 90 46 80 46 H 20 Q 10 46 10 36 V 24 Q 10 14 20 14 Z"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.75"
              strokeWidth="0.8"
              strokeDasharray="4 4"
              className="track-dash"
            />
            <circle cx="10" cy="30" r="1.6" fill="var(--primary)" className="track-pulse" />
            <circle cx="90" cy="30" r="1.6" fill="var(--primary)" className="track-pulse" />
          </svg>
        </Zone>

        <Zone x="5%" y="68%" w="60%" h="24%" label="Test-drive &amp; tuning bay" />
        <Zone x="69%" y="8%" w="26%" h="56%" label="Retail model wall" />
        <Zone x="69%" y="68%" w="26%" h="24%" label="Counter &amp; entry" />

        <span className="font-mono-tag absolute right-2 top-2 border border-primary/30 bg-background/70 px-2 py-1 text-[8px] uppercase text-primary/90">
          54 sqm
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {METRICS.map((m) => (
          <div key={m.label}>
            <div className="font-display text-lg font-bold leading-none text-foreground md:text-2xl">
              {m.value}
              <span className="font-mono-tag ml-1 text-[9px] text-primary">{m.unit}</span>
            </div>
            <div className="font-mono-tag mt-2 text-[8px] text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommercialThesis() {
  return (
    <section id="commercial-thesis" className="scroll-mt-24 border-b border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="deck-label">
          <Route size={15} /> Commercial thesis &amp; execution roadmap
        </Reveal>

        <Reveal
          delay={60}
          className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8"
        >
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            The Track-to-Retail
            <br />
            <span className="text-muted-foreground">Synergy.</span>
          </h2>
          <span className="font-mono-tag text-[10px] uppercase text-muted-foreground">
            Indoor track · Test-drive · Direct supply
          </span>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
          <Reveal className="min-h-[340px]">
            <FloorStudy />
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-between gap-8">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              One continuous motion: a collector discovers a model on the wall, drives it on the
              indoor track, has it tuned on the same floor and buys it before leaving. The 54 Sqm
              footprint is deliberately compact — dense, demonstrable and productive per square
              metre rather than a showroom of stacked boxes.
            </p>

            <div className="grid gap-4">
              {PILLARS.map(({ icon: Icon, title, body, tag }, i) => (
                <div
                  key={title}
                  className="executive-card flex gap-4 p-5"
                  style={{ animation: `executive-arrive 700ms cubic-bezier(.16,1,.3,1) ${i * 90}ms both` }}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-primary/35 bg-primary/10">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-base font-semibold text-foreground md:text-lg">
                        {title}
                      </h3>
                      <span className="font-mono-tag rounded-sm border border-border px-2 py-1 text-[8px] uppercase text-muted-foreground">
                        {tag}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-20 border-t border-border pt-14">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="deck-label">
                <MapPin size={15} /> Two-phase strategic expansion
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold md:text-4xl">
                Bousher first. Qurum next.
              </h3>
            </div>
            <span className="font-mono-tag text-[10px] uppercase text-muted-foreground">
              Proposed phases · Not committed dates
            </span>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PHASES.map((p, i) => (
              <Reveal
                key={p.phase}
                delay={i * 110}
                className="executive-card flex flex-col gap-5 p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono-tag text-[9px] uppercase text-primary">{p.phase}</div>
                    <h4 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
                      {p.title}
                    </h4>
                  </div>
                  <span className="font-mono-tag shrink-0 rounded-sm border border-border px-3 py-1.5 text-[8px] uppercase text-muted-foreground">
                    {p.stage}
                  </span>
                </div>

                <div className="font-mono-tag flex items-center gap-2 text-[9px] uppercase text-muted-foreground">
                  <MapPin size={12} className="text-primary" />
                  {p.place}
                </div>

                <p className="text-sm leading-7 text-muted-foreground">{p.body}</p>

                <ul className="grid gap-4 border-t border-border pt-5">
                  {p.items.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <Icon size={15} className="mt-0.5 shrink-0 text-primary" />
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="font-mono-tag mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-[9px] uppercase text-muted-foreground">
                  <span>{p.status}</span>
                  <span className="text-primary/80">{p.marker}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-[11px] leading-5 text-muted-foreground">
            Footprint, dwell-time and margin figures are the owner’s stated targets for the proposed
            concept. They are not audited results, committed dates or financial forecasts.
          </p>
        </div>
      </div>
    </section>
  );
}
