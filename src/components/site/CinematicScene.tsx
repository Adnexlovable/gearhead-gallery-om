import { useEffect, useRef } from "react";

/** Decorative showroom footage: lazy-loaded, muted, offline/poster safe and
 * disabled for reduced-motion and data-saving visitors. */
export function CinematicScene({
  poster,
  mobileSrc,
  desktopSrc,
  className = "",
  videoClassName = "gh-cover-video",
}: {
  poster: string;
  mobileSrc: string;
  desktopSrc?: string;
  className?: string;
  videoClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof window === "undefined") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reducedMotion || connection?.saveData) return;

    let visible = false;
    const onVisibility = () => {
      if (document.hidden || !visible) el.pause();
      else void el.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      onVisibility();
    }, { rootMargin: "160px 0px" });
    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      el.pause();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mobileSrc, desktopSrc]);

  return (
    <div className={className} style={{ backgroundImage: `url("${poster}")` }} aria-hidden="true">
      <video
        ref={videoRef}
        className={videoClassName}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={false}
        disablePictureInPicture
        tabIndex={-1}
      >
        {desktopSrc && <source src={desktopSrc} type="video/mp4" media="(min-width: 768px)" />}
        <source src={mobileSrc} type="video/mp4" />
      </video>
    </div>
  );
}
