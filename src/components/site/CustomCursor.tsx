import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("no-cursor");

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      }
      const el = e.target as HTMLElement;
      const interactive = !!el.closest("a, button, [data-cursor='hover'], input, textarea, label");
      setHovering(interactive);
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("no-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[150] h-1.5 w-1.5 rounded-full bg-gold"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full border border-gold/60 transition-[width,height,background] duration-200"
        style={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          background: hovering ? "color-mix(in oklab, var(--gold) 12%, transparent)" : "transparent",
        }}
      />
    </>
  );
}
