import type { AgeGroup } from "@/config/program";

export function AgeGroupCard({ group }: { group: AgeGroup }) {
  return (
    <div className="card text-center">
      <p className="text-sm font-bold text-muted">الفئة العمرية</p>
      <p className="mt-1 text-2xl font-extrabold text-gulf">{group.label}</p>
      <div className="mx-auto my-3 h-1 w-10 rounded bg-turquoise" />
      <p className="font-bold text-ocean">مسبح رقم {group.pool}</p>
    </div>
  );
}