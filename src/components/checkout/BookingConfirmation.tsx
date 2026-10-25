"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCart } from "@/features/cart/cart-store";
import { planBookingConfirmation } from "@/features/messaging/notification-service";
import { CHANNEL_LABEL, CONFIRMATION_PREVIEW_NOTICE } from "@/features/messaging/demo-labels";
import { channelsFor } from "@/features/messaging/types";
import { NotificationPreview } from "@/components/notifications/NotificationPreview";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DiscountBreakdown } from "@/components/cart/DiscountBreakdown";
import { formatPhone } from "@/lib/phone";
import { formatKwd } from "@/lib/money";

export function BookingConfirmation() {
  const router = useRouter();
  const { booking, hydrated, clearBooking } = useCart();
  const messages = useMemo(() => (booking ? planBookingConfirmation(booking) : []), [booking]);

  if (!hydrated) return <div className="card h-48 animate-pulse" aria-label="جاري التحميل" />;

  if (!booking) {
    return (
      <div className="card py-12 text-center">
        <h2 className="text-2xl font-extrabold text-gulf">ما لقينا حجز مؤكد</h2>
        <p className="mt-2 text-muted">ابدأ تسجيل جديد وبنساعدك خطوة بخطوة.</p>
        <div className="mt-5"><PrimaryButton href="/seasons">سجّل أول طفل</PrimaryButton></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card text-center" role="status">
        <p className="text-5xl" aria-hidden>🎉</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gulf">تم التسجيل بنجاح! 🎉</h1>
        <p className="mt-2 font-bold text-terracotta">هذا تأكيد حجز ودفع تجريبي.</p>
        <p className="mt-4 text-sm text-muted">رقم الحجز التجريبي</p>
        <p className="text-2xl font-extrabold tracking-wider text-ocean" dir="ltr">{booking.reference}</p>
      </div>

      <section className="card" aria-labelledby="bk-children">
        <h2 id="bk-children" className="mb-3 text-xl font-extrabold text-gulf">الأطفال المسجلين</h2>
        <ul className="divide-y divide-sand">
          {booking.lines.map((l, i) => (
            <li key={i} className="py-3">
              <p className="font-bold text-gulf">{l.name} <span className="font-normal text-muted">· {l.age} سنة</span></p>
              <p className="text-sm text-muted">الفئة العمرية: {l.groupLabel} · مسبح رقم {l.pool}</p>
              <p className="text-sm text-muted">الموسم: {l.seasonLabel} · الدورة: {l.periodLabel}</p>
              <p className="text-sm text-muted">الفترة اليومية: {l.shiftLabel}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="bk-pay">
        <h2 id="bk-pay" className="mb-3 text-xl font-extrabold text-gulf">الدفع (تجريبي)</h2>
        <DiscountBreakdown
          pricing={{
            childCount: booking.lines.length,
            subtotalFils: booking.subtotalFils,
            discountPercent: booking.discountPercent,
            discountFils: booking.discountFils,
            totalFils: booking.totalFils,
          }}
        />
        <p className="mt-4 text-sm text-muted">
          الإجمالي المسجل: {formatKwd(booking.totalFils)} · طريقة الدفع: {booking.paymentMethod === "knet" ? "KNET" : "بطاقة بنكية"} (محاكاة)
        </p>
      </section>

      <section className="card space-y-4" aria-labelledby="bk-msg">
        <h2 id="bk-msg" className="text-xl font-extrabold text-gulf">التواصل</h2>
        <p className="text-sm">
          <span className="text-muted">رقم الموبايل: </span><b dir="ltr">{formatPhone(booking.phone)}</b>
          <span className="text-muted"> · القنوات: </span>
          <b>{channelsFor(booking.channel).map((c) => CHANNEL_LABEL[c]).join(" + ")}</b>
        </p>
        <p className="font-bold text-ocean">{CONFIRMATION_PREVIEW_NOTICE}</p>
        {messages.map((m) => <NotificationPreview key={m.eventId} message={m} />)}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <PrimaryButton onClick={() => { clearBooking(); router.push("/seasons"); }}>تسجيل جديد</PrimaryButton>
        <PrimaryButton variant="secondary" href="/">العودة للرئيسية</PrimaryButton>
      </div>
    </div>
  );
}