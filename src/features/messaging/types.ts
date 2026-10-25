import type { Channel } from "@/types";

export type SingleChannel = "sms" | "whatsapp";
export type NotificationEventType = "booking_confirmation" | "abandoned_cart" | "program_reminder" | "schedule_update";

export interface OutgoingMessage {
  /** Unique per event + channel. Used for idempotency / duplicate prevention. */
  eventId: string;
  eventType: NotificationEventType;
  channel: SingleChannel;
  /** 8-digit Kuwaiti mobile number (country code +965 is added by the provider adapter) */
  to: string;
  body: string;
}

export type DeliveryState = "simulated" | "accepted" | "failed";

export interface DeliveryResult {
  eventId: string;
  channel: SingleChannel;
  /** "simulated" means a preview only. Nothing was sent. */
  state: DeliveryState;
}

export function channelsFor(channel: Channel): SingleChannel[] {
  return channel === "both" ? ["sms", "whatsapp"] : [channel];
}