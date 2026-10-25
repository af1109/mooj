import { describe, expect, it } from "vitest";
import { cartReducer, INITIAL_CART } from "./cart-reducer";
import { calculatePricing } from "@/features/pricing/pricing";
import { parseStoredCart } from "./storage";

const kid = (id: string, periodId = "p1") => ({ id, name: `طفل ${id}`, age: 10, periodId, shiftId: "morning" });

describe("cart", () => {
  it("adds unrelated children with different periods", () => {
    let s = cartReducer(INITIAL_CART, { type: "add", item: kid("a", "p1") });
    s = cartReducer(s, { type: "add", item: kid("b", "p3") });
    s = cartReducer(s, { type: "add", item: kid("c", "p4") });
    expect(s.items.map((i) => i.periodId)).toEqual(["p1", "p3", "p4"]);
    expect(calculatePricing(s.items.length).totalFils).toBe(306000);
  });
  it("edits and removes items, discount follows count", () => {
    let s = { ...INITIAL_CART, items: [kid("a"), kid("b"), kid("c")] };
    s = cartReducer(s, { type: "update", item: { ...kid("b"), name: "جديد", periodId: "p5", shiftId: "evening" } });
    expect(s.items[1]).toMatchObject({ name: "جديد", periodId: "p5", shiftId: "evening" });
    s = cartReducer(s, { type: "remove", id: "c" });
    expect(calculatePricing(s.items.length).discountPercent).toBe(10);
  });
  it("drops invalid stored data", () => {
    expect(parseStoredCart("not json").items).toEqual([]);
    const raw = JSON.stringify({ items: [kid("a"), { id: "x", name: "y", age: 99, periodId: "p1", shiftId: "morning" }], contact: {} });
    expect(parseStoredCart(raw).items).toHaveLength(1);
  });
});