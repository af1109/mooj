import { AGE_GROUPS, DAILY_HOURS, GROUP_DISCOUNT_LABEL, PROGRAM } from "@/config/program";
import { DEMO_PERIODS } from "@/data/periods";
import { calculatePricing } from "@/features/pricing/pricing";
import { formatKwd } from "@/lib/money";
import { formatRange } from "@/lib/dates";
import { AgeGroupCard } from "./AgeGroupCard";
import { ProgramCard } from "./ProgramCard";
import { DemoBadge, SectionHeading } from "@/components/ui/Decor";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const icon = (d: string) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export function ProgramOverview() {
  return (
    <>
      <section id="program" className="container-x scroll-mt-28 py-12">
        <SectionHeading title="تفاصيل البرنامج" subtitle="برنامج واحد واضح، بدون تعقيد: سجّل وخلاص." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProgramCard icon={icon("M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z")} title={`${PROGRAM.durationDays} يوم`}>
            كل تسجيل يغطي فترة كاملة من {PROGRAM.durationDays} يوم.
          </ProgramCard>
          <ProgramCard icon={icon("M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z")} title="فترة يومية وحدة">
            3 فترات (صباح، بعد الظهر، مساء)، كل فترة ساعتين، والطفل يختار وحدة.
          </ProgramCard>
          <ProgramCard icon={icon("M6 4h12M6 20h12M9 4v16M15 4v16")} title="مسابح مخصصة">
            4 مسابح، وكل مسبح لفئة عمرية وحدة.
          </ProgramCard>
          <ProgramCard icon={icon("M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6")} title={`${formatKwd(PROGRAM.pricePerChildFils)} للطفل`}>
            للأعمار من {PROGRAM.minAge} إلى {PROGRAM.maxAge} سنة.
          </ProgramCard>
        </div>

        <div className="card mt-8">
          <h3 className="mb-3 text-xl font-extrabold text-gulf">الفترات اليومية (اختار وحدة)</h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {PROGRAM.shifts.map((s) => (
              <li key={s.id} className="rounded-2xl bg-sand/60 p-4 text-center">
                <p className="font-bold text-gulf">{s.label}</p>
                <p className="text-sm text-muted">ساعتين</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            الأكاديمية تشتغل {DAILY_HOURS} ساعات يومياً موزعة على 3 فترات. كل طفل يختار فترة وحدة يداوم فيها طول الـ 14 يوم، وكل
            طفل يقدر يختار دورة وفترة مختلفة. أوقات الفترات بالتحديد بتنعلن لاحقاً.
          </p>
        </div>

        <h3 className="mb-4 mt-10 text-center text-2xl font-extrabold text-gulf">الفئات العمرية والمسابح</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGE_GROUPS.map((g) => (
            <AgeGroupCard key={g.id} group={g} />
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-muted">المسبح يتحدد تلقائياً حسب عمر الطفل، وما يمكن اختياره يدوياً.</p>
      </section>

      <section id="pricing" className="bg-sand/60 py-12">
        <div className="container-x">
          <SectionHeading title={GROUP_DISCOUNT_LABEL} subtitle="الخصم على إجمالي السلة حسب عدد الأطفال المسجلين في نفس السلة ونفس عملية الدفع، وما يلزم تكونون أقارب." />
          <div className="mx-auto max-w-2xl overflow-x-auto">
            <table className="w-full overflow-hidden rounded-card bg-white text-center shadow-card">
              <caption className="sr-only">جدول الخصم حسب عدد الأطفال</caption>
              <thead className="bg-gulf text-white">
                <tr>
                  <th scope="col" className="p-3">عدد الأطفال</th>
                  <th scope="col" className="p-3">قبل الخصم</th>
                  <th scope="col" className="p-3">الخصم</th>
                  <th scope="col" className="p-3">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((n) => {
                  const p = calculatePricing(n);
                  return (
                    <tr key={n} className="border-t border-sand">
                      <td className="p-3 font-bold">{n}</td>
                      <td className="p-3">{formatKwd(p.subtotalFils)}</td>
                      <td className="p-3">{p.discountPercent}%</td>
                      <td className="p-3 font-extrabold text-ocean">{formatKwd(p.totalFils)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-sm text-muted">طفلين: خصم 10%. ثلاثة أطفال أو أكثر: خصم 15%.</p>
        </div>
      </section>

      <section className="container-x py-12">
        <SectionHeading title="دورات التسجيل" />
        <div className="mb-4 text-center"><DemoBadge>فترات وتوفر تجريبي، مو مؤكد</DemoBadge></div>
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {DEMO_PERIODS.map((p) => (
            <li key={p.id} className="card flex items-center justify-between gap-3 !p-4">
              <span className="font-bold text-gulf">{formatRange(p.startDate, p.endDate)}</span>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${p.status === "available" ? "bg-turquoise/20 text-gulf" : "bg-sand text-muted"}`}>
                {p.status === "available" ? "متاح" : "مكتمل العدد"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <PrimaryButton href="/seasons">يلا نبدأ التسجيل</PrimaryButton>
        </div>
      </section>
    </>
  );
}