import { validateKuwaitiMobile } from "@/lib/phone";
import { abandonedCartText, bookingConfirmationText } from "./templates";
import { channelsFor, type DeliveryResult, type OutgoingMessage, type SingleChannel } from "./types";
import type { BookingRecord, Channel } from "@/types";

/** One confirmation message per selected channel, with a stable idempotency key. */
export function planBookingConfirmation(booking: BookingRecord): OutgoingMessage[] {
  const body = bookingConfirmationText(booking);
  return channelsFor(booking.channel).map((channel) => ({
    eventId: `${booking.reference}:booking_confirmation:${channel}`,
    eventType: "booking_confirmation",
    channel,
    to: booking.phone,
    body,
  }));
}

export interface AbandonedCartInput {
  phone: string;
  channel: Channel;
  consentReminders: boolean;
  childCount: number;
  paid: boolean;
}

export interface Eligibility {
  eligible: boolean;
  reasons: string[];
}

/** A reminder needs a valid number, explicit opt-in, a non-empty cart and no payment. */
export function abandonedCartEligibility(input: AbandonedCartInput): Eligibility {
  const reasons: string[] = [];
  if (!validateKuwaitiMobile(input.phone).valid) reasons.push("ما فيه رقم كويتي صحيح");
  if (!input.consentReminders) reasons.push("العميل ما وافق على التذكيرات الاختيارية");
  if (input.childCount < 1) reasons.push("السلة فاضية");
  if (input.paid) reasons.push("الحجز اندفع، ما نرسل تذكير");
  return { eligible: reasons.length === 0, reasons };
}

export function planAbandonedCartReminder(
  input: AbandonedCartInput,
  cartId: string,
  variant = 0,
  cartLink = "/cart",
): OutgoingMessage[] {
  if (!abandonedCartEligibility(input).eligible) return [];
  const to = validateKuwaitiMobile(input.phone).number;
  return channelsFor(input.channel).map((channel) => ({
    eventId: `${cartId}:abandoned_cart:${channel}`,
    eventType: "abandoned_cart",
    channel,
    to,
    body: abandonedCartText(variant, cartLink),
  }));
}

/** Drops messages whose eventId was already handled, and remembers the new ones. */
export function dedupeMessages(messages: OutgoingMessage[], handled: Set<string>): OutgoingMessage[] {
  const fresh: OutgoingMessage[] = [];
  for (const m of messages) {
    if (handled.has(m.eventId)) continue;
    handled.add(m.eventId);
    fresh.push(m);
  }
  return fresh;
}

/** Provider boundary. Real SMS / WhatsApp Business adapters implement this server-side. */
export interface MessageProvider {
  channel: SingleChannel;
  send(message: OutgoingMessage): Promise<DeliveryResult>;
}

/** Demonstration provider: makes no network request and never reports real delivery. */
export function createDemoProvider(channel: SingleChannel): MessageProvider {
  return {
    channel,
    send: async (m) => ({ eventId: m.eventId, channel, state: "simulated" }),
  };
}

export async function dispatchMessages(
  messages: OutgoingMessage[],
  providers: Record<SingleChannel, MessageProvider>,
  handled: Set<string>,
): Promise<DeliveryResult[]> {
  const fresh = dedupeMessages(messages, handled);
  return Promise.all(fresh.map((m) => providers[m.channel].send(m)));
}