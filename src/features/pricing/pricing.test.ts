import { describe, expect, it } from "vitest";
import { calculatePricing } from "./pricing";
import { formatKwd } from "@/lib/money";

describe("group pricing", () => {
  it.each([
    [1, 120, 0, 120],
    [2, 240, 10, 216],
    [3, 360, 15, 306],
    [4, 480, 15, 408],
    [5, 600, 15, 510],
  ])("%i children", (n, subtotal, pct, total) => {
    const p = calculatePricing(n);
    expect(p.subtotalFils).toBe(subtotal * 1000);
    expect(p.discountPercent).toBe(pct);
    expect(p.totalFils).toBe(total * 1000);
    expect(p.discountFils + p.totalFils).toBe(p.subtotalFils);
  });

  it("recalculates the discount after removing children", () => {
    expect(calculatePricing(3).discountPercent).toBe(15);
    expect(calculatePricing(2).discountPercent).toBe(10);
    expect(calculatePricing(1).discountPercent).toBe(0);
    expect(calculatePricing(0).totalFils).toBe(0);
  });

  it("formats KWD", () => {
    expect(formatKwd(306000)).toBe("306 د.ك");
    expect(formatKwd(216500)).toBe("216.500 د.ك");
  });
});