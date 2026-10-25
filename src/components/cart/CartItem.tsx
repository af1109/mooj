import Link from "next/link";
import { DEMO_PERIODS, findPeriod, findSeason, type ShiftId } from "@/data/periods";
import { getAgeGroup } from "@/features/registration/rules";
import { PROGRAM } from "@/config/program";
import { formatKwd } from "@/lib/money";
import { formatRange } from "@/lib/dates";
import type { CartItemData } from "@/types";

interface Props {
  item: CartItemData;
  issue?: string;
  onRemove: (id: string) => void;
  onChangePeriod: (item: CartItemData, periodId: string) => void;
  onChangeShift: (item: CartItemData, shiftId: string) => void;
}

export function CartItem({ item, issue, onRemove, onChangePeriod, onChangeShift }: Props) {
  const group = getAgeGroup(item.age);
  const period = findPeriod(item.periodId);
  const season = period && findSeason(period.seasonId);
  return (
    <li className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-gulf">{item.name}</h3>
          <p className="text-sm text-muted">
            {item.age} سنة · الفئة العمرية: {group?.label} · مسبح رقم {group?.pool}
          </p>
          <p className="text-sm text-muted">الموسم: {season?.nameAr}</p>
        </div>
        <p className="text-lg font-extrabold text-ocean">{formatKwd(PROGRAM.pricePerChildFils)}</p>
      </div>
      <div className="mt-4">
        <label htmlFor={`period-${item.id}`} className="label">الدورة (14 يوم)</label>
        <select
          id={`period-${item.id}`}
          className="input"
          value={item.periodId}
          onChange={(e) => onChangePeriod(item, e.target.value)}
        >
          {DEMO_PERIODS.map((p) => (
            <option key={p.id} value={p.id} disabled={p.status === "full" && p.id !== item.periodId}>
              {formatRange(p.startDate, p.endDate)} {p.status === "full" ? "(مكتمل العدد)" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label htmlFor={`shift-${item.id}`} className="label">الفترة اليومية</label>
        <select
          id={`shift-${item.id}`}
          className="input"
          value={item.shiftId}
          onChange={(e) => onChangeShift(item, e.target.value)}
        >
          {PROGRAM.shifts.map((s) => (
            <option key={s.id} value={s.id} disabled={period?.shifts[s.id as ShiftId] === "full" && s.id !== item.shiftId}>
              {s.label} (ساعتين) {period?.shifts[s.id as ShiftId] === "full" ? "(مكتملة العدد)" : ""}
            </option>
          ))}
        </select>
      </div>
      {issue && <p role="alert" className="field-error">{issue}</p>}
      <div className="mt-4 flex gap-3">
        <Link
          href={`/registration?edit=${item.id}`}
          className="inline-flex min-h-[44px] items-center rounded-full border-2 border-ocean px-5 font-bold text-ocean hover:bg-ocean hover:text-white"
        >
          تعديل
        </Link>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="min-h-[44px] rounded-full border-2 border-terracotta px-5 font-bold text-terracotta hover:bg-terracotta hover:text-white"
        >
          حذف
        </button>
      </div>
    </li>
  );
}