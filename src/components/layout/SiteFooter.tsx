import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { SaduBand } from "@/components/ui/Decor";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-gulf text-sand">
      <SaduBand />
      <div className="container-x grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <BrandLogo />
          <p className="text-sm leading-relaxed">
            برنامج سباحة صيفي كويتي للأطفال من 6 إلى 17 سنة، بأجواء ودية وآمنة.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#program" className="hover:text-white">تفاصيل البرنامج</Link></li>
            <li><Link href="/#pricing" className="hover:text-white">الأسعار والخصم</Link></li>
            <li><Link href="/seasons" className="hover:text-white">التسجيل</Link></li>
            <li><Link href="/cart" className="hover:text-white">السلة</Link></li>
            <li><Link href="/usability-test" className="hover:text-white">نموذج اختبار الاستخدام</Link></li>
            <li><Link href="/optional/extended-registration" className="hover:text-white">تسجيل موسّع (اختياري)</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-white">التواصل والتسجيل</h3>
          <p className="text-sm leading-relaxed">
            التسجيل يتم عبر هالموقع، ونتواصل معك على رقمك الكويتي عبر رسالة نصية أو واتساب. بيانات الاتصال الرسمية
            (عنوان، هاتف، حسابات) تُضاف عند اعتماد التشغيل الفعلي.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        نسخة تجريبية: الفترات والدفع والرسائل كلها محاكاة، وما يتم أي خصم أو إرسال فعلي.
      </div>
    </footer>
  );
}