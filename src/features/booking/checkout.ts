import { findPeriod, findSeason, findShift, isShiftAvailable } from "@/data/periods";
import { validateKuwaitiMobile } from "@/lib/phone";
import { getAgeGroup } from "@/features/registration/rules";
import { calculatePricing } from "@/features/pricing/pricing";
import { formatRange } from "@/lib/dates";
import type { BookingLine, BookingRecord, CartItemData, ContactData, PaymentMethod } from "@/types";

export interface CheckoutIssues {
  cart?: string;
  items: Record<string, string>;
  phone?: string;
  consentBooking?: string;
  consentWhatsApp?: string;
}

export const CHECKOUT_MESSAGES = {
  emptyCart: "السلة فاضية، سجّل طفل أول",
  periodFull: "دورة أو فترة هالطفل اليومية صارت مكتملة العدد، غيّرها من السلة",
  invalidChild: "بيانات هالطفل مو صحيحة، عدّلها من السلة",
  consentBooking: "لازم توافق على استلام رسائل الحجز عشان نأكد لك التسجيل",
  consentWhatsApp: "لازم توافق على استلام رسائل واتساب لو اخترته",
} as const;

/** Everything that must be true before payment can start. */
export function validateCheckout(items: readonly CartItemData[], contact: ContactData): CheckoutIssues {
  const issues: CheckoutIssues = { items: {} };
  if (items.length === 0) issues.cart = CHECKOUT_MESSAGES.emptyCart;
  for (const item of items) {
    const period = findPeriod(item.periodId);
    if (!getAgeGroup(item.age) || !item.name.trim()) issues.items[item.id] = CHECKOUT_MESSAGES.invalidChild;
    else if (!period || period.status !== "available" || !isShiftAvailable(item.periodId, item.shiftId)) issues.items[item.id] = CHECKOUT_MESSAGES.periodFull;
  }
  const phone = validateKuwaitiMobile(contact.phone);
  if (!phone.valid) issues.phone = phone.error;
  if (!contact.consentBooking) issues.consentBooking = CHECKOUT_MESSAGES.consentBooking;
  if ((contact.channel === "whatsapp" || contact.channel === "both") && !contact.consentWhatsApp) {
    issues.consentWhatsApp = CHECKOUT_MESSAGES.consentWhatsApp;
  }
  return issues;
}

export function hasIssues(issues: CheckoutIssues): boolean {
  return Boolean(
    issues.cart || issues.phone || issues.consentBooking || issues.consentWhatsApp || Object.keys(issues.items).length,
  );
}

/** Demonstration reference only. A real reference must come from the backend. */
export function generateDemoReference(random: () => number = Math.random): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(random() * alphabet.length)];
  return `MOJA-DEMO-${code}`;
}

export function buildBooking(
  items: readonly CartItemData[],
  contact: ContactData,
  paymentMethod: PaymentMethod,
  reference: string = generateDemoReference(),
  now: Date = new Date(),
): BookingRecord {
  const pricing = calculatePricing(items.length);
  const lines: BookingLine[] = items.map((item) => {
    const group = getAgeGroup(item.age);
    const period = findPeriod(item.periodId);
    return {
      name: item.name,
      age: item.age,
      groupLabel: group?.label ?? "",
      pool: group?.pool ?? 0,
      seasonLabel: (period && findSeason(period.seasonId)?.nameAr) ?? "",
      shiftLabel: findShift(item.shiftId)?.label ?? "",
      periodLabel: period ? formatRange(period.startDate, period.endDate) : "",
      priceFils: pricing.subtotalFils / Math.max(items.length, 1),
    };
  });
  return {
    reference,
    createdAt: now.toISOString(),
    lines,
    subtotalFils: pricing.subtotalFils,
    discountPercent: pricing.discountPercent,
    discountFils: pricing.discountFils,
    totalFils: pricing.totalFils,
    phone: validateKuwaitiMobile(contact.phone).number,
    channel: contact.channel,
    consentReminders: contact.consentReminders,
    paymentMethod,
    simulated: true,
  };
}