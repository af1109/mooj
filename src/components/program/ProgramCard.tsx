import type { ReactNode } from "react";

export function ProgramCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute end-0 top-0 h-10 w-10 rounded-es-3xl bg-sand" aria-hidden />
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean/10 text-ocean">{icon}</div>
      <h3 className="mb-1 text-xl font-extrabold text-gulf">{title}</h3>
      <div className="text-muted">{children}</div>
    </div>
  );
}