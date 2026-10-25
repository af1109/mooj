import { GROUP_DISCOUNT_LABEL } from "@/config/program";

/** Positive, up-front explanation of the group discount (shown before checkout). */
export function DiscountPromo({ childCount }: { childCount?: number }) {
  const hint =
    childCount === undefined || childCount === 0
      ? "سجّل أكثر من طفل في نفس السلة ووفّر."
      : childCount === 1
        ? "أضف طفل ثاني وخذ خصم 10% على كل السلة."
        : childCount === 2
          ? "أضف طفل ثالث وارتفع الخصم إلى 15% على كل السلة."
          : "مبروك! خصم 15% مطبّق على كل السلة.";
  return (
    <aside className="rounded-2xl border-2 border-turquoise bg-turquoise/10 p-4" aria-label={GROUP_DISCOUNT_LABEL}>
      <p className="font-extrabold text-gulf">🎁 {GROUP_DISCOUNT_LABEL}</p>
      <p className="mt-1 text-sm leading-relaxed">
        طفلين = خصم 10% · ثلاثة أطفال أو أكثر = خصم 15%، على كل السلة. الخصم حسب عدد الأطفال في نفس السلة ونفس الدفعة، وما يلزم
        يكونون أقارب.
      </p>
      <p className="mt-1 text-sm font-bold text-ocean">{hint}</p>
    </aside>
  );
}