import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-ocean text-white hover:bg-gulf",
  secondary: "border-2 border-ocean bg-transparent text-ocean hover:bg-ocean hover:text-white",
  light: "bg-sand text-gulf hover:bg-white",
  danger: "border-2 border-terracotta bg-transparent text-terracotta hover:bg-terracotta hover:text-white",
};

const base =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: ReactNode;
}

export function PrimaryButton({ variant = "primary", href, className = "", children, ...rest }: Props) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}