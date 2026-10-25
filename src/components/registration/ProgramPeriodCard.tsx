import type { ProgramPeriod } from "@/data/periods";
import { formatRange } from "@/lib/dates";

interface Props {
  period: ProgramPeriod;
  selected: boolean;
  onSelect: (id: string) => void;
  describedBy?: string;
}

export function ProgramPeriodCard({ period, selected, onSelect, describedBy }: Props) {
  const full = period.status === "full";
  return (
    <label
      className={`relative flex min-h-[64px] items-center justify-between gap-3 rounded-2xl border-2 p-4 transition-colors ${
        full
          ? "cursor-not-allowed border-sand bg-sand/40 text-muted"
          : selected
            ? "cursor-pointer border-ocean bg-ocean/5"
            : "cursor-pointer border-sand bg-white hover:border-turquoise"
      } focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-turquoise`}
    >
      <input
        type="radio"
        name="period"
        value={period.id}
        checked={selected}
        disabled={full}
        onChange={() => onSelect(period.id)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span>
        <span className="block font-bold text-gulf">{formatRange(period.startDate, period.endDate)}</span>
        <span className="block text-xs text-muted">14 يوم (دورة تجريبية)</span>
      </span>
      <span
        className={`rounded-full px-3 py-1 text-sm font-bold ${
          full ? "bg-sand text-muted" : selected ? "bg-ocean text-white" : "bg-turquoise/20 text-gulf"
        }`}
      >
        {full ? "مكتمل العدد" : selected ? "✓ محدد" : "متاح"}
      </span>
    </label>
  );
}