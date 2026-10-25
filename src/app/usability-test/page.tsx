import { UsabilityObservationForm } from "@/components/usability/UsabilityObservationForm";

export const metadata = { title: "نموذج ملاحظات اختبار الاستخدام | أكاديمية موجة للسباحة" };

export default function UsabilityTestPage() {
  return (
    <div className="container-x max-w-3xl py-8">
      <UsabilityObservationForm />
    </div>
  );
}