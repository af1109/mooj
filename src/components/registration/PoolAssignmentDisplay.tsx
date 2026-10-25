import { PROGRAM } from "@/config/program";
import { formatKwd } from "@/lib/money";
import type { AgeGroup } from "@/config/program";

export function PoolAssignmentDisplay({ group }: { group?: AgeGroup }) {
  return (
    <div aria-live="polite" className="rounded-2xl bg-sand/70 p-4">
      {group ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <p className="font-extrabold text-gulf">الفئة العمرية: {group.label}</p>
          </div>
          <div>
            <p className="font-extrabold text-gulf">المسبح المخصص: مسبح رقم {group.pool}</p>
          </div>
          <div>
            <p className="font-extrabold text-ocean">السعر: {formatKwd(PROGRAM.pricePerChildFils)}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">اكتب عمر الطفل وبنحدد له الفئة العمرية والمسبح تلقائياً.</p>
      )}
    </div>
  );
}