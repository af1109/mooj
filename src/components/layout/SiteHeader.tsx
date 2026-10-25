"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { SaduBand } from "@/components/ui/Decor";
import { useCart } from "@/features/cart/cart-store";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/#program", label: "البرنامج" },
  { href: "/#pricing", label: "الأسعار والخصم" },
  { href: "/demo/reminders", label: "معاينة التذكيرات" },
];

export function SiteHeader() {
  const { items, hydrated } = useCart();
  const count = hydrated ? items.length : 0;
  return (
    <header className="sticky top-0 z-40 bg-gulf text-white">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <BrandLogo />
        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-medium text-sand hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/seasons"
            className="hidden min-h-[44px] items-center rounded-full bg-turquoise px-5 font-bold text-gulf hover:bg-white sm:inline-flex"
          >
            سجّل الحين
          </Link>
          <Link
            href="/cart"
            aria-label={`السلة، ${count} ${count === 1 ? "طفل" : "أطفال"}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      <nav aria-label="القائمة للجوال" className="container-x flex gap-4 overflow-x-auto pb-2 text-sm md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap py-1 text-sand">
            {n.label}
          </Link>
        ))}
        <Link href="/seasons" className="whitespace-nowrap py-1 font-bold text-turquoise">
          سجّل الحين
        </Link>
      </nav>
      <SaduBand />
    </header>
  );
}