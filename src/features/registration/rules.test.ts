import { describe, expect, it } from "vitest";
import { getAgeGroup, getPool } from "./rules";
import { validateChild } from "./schema";
import { DEMO_PERIODS, SEASONS } from "@/data/periods";
import { PROGRAM } from "@/config/program";

describe("age to pool", () => {
  it.each([[6, 1], [8, 1], [9, 2], [11, 2], [12, 3], [14, 3], [15, 4], [17, 4]])("age %i -> pool %i", (age, pool) => {
    expect(getPool(age)).toBe(pool);
  });
  it("rejects ages outside 6-17", () => {
    expect(getAgeGroup(5)).toBeUndefined();
    expect(getAgeGroup(18)).toBeUndefined();
    expect(getAgeGroup(7.5)).toBeUndefined();
  });
  it("age 10 is group 9-11 in pool 2", () => {
    expect(getAgeGroup(10)?.label).toBe("9–11 سنة");
  });
});

describe("periods", () => {
  it("each demo period covers exactly 14 calendar days inclusive", () => {
    for (const p of DEMO_PERIODS) {
      const days = (Date.parse(p.endDate) - Date.parse(p.startDate)) / 86400000 + 1;
      expect(days).toBe(14);
    }
  });
  it("has at least one full period", () => {
    expect(DEMO_PERIODS.some((p) => p.status === "full")).toBe(true);
  });
});

const ok = { name: "سالم", age: "10", periodId: "p1", shiftId: "morning", ageConfirmed: true };

describe("seasons and shifts", () => {
  it("each demo period belongs to a known season", () => {
    for (const p of DEMO_PERIODS) expect(SEASONS.some((s) => s.id === p.seasonId)).toBe(true);
  });
  it("offers exactly three 2-hour shifts (6 hours a day)", () => {
    expect(PROGRAM.shifts).toHaveLength(3);
    expect(PROGRAM.shifts.every((s) => s.hours === 2)).toBe(true);
  });
  it("requires exactly one shift per child", () => {
    const r = validateChild({ ...ok, shiftId: "" });
    expect(!r.success && r.errors.shiftId).toBeTruthy();
  });
  it("rejects a shift that is full in the chosen period", () => {
    const r = validateChild({ ...ok, periodId: "p3", shiftId: "evening" });
    expect(!r.success && r.errors.shiftId).toBeTruthy();
    expect(validateChild({ ...ok, periodId: "p3", shiftId: "morning" }).success).toBe(true);
  });
  it("allows different period and shift per child", () => {
    expect(validateChild({ ...ok, periodId: "p4", shiftId: "afternoon" }).success).toBe(true);
  });
  it("requires the parent to confirm the age group", () => {
    const r = validateChild({ ...ok, ageConfirmed: false });
    expect(!r.success && r.errors.ageConfirmed).toBeTruthy();
  });
});

describe("child validation", () => {
  it("accepts a valid child", () => {
    expect(validateChild(ok)).toEqual({ success: true, data: { name: "سالم", age: 10, periodId: "p1", shiftId: "morning" } });
  });
  it("accepts Arabic-Indic digits", () => {
    expect(validateChild({ ...ok, age: "١٠" }).success).toBe(true);
  });
  it("requires a name", () => {
    const r = validateChild({ ...ok, name: "  " });
    expect(!r.success && r.errors.name).toBeTruthy();
  });
  it("requires a period", () => {
    const r = validateChild({ ...ok, periodId: "" });
    expect(!r.success && r.errors.periodId).toBeTruthy();
  });
  it("rejects fully booked periods", () => {
    const r = validateChild({ ...ok, periodId: "p2" });
    expect(!r.success && r.errors.periodId).toBeTruthy();
  });
  it.each(["5", "18", "abc", "7.5", ""])("rejects age %j", (age) => {
    const r = validateChild({ ...ok, age });
    expect(!r.success && r.errors.age).toBeTruthy();
  });
});