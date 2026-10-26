import { useEffect, useState } from "react";

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), 1600);
    const t2 = setTimeout(() => setGone(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="font-mono-tag text-[10px] text-gold-soft/70 mb-4">GearHead RC</div>
      <div className="font-display text-3xl md:text-5xl font-bold text-gold-gradient mb-8">
        Opening the Vitrine
      </div>
      <div className="relative h-px w-64 overflow-hidden bg-white/10">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent loader-sweep" />
      </div>
      <div className="mt-6 font-mono-tag text-[10px] text-muted-foreground">Muscat · Oman</div>
    </div>
  );
}
