import { normalizeDigits } from "./digits";

export const KUWAIT_COUNTRY_CODE = "+965";
export const PHONE_ERROR = "تأكد من رقم تلفونك، لازم يكون رقم كويتي صحيح من 8 أرقام.";

/** Kuwaiti mobile numbers are 8 digits starting with 5, 6 or 9. */
const KUWAIT_MOBILE = /^[569]\d{7}$/;

export interface PhoneResult {
  valid: boolean;
  /** 8-digit local number (digits only) when valid */
  number: string;
  error?: string;
}

export function validateKuwaitiMobile(input: string): PhoneResult {
  const cleaned = normalizeDigits(input).replace(/\s+/g, "");
  if (!KUWAIT_MOBILE.test(cleaned)) return { valid: false, number: "", error: PHONE_ERROR };
  return { valid: true, number: cleaned };
}

export function formatPhone(number: string): string {
  return `${KUWAIT_COUNTRY_CODE} ${number}`;
}