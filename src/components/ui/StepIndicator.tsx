const STEPS = ["الموسم", "الطفل", "السلة", "التواصل", "المراجعة", "الدفع"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="خطوات التسجيل" className="mb-6">
      <p className="mb-2 text-center text-sm font-bold text-gulf" aria-hidden>
        الخطوة {current + 1} من {STEPS.length}
      </p>
      <ol className="flex items-center justify-between gap-1 text-[11px] sm:text-sm">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 text-center font-bold ${
              i <= current ? "text-ocean" : "text-muted"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                i < current ? "bg-ocean text-white" : i === current ? "bg-gulf text-white" : "bg-sand text-muted"
              }`}
            >
              {i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>
    </nav>
  );
}