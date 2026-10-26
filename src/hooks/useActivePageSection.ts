import { useEffect, useState } from "react";

export type PageSection = { id: string; label: string };

/** Detects which navigable section the visitor is looking at, including
 * navigation performed by scrolling instead of clicking a menu link. */
export function useActivePageSection(pathname: string, sections: readonly PageSection[]) {
  const [active, setActive] = useState("top");
  const ids = sections.map((section) => section.id).join("|");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = window.scrollY;
      if (top < 150) {
        setActive("top");
        return;
      }
      const headerHeight = 145;
      let selected = "top";
      let lastTop = -Infinity;

      for (const id of ids.split("|")) {
        const el = document.getElementById(id);
        if (!el) continue;
        const bounds = el.getBoundingClientRect();
        // Prefer the section occupying the readable area under the navbar.
        if (bounds.top <= headerHeight && bounds.bottom > headerHeight) {
          selected = id;
          break;
        }
        const absTop = bounds.top + top;
        if (absTop <= top + headerHeight && absTop > lastTop) {
          selected = id;
          lastTop = absTop;
        }
      }
      setActive(selected);
    };
    const queue = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    const delayed = window.setTimeout(update, 350);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("hashchange", queue);
    return () => {
      window.clearTimeout(delayed);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("hashchange", queue);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname, ids]);

  return active;
}
