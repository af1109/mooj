export function SaduBand({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return <div aria-hidden className={`sadu-band ${light ? "sadu-band-light" : ""} ${className}`} />;
}

/** Soft Gulf wave used between sections. `fill` is a Tailwind text color class. */
export function WaveDivider({ fill = "text-cream", flip = false }: { fill?: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${fill} ${flip ? "rotate-180" : ""}`}
    >
      <path fill="currentColor" d="M0 40c120 40 240 40 360 10S600 0 720 10s240 60 360 50 240-40 360-20v40H0z" />
    </svg>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-extrabold text-gulf sm:text-4xl">{title}</h2>
      <SaduBand className="mx-auto mt-3 w-40" />
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted">{subtitle}</p>}
    </div>
  );
}

export function DemoBadge({ children = "بيانات تجريبية" }: { children?: string }) {
  return (
    <span className="inline-block rounded-full bg-sand px-3 py-1 text-xs font-bold text-terracotta">{children}</span>
  );
}