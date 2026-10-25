import { GROUP_DISCOUNT_LABEL } from "@/config/program";
import type { CartPricing } from "@/features/pricing/pricing";
import { formatKwd } from "@/lib/money";

export function DiscountBreakdown({ pricing }: { pricing: CartPricing }) {
  return (
    <dl className="space-y-3">
      <div className="flex justify-between"><dt className="text-muted">عدد الأطفال</dt><dd className="font-bold">{pricing.childCount}</dd></div>
      <div className="flex justify-between"><dt className="text-muted">المجموع قبل الخصم</dt><dd className="font-bold">{formatKwd(pricing.subtotalFils)}</dd></div>
      <div className="flex justify-between">
        <dt className="text-muted">{GROUP_DISCOUNT_LABEL} ({pricing.discountPercent}%)</dt>
        <dd className="font-bold text-terracotta">{pricing.discountFils > 0 ? "−" : ""}{formatKwd(pricing.discountFils)}</dd>
      </div>
      <div className="flex items-center justify-between border-t-2 border-sand pt-3 text-lg">
        <dt className="font-extrabold text-gulf">المبلغ المطلوب</dt>
        <dd className="text-2xl font-extrabold text-ocean">{formatKwd(pricing.totalFils)}</dd>
      </div>
    </dl>
  );
}