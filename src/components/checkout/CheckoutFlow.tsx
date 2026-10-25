"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-store";
import { buildBooking, hasIssues, validateCheckout, type CheckoutIssues } from "@/features/booking/checkout";
import { createDemoGateway, type DemoOutcome, type PaymentStatus } from "@/services/payment/gateway";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { NotificationPreferences } from "./NotificationPreferences";
import { CheckoutSummary } from "./CheckoutSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { formatKwd } from "@/lib/money";
import type { PaymentMethod } from "@/types";

type Step = "contact" | "review" | "payment";
const STEP_INDEX: Record<Step, number> = { contact: 3, review: 4, payment: 5 };

export function CheckoutFlow() {
  const router = useRouter();
  const { items, contact, pricing, hydrated, booking, setContact, completeBooking } = useCart();
  const [step, setStep] = useState<Step>("contact");
  const [issues, setIssues] = useState<CheckoutIssues | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("knet");
  const [status, setStatus] = useState<PaymentStatus>("not_started");
  const [message, setMessage] = useState<string | null>(null);
  const busy = useRef(false); // blocks duplicate submissions synchronously
  const finished = useRef(false);

  useEffect(() => {
    if (hydrated && items.length === 0 && !finished.current && !booking) router.replace("/cart");
  }, [hydrated, items.length, booking, router]);

  if (!hydrated) return <div className="card h-48 animate-pulse" aria-label="جاري التحميل" />;
  if (items.length === 0) return <div className="card text-center">جاري تحويلك للسلة…</div>;

  function go(next: Step) {
    const found = validateCheckout(items, contact);
    if (next !== "contact" && hasIssues(found)) {
      setIssues(found);
      setStep("contact");
      return;
    }
    setIssues(null);
    setStep(next);
  }

  async function pay(outcome: DemoOutcome) {
    if (busy.current) return;
    const found = validateCheckout(items, contact);
    if (hasIssues(found)) {
      setIssues(found);
      setStep("contact");
      return;
    }
    busy.current = true;
    setStatus("processing");
    setMessage(null);
    const result = await createDemoGateway(outcome).pay({ amountFils: pricing.totalFils, method });
    if (result.status === "successful") {
      setStatus("successful");
      finished.current = true;
      completeBooking(buildBooking(items, contact, method));
      router.push("/confirmation");
      return; // lock stays on while navigating
    }
    setStatus("failed");
    setMessage(
      result.status === "cancelled"
        ? "تم إلغاء الدفع، ما تأكد أي حجز. تقدر تحاول مرة ثانية."
        : "صار خطأ في الدفع التجريبي، ما تأكد أي حجز. حاول مرة ثانية.",
    );
    busy.current = false;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={STEP_INDEX[step]} />

      {step === "contact" && (
        <form
          noValidate
          className="card space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            go("review");
          }}
        >
          <h2 className="text-2xl font-extrabold text-gulf">بيانات التواصل</h2>
          {issues?.cart && <p role="alert" className="field-error">{issues.cart}</p>}
          <PhoneNumberInput value={contact.phone} error={issues?.phone} onChange={(phone) => setContact({ phone })} />
          <NotificationPreferences
            contact={contact}
            errors={{ consentBooking: issues?.consentBooking, consentWhatsApp: issues?.consentWhatsApp }}
            onChange={setContact}
          />
          {issues && Object.keys(issues.items).length > 0 && (
            <p role="alert" className="field-error">فيه طفل بالسلة فترته مكتملة العدد، غيّرها من السلة.</p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ocean px-8 text-lg font-bold text-white hover:bg-gulf">
              مراجعة الحجز
            </button>
            <PrimaryButton href="/cart" variant="secondary">رجوع للسلة</PrimaryButton>
          </div>
        </form>
      )}

      {step === "review" && (
        <div className="space-y-5">
          <CheckoutSummary items={items} contact={contact} pricing={pricing} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={() => go("payment")}>كمّل للدفع</PrimaryButton>
            <PrimaryButton variant="secondary" onClick={() => setStep("contact")}>تعديل بيانات التواصل</PrimaryButton>
            <PrimaryButton variant="secondary" href="/cart">رجوع للسلة</PrimaryButton>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-5">
          <div className="card space-y-5">
            <h2 className="text-2xl font-extrabold text-gulf">الدفع</h2>
            <p className="rounded-2xl bg-sand/70 p-3 text-sm font-bold text-terracotta">
              هذا دفع تجريبي: ما فيه خصم فعلي ولا نطلب بيانات بنكية.
            </p>
            <p className="text-lg">المبلغ المطلوب: <b className="text-ocean">{formatKwd(pricing.totalFils)}</b></p>
            <PaymentMethodSelector value={method} onChange={setMethod} disabled={status === "processing"} />
            <div aria-live="polite" role="status" className="min-h-[24px]">
              {status === "processing" && <p className="font-bold text-ocean">جاري معالجة الدفع التجريبي…</p>}
              {status === "failed" && message && <p className="font-bold text-terracotta">{message}</p>}
              {status === "successful" && <p className="font-bold text-ocean">تم الدفع التجريبي، جاري تجهيز التأكيد…</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryButton onClick={() => pay("successful")} disabled={status === "processing" || status === "successful"}>
                تأكيد الدفع التجريبي
              </PrimaryButton>
              <PrimaryButton variant="danger" onClick={() => pay("cancelled")} disabled={status === "processing" || status === "successful"}>
                محاكاة إلغاء الدفع
              </PrimaryButton>
              <PrimaryButton variant="secondary" onClick={() => setStep("review")} disabled={status === "processing" || status === "successful"}>
                رجوع
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}