import Link from "next/link";
import type { Season } from "@/data/periods";
import { periodsForSeason } from "@/data/periods";

export function SeasonCard({ season }: { season: Season }) {
  const open = season.status === "open";
  const available = periodsForSeason(season.id).filter((p) => p.status === "available").length;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-extrabold text-gulf">{season.nameAr}</h3>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${open ? "bg-turquoise/20 text-gulf" : "bg-sand text-muted"}`}>
          {open ? "التسجيل مفتوح" : "قريباً"}
        </span>
      </div>
      <p className="mt-2 text-muted">{season.description}</p>
      {open && <p className="mt-2 text-sm font-bold text-ocean">{available} دورات متاحة (تجريبية)</p>}
      {open && <span className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-ocean px-6 font-bold text-white">اختار {season.nameAr}</span>}
    </>
  );
  return open ? (
    <Link href={`/registration?season=${season.id}`} className="card block transition-shadow hover:shadow-lg">{inner}</Link>
  ) : (
    <div className="card opacity-70" aria-disabled>{inner}</div>
  );
}