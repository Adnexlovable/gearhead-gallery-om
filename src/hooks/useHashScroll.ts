import { useEffect } from "react";

/**
 * Scrolls to the element matching the current URL hash once it exists.
 * Storefront sections mount after navigation, so retry briefly.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const el = document.getElementById(id);
      if (el) {
        window.clearInterval(timer);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries > 25) {
        window.clearInterval(timer);
      }
    }, 120);
    return () => window.clearInterval(timer);
  }, []);
}
