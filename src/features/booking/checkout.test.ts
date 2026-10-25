import { describe, expect, it } from "vitest";
import { buildBooking, hasIssues, validateCheckout } from "./checkout";
import { validateKuwaitiMobile } from "@/lib/phone";
import { createDemoGateway } from "@/services/payment/gateway";
import { EMPTY_CONTACT, type ContactData } from "@/types";

const items = [
  { id: "a", name: "سالم", age: 7, periodId: "p1", shiftId: "morning" },
  { id: "b", name: "نورة", age: 13, periodId: "p3", shiftId: "afternoon" },
];
const good: ContactData = { ...EMPTY_CONTACT, phone: "55123456", consentBooking: true };

describe("phone", () => {
  it("accepts valid Kuwaiti mobiles", () => {
    expect(validateKuwaitiMobile("55123456").valid).toBe(true);
    expect(validateKuwaitiMobile("٩٩١٢٣٤٥٦").valid).toBe(true);
  });
  it.each(["", "1234567", "551234567", "5512345a", "21234567", "+96555123456"])("rejects %j", (v) => {
    expect(validateKuwaitiMobile(v).valid).toBe(false);
  });
});

describe("checkout validation", () => {
  it("passes with only a phone and booking consent (no email / parent name)", () => {
    expect(hasIssues(validateCheckout(items, good))).toBe(false);
  });
  it("blocks missing phone, empty cart, missing consent", () => {
    expect(validateCheckout(items, { ...good, phone: "" }).phone).toBeTruthy();
    expect(validateCheckout([], good).cart).toBeTruthy();
    expect(validateCheckout(items, { ...good, consentBooking: false }).consentBooking).toBeTruthy();
  });
  it("requires WhatsApp opt-in when WhatsApp is chosen", () => {
    expect(validateCheckout(items, { ...good, channel: "whatsapp" }).consentWhatsApp).toBeTruthy();
    expect(validateCheckout(items, { ...good, channel: "both", consentWhatsApp: true }).consentWhatsApp).toBeUndefined();
  });
  it("flags items whose period is full", () => {
    const issues = validateCheckout([{ id: "z", name: "x", age: 8, periodId: "p2", shiftId: "morning" }], good);
    expect(issues.items.z).toBeTruthy();
  });
});

describe("booking and payment", () => {
  it("booking totals match the cart pricing", () => {
    const b = buildBooking(items, good, "knet");
    expect(b.subtotalFils).toBe(240000);
    expect(b.discountPercent).toBe(10);
    expect(b.totalFils).toBe(216000);
    expect(b.lines.map((l) => l.pool)).toEqual([1, 3]);
    expect(b.reference).toMatch(/^MOJA-DEMO-/);
    expect(b.simulated).toBe(true);
  });
  it("demo gateway reports simulated results, cancel is not success", async () => {
    const cancelled = await createDemoGateway("cancelled", 0).pay({ amountFils: 1, method: "card" });
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.simulated).toBe(true);
  });
});