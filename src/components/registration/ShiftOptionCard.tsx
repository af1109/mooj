import type { PeriodStatus } from "@/data/periods";

interface Props {
  id: string;
  label: string;
  hours: number;
  status: PeriodStatus;
  selected: boolean;
  onSelect: (id: string) => void;
  describedBy?: string;
}

export function ShiftOptionCard({ id, label, hours, status, selected, onSelect, describedBy }: Props) {
  const full = status === "full";
  return (
    <label
      className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition-colors ${
        full
          ? "cursor-not-allowed border-sand bg-sand/40 text-muted"
          : selected
            ? "cursor-pointer border-ocean bg-ocean/5"
            : "cursor-pointer border-sand bg-white hover:border-turquoise"
      } focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-turquoise`}
    >
      <input type="radio" name="shift" value={id} disabled={full} checked={selected} onChange={() => onSelect(id)} aria-describedby={describedBy} className="sr-only" />
      <span className="font-bold text-gulf">{label}</span>
      <span className="text-xs text-muted">{hours === 2 ? "ساعتين" : `${hours} ساعات`}</span>
      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${full ? "bg-sand text-muted" : selected ? "bg-ocean text-white" : "bg-turquoise/20 text-gulf"}`}>
        {full ? "مكتمل العدد" : selected ? "✓ محدد" : "متاح"}
      </span>
    </label>
  );
}