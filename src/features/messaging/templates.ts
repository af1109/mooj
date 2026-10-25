import { ACADEMY } from "@/config/program";
import { formatKwd } from "@/lib/money";
import type { BookingRecord } from "@/types";

export function bookingConfirmationText(b: BookingRecord): string {
  const kids = b.lines.map((l) => `• ${l.name} – مسبح ${l.pool} – ${l.periodLabel} – ${l.shiftLabel}`).join("\n");
  return [
    `${ACADEMY.nameAr}`,
    `تم تأكيد حجزك (تجريبي) ✅`,
    `رقم الحجز: ${b.reference}`,
    kids,
    `المبلغ المدفوع: ${formatKwd(b.totalFils)}`,
  ].join("\n");
}

export const ABANDONED_CART_VARIANTS = [
  "هااا وينك؟ 🏊‍♂️ عيالنا لابسين النظارات وناطرينك! سلتك للحين ما تحاسبت 😂",
  "شكلك رحت تجيب الفوطة ونسيت الحجز! 🏖️😂 رد كمّل سلتك.",
] as const;

/** `cartLink` is an internal, non-identifying link (no booking details in the URL). */
export function abandonedCartText(variant: number, cartLink: string): string {
  const text = ABANDONED_CART_VARIANTS[variant % ABANDONED_CART_VARIANTS.length];
  return `${text}\n${cartLink}`;
}