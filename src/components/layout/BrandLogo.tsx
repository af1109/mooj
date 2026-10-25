import Link from "next/link";
import { ACADEMY } from "@/config/program";

export function BrandLogo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={ACADEMY.nameAr}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="20" fill="#21B6B0" />
        <path d="M6 22c4-6 8-6 12 0s8 6 12 0 4-3 4-3" fill="none" stroke="#064B50" strokeWidth="3" strokeLinecap="round" />
        <path d="M6 28c4-6 8-6 12 0s8 6 12 0 4-3 4-3" fill="none" stroke="#FFF9F0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="27" cy="12" r="3.5" fill="#F4E8D2" />
      </svg>
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold ${light ? "text-white" : "text-gulf"}`}>{ACADEMY.nameAr}</span>
        <span className={`block text-xs font-medium ${light ? "text-sand" : "text-muted"}`} dir="ltr">
          {ACADEMY.nameEn}
        </span>
      </span>
    </Link>
  );
}