import { describe, expect, it } from "vitest";
import {
  abandonedCartEligibility,
  createDemoProvider,
  dispatchMessages,
  planAbandonedCartReminder,
  planBookingConfirmation,
} from "./notification-service";
import { buildBooking } from "@/features/booking/checkout";
import { EMPTY_CONTACT } from "@/types";

const items = [{ id: "a", name: "سالم", age: 7, periodId: "p1", shiftId: "morning" }];
const contact = { ...EMPTY_CONTACT, phone: "55123456", consentBooking: true };
const providers = { sms: createDemoProvider("sms"), whatsapp: createDemoProvider("whatsapp") };

describe("channel selection", () => {
  it.each([
    ["sms", 1],
    ["whatsapp", 1],
    ["both", 2],
  ] as const)("%s", (channel, count) => {
    expect(planBookingConfirmation(buildBooking(items, { ...contact, channel }, "knet"))).toHaveLength(count);
  });
  it("confirmation includes the required details", () => {
    const [m] = planBookingConfirmation(buildBooking(items, contact, "knet", "MOJA-DEMO-TEST01"));
    expect(m.body).toContain("أكاديمية موجة للسباحة");
    expect(m.body).toContain("MOJA-DEMO-TEST01");
    expect(m.body).toContain("سالم");
    expect(m.body).toContain("120 د.ك");
  });
});

describe("abandoned cart", () => {
  const base = { phone: "55123456", channel: "sms" as const, consentReminders: true, childCount: 2, paid: false };
  it("requires consent", () => {
    expect(abandonedCartEligibility({ ...base, consentReminders: false }).eligible).toBe(false);
    expect(planAbandonedCartReminder({ ...base, consentReminders: false }, "c1")).toEqual([]);
  });
  it("requires a valid phone and a non-empty cart", () => {
    expect(abandonedCartEligibility({ ...base, phone: "12" }).eligible).toBe(false);
    expect(abandonedCartEligibility({ ...base, childCount: 0 }).eligible).toBe(false);
  });
  it("never reminds completed bookings", () => {
    expect(planAbandonedCartReminder({ ...base, paid: true }, "c1")).toEqual([]);
  });
  it("is eligible when all conditions hold", () => {
    expect(planAbandonedCartReminder(base, "c1")).toHaveLength(1);
  });
});

describe("delivery honesty and idempotency", () => {
  it("demo providers only report simulated, never accepted", async () => {
    const msgs = planBookingConfirmation(buildBooking(items, { ...contact, channel: "both" }, "knet"));
    const results = await dispatchMessages(msgs, providers, new Set());
    expect(results.every((r) => r.state === "simulated")).toBe(true);
  });
  it("does not send the same event twice on the same channel", async () => {
    const msgs = planBookingConfirmation(buildBooking(items, contact, "knet", "MOJA-DEMO-DUP001"));
    const handled = new Set<string>();
    expect(await dispatchMessages(msgs, providers, handled)).toHaveLength(1);
    expect(await dispatchMessages(msgs, providers, handled)).toHaveLength(0);
  });
});