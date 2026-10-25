import { z } from "zod";
import { findPeriod, findShift } from "@/data/periods";
import { isValidAge } from "@/features/registration/rules";
import { INITIAL_CART, type CartState } from "./cart-reducer";
import { EMPTY_CONTACT, type BookingRecord } from "@/types";

export const CART_KEY = "moja:cart:v1";
export const BOOKING_KEY = "moja:booking:v1";

const storedSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().trim().min(1).max(60),
      age: z.number(),
      periodId: z.string(),
      shiftId: z.string(),
    }),
  ),
  contact: z
    .object({
      phone: z.string().max(20),
      channel: z.enum(["sms", "whatsapp", "both"]),
      consentBooking: z.boolean(),
      consentWhatsApp: z.boolean(),
      consentReminders: z.boolean(),
    })
    .partial(),
});

/** Parse and validate stored cart data; anything invalid is dropped, never trusted. */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return INITIAL_CART;
  try {
    const parsed = storedSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return INITIAL_CART;
    return {
      items: parsed.data.items.filter((i) => isValidAge(i.age) && findPeriod(i.periodId) && findShift(i.shiftId)),
      contact: { ...EMPTY_CONTACT, ...parsed.data.contact },
    };
  } catch {
    return INITIAL_CART;
  }
}

const bookingSchema = z.object({
  reference: z.string(),
  createdAt: z.string(),
  lines: z.array(
    z.object({
      name: z.string(),
      age: z.number(),
      groupLabel: z.string(),
      pool: z.number(),
      seasonLabel: z.string(),
      periodLabel: z.string(),
      shiftLabel: z.string(),
      priceFils: z.number(),
    }),
  ),
  subtotalFils: z.number(),
  discountPercent: z.number(),
  discountFils: z.number(),
  totalFils: z.number(),
  phone: z.string(),
  channel: z.enum(["sms", "whatsapp", "both"]),
  consentReminders: z.boolean(),
  paymentMethod: z.enum(["knet", "card"]),
  simulated: z.literal(true),
});

export function parseStoredBooking(raw: string | null): BookingRecord | null {
  if (!raw) return null;
  try {
    const parsed = bookingSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}