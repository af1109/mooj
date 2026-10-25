import { SeasonCard } from "@/components/registration/SeasonCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { DiscountPromo } from "@/components/cart/DiscountPromo";
import { DemoBadge } from "@/components/ui/Decor";
import { SEASONS } from "@/data/periods";

export const metadata = { title: "اختار الموسم | أكاديمية موجة للسباحة" };

export default function SeasonsPage() {
  return (
    <div className="container-x max-w-3xl py-8">
      <StepIndicator current={0} />
      <h1 className="text-3xl font-extrabold text-gulf">أي موسم تبون؟</h1>
      <p className="mb-2 mt-1 text-muted">اختار الموسم وبعدين الدورة والفترة اليومية لكل طفل.</p>
      <div className="mb-5"><DemoBadge>المواسم والتوفر تجريبية</DemoBadge></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SEASONS.map((s) => <SeasonCard key={s.id} season={s} />)}
      </div>
      <div className="mt-6"><DiscountPromo /></div>
    </div>
  );
}