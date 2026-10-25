export type Channel = "sms" | "whatsapp" | "both";
export type PaymentMethod = "knet" | "card";

export interface CartItemData {
  id: string;
  name: string;
  age: number;
  periodId: string;
  /** The ONE daily shift (morning / afternoon / evening) chosen for the 14 days */
  shiftId: string;
}

export interface ContactData {
  /** 8-digit Kuwaiti mobile number as typed (normalized on validation) */
  phone: string;
  channel: Channel;
  /** Required: agrees to booking-related messages on the chosen channel(s) */
  consentBooking: boolean;
  /** Required when channel includes WhatsApp */
  consentWhatsApp: boolean;
  /** Optional: reminders / unfinished-cart nudges. Never pre-selected. */
  consentReminders: boolean;
}

export const EMPTY_CONTACT: ContactData = {
  phone: "",
  channel: "sms",
  consentBooking: false,
  consentWhatsApp: false,
  consentReminders: false,
};

export interface BookingLine {
  name: string;
  age: number;
  groupLabel: string;
  pool: number;
  seasonLabel: string;
  periodLabel: string;
  shiftLabel: string;
  priceFils: number;
}

export interface BookingRecord {
  reference: string;
  createdAt: string;
  lines: BookingLine[];
  subtotalFils: number;
  discountPercent: number;
  discountFils: number;
  totalFils: number;
  phone: string;
  channel: Channel;
  consentReminders: boolean;
  paymentMethod: PaymentMethod;
  /** Always true in this prototype: payment and messages are simulated. */
  simulated: true;
}