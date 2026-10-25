"use client";

import { useCart } from "@/features/cart/cart-store";
import { validateCheckout } from "@/features/booking/checkout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CartItem } from "./CartItem";
import { DiscountBreakdown } from "./DiscountBreakdown";
import { DiscountPromo } from "./DiscountPromo";
import { formatKwd } from "@/lib/money";

export function CartView() {
  const { items, contact, pricing, hydrated, removeItem, updateItem } = useCart();

  if (!hydrated) return <div className="card h-48 animate-pulse" aria-label="جاري تحميل السلة" />;

  if (items.length === 0) {
    return (
      <div className="card py-12 text-center">
        <p className="text-5xl" aria-hidden>🏊</p>
        <h2 className="mt-3 text-2xl font-extrabold text-gulf">سلتك للحين فاضية! 🌊</h2>
        <div className="mt-5"><PrimaryButton href="/seasons">سجّل أول طفل</PrimaryButton></div>
      </div>
    );
  }

  const issues = validateCheckout(items, contact).items;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <section aria-labelledby="cart-children">
        <h2 id="cart-children" className="mb-3 text-2xl font-extrabold text-gulf">الأطفال المسجلين</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              issue={issues[item.id]}
              onRemove={removeItem}
              onChangePeriod={(it, periodId) => updateItem({ ...it, periodId })}
              onChangeShift={(it, shiftId) => updateItem({ ...it, shiftId })}
            />
          ))}
        </ul>
        <div className="mt-4"><PrimaryButton href="/registration?season=summer" variant="secondary">أضف طفل ثاني</PrimaryButton></div>
      </section>
      <aside className="card lg:sticky lg:top-28" aria-labelledby="cart-summary">
        <h2 id="cart-summary" className="mb-4 text-xl font-extrabold text-gulf">ملخص السلة</h2>
        <div className="mb-4"><DiscountPromo childCount={pricing.childCount} /></div>
        <div aria-live="polite"><DiscountBreakdown pricing={pricing} /></div>
        <PrimaryButton href="/checkout" className="mt-5 w-full">كمّل للتواصل والدفع</PrimaryButton>
      </aside>
      {/* One-handed mobile: the next action stays reachable without scrolling to the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-sand bg-white p-3 shadow-card lg:hidden">
        <div className="container-x flex items-center justify-between gap-3 !px-0">
          <div>
            <p className="text-xs text-muted">المبلغ المطلوب ({pricing.discountPercent}% خصم)</p>
            <p className="text-xl font-extrabold text-ocean">{formatKwd(pricing.totalFils)}</p>
          </div>
          <PrimaryButton href="/checkout" className="px-8">كمّل</PrimaryButton>
        </div>
      </div>
    </div>
  );
}