import { DISCOUNT_TIERS, PROGRAM } from "@/config/program";

export interface CartPricing {
  childCount: number;
  subtotalFils: number;
  discountPercent: number;
  discountFils: number;
  totalFils: number;
}

/** Discount depends only on the number of children in the same cart / transaction. */
export function discountPercentFor(childCount: number): number {
  const tier = DISCOUNT_TIERS.find((t) => childCount >= t.minChildren);
  return tier ? tier.percent : 0;
}

/** Single source of truth for all cart totals. Integer fils only. */
export function calculatePricing(childCount: number): CartPricing {
  const count = Math.max(0, Math.trunc(childCount));
  const subtotalFils = count * PROGRAM.pricePerChildFils;
  const discountPercent = discountPercentFor(count);
  const discountFils = Math.round((subtotalFils * discountPercent) / 100);
  return {
    childCount: count,
    subtotalFils,
    discountPercent,
    discountFils,
    totalFils: subtotalFils - discountFils,
  };
}