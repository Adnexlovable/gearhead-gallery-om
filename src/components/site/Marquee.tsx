const BRANDS = [
  "Ferrari", "Lamborghini", "Porsche", "Mercedes-AMG", "BMW M", "Aston Martin",
  "Bugatti", "McLaren", "Land Rover", "Jeep", "Rolls-Royce", "Bentley",
  "Pagani", "Koenigsegg", "Alpine", "Lotus",
];

export function Marquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className="relative border-y border-gold/15 bg-surface/40 py-6 overflow-hidden">
      <div className="flex w-[200%] animate-marquee gap-12 whitespace-nowrap">
        {row.map((b, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="font-display text-2xl md:text-4xl font-bold tracking-tight text-foreground/40 hover:text-gold transition-colors">
              {b}
            </span>
            <span className="text-gold/50">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
