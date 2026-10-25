import type { PaymentMethod } from "@/types";

const METHODS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "knet", label: "KNET", hint: "دفع تجريبي" },
  { value: "card", label: "بطاقة بنكية", hint: "دفع تجريبي" },
];

export function PaymentMethodSelector({
  value, onChange, disabled,
}: { value: PaymentMethod; onChange: (m: PaymentMethod) => void; disabled?: boolean }) {
  return (
    <fieldset disabled={disabled}>
      <legend className="label">طريقة الدفع</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex min-h-[72px] cursor-pointer items-center justify-between rounded-2xl border-2 p-4 focus-within:outline focus-within:outline-[3px] focus-within:outline-turquoise ${
              value === m.value ? "border-ocean bg-ocean/5" : "border-sand bg-white"
            }`}
          >
            <input type="radio" name="payment" className="sr-only" checked={value === m.value} onChange={() => onChange(m.value)} />
            <span className="text-lg font-extrabold text-gulf">{m.label}</span>
            <span className="text-xs font-bold text-terracotta">{m.hint}</span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">ما نطلب رقم بطاقة ولا CVV ولا أي بيانات بنكية. هذا دفع تجريبي بدون خصم فعلي.</p>
    </fieldset>
  );
}