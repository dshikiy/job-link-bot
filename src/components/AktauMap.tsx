import { useMemo, useState } from "react";
import { AKTAU_DISTRICTS } from "@/lib/districts";

type Props = {
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (id: string | null) => void;
};

export function AktauMap({ counts, selected, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const max = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border shadow-elegant bg-card-gradient">
      {/* Sea background */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.14 230)" />
            <stop offset="100%" stopColor="oklch(0.45 0.16 240)" />
          </linearGradient>
          <linearGradient id="sand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.93 0.05 75)" />
            <stop offset="100%" stopColor="oklch(0.85 0.08 65)" />
          </linearGradient>
        </defs>
        {/* Caspian sea (right side) */}
        <path d="M 100 0 L 100 100 L 78 100 Q 72 60 82 30 Q 86 12 100 0 Z" fill="url(#sea)" opacity="0.85" />
        {/* Sand/desert background */}
        <rect x="0" y="0" width="100" height="100" fill="url(#sand)" opacity="0.35" />
        {/* Coastline accents */}
        <path d="M 78 100 Q 72 60 82 30 Q 86 12 100 0" stroke="oklch(0.95 0.05 75)" strokeWidth="0.4" fill="none" opacity="0.6" />
      </svg>

      {/* "Caspian Sea" label */}
      <div className="absolute right-4 bottom-6 text-right">
        <div className="font-display text-xs uppercase tracking-widest text-primary-foreground/90 drop-shadow">
          Каспий
        </div>
        <div className="text-[10px] text-primary-foreground/70">теңізі</div>
      </div>
      <div className="absolute left-4 top-4">
        <div className="font-display text-xs uppercase tracking-widest text-foreground/70">Ақтау</div>
        <div className="text-[10px] text-muted-foreground">микрорайондар бойынша</div>
      </div>

      {/* District bubbles */}
      {AKTAU_DISTRICTS.map((d) => {
        const c = counts[d.id] || 0;
        const intensity = c / max;
        const isActive = selected === d.id;
        const isHover = hover === d.id;
        const size = 22 + intensity * 28; // px
        return (
          <button
            key={d.id}
            onClick={() => onSelect(isActive ? null : d.id)}
            onMouseEnter={() => setHover(d.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute rounded-full font-display font-bold text-[10px] transition-all duration-200 ${
              isActive
                ? "bg-gold-gradient text-gold-foreground scale-125 shadow-glow z-20"
                : c > 0
                ? "bg-primary text-primary-foreground shadow-card hover:scale-110 z-10"
                : "bg-muted text-muted-foreground hover:scale-110"
            } ${c > 0 && !isActive ? "animate-pulse-ring" : ""}`}
          >
            {c > 0 ? c : "·"}
          </button>
        );
      })}

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-elegant"
          style={{
            left: `${AKTAU_DISTRICTS.find((d) => d.id === hover)!.x}%`,
            top: `${AKTAU_DISTRICTS.find((d) => d.id === hover)!.y - 6}%`,
          }}
        >
          {hover} · {counts[hover] || 0} вакансия
        </div>
      )}
    </div>
  );
}
