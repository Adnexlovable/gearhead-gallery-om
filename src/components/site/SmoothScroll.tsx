import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Site-wide smooth scrolling + parallax.
 * - Lenis eases wheel scrolling on desktop pointers (touch keeps native momentum).
 * - Sections (.gh-chapter, .gh-approved-showroom, [data-parallax-section]) receive an eased
 *   --gh-parallax value; elements with [data-parallax="0.2"] move at that speed.
 * Disabled for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -90 }, prevent: (node: HTMLElement) => !!node.closest?.("[data-lenis-prevent], [role=dialog]") });
      }).catch(() => undefined);
    }

    const sectionSel = ".gh-chapter, .gh-approved-showroom, [data-parallax-section]";
    const current = new WeakMap<Element, number>();
    let raf = 0;
    const tick = (time: number) => {
      lenis?.raf(time);
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(sectionSel).forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        const target = Math.max(-70, Math.min(70, ((box.top + box.height / 2 - vh / 2) / vh) * -36));
        const prev = current.get(el) ?? target;
        const next = prev + (target - prev) * 0.14;
        current.set(el, next);
        el.style.setProperty("--gh-parallax", next.toFixed(2) + "px");
      });
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        const host = (el.parentElement ?? el).getBoundingClientRect();
        if (host.bottom < -200 || host.top > vh + 200) return;
        const target = -host.top * speed;
        const prev = current.get(el) ?? target;
        const next = prev + (target - prev) * 0.14;
        current.set(el, next);
        el.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0) scale(1.08)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
