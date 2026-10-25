import { PROGRAM } from "@/config/program";
import { DEMO_PERIODS, findShift, findSeason } from "@/data/periods";
import { DiscountBreakdown } from "@/components/cart/DiscountBreakdown";
import { getAgeGroup } from "@/features/registration/rules";
import type { CartPricing } from "@/features/pricing/pricing";
import { CHANNEL_LABEL } from "@/features/messaging/demo-labels";
import { channelsFor } from "@/features/messaging/types";
import { formatKwd } from "@/lib/money";
import { formatRange } from "@/lib/dates";
import { formatPhone, validateKuwaitiMobile } from "@/lib/phone";
import type { CartItemData, ContactData } from "@/types";

export function CheckoutSummary({ items, contact, pricing }: { items: CartItemData[]; contact: ContactData; pricing: CartPricing }) {
  const phone = validateKuwaitiMobile(contact.phone);
  return (
    <div className="card space-y-5">
      <h2 className="text-xl font-extrabold text-gulf">ملخص الحجز</h2>
      <ul className="divide-y divide-sand">
        {items.map((item) => {
          const g = getAgeGroup(item.age);
          const p = DEMO_PERIODS.find((x) => x.id === item.periodId);
          return (
            <li key={item.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
              <div>
                <p className="font-bold text-gulf">{item.name}</p>
                <p className="text-sm text-muted">
                  {item.age} سنة · {g?.label} · مسبح رقم {g?.pool}
                </p>
                <p className="text-sm text-muted">
                  الموسم: {p && findSeason(p.seasonId)?.nameAr} · {p ? formatRange(p.startDate, p.endDate) : ""}
                </p>
                <p className="text-sm text-muted">الفترة اليومية: {findShift(item.shiftId)?.label}</p>
              </div>
              <p className="font-bold text-ocean">{formatKwd(PROGRAM.pricePerChildFils)}</p>
            </li>
          );
        })}
      </ul>
      <DiscountBreakdown pricing={pricing} />
      <div className="rounded-2xl bg-sand/70 p-4 text-sm">
        <p><span className="text-muted">رقم الموبايل: </span><b dir="ltr">{phone.valid ? formatPhone(phone.number) : "—"}</b></p>
        <p>
          <span className="text-muted">قنوات التواصل: </span>
          <b>{channelsFor(contact.channel).map((c) => CHANNEL_LABEL[c]).join(" + ")}</b>
        </p>
      </div>
    </div>
  );
}