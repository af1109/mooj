import { KUWAIT_COUNTRY_CODE } from "@/lib/phone";

interface Props {
  value: string;
  error?: string;
  onChange: (v: string) => void;
}

export function PhoneNumberInput({ value, error, onChange }: Props) {
  return (
    <div>
      <label htmlFor="phone" className="label">رقم الموبايل الكويتي</label>
      <div className="flex gap-2" dir="ltr">
        <span className="flex min-h-[48px] items-center rounded-xl bg-sand px-4 font-bold text-gulf">{KUWAIT_COUNTRY_CODE}</span>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={12}
          placeholder="XXXXXXXX"
          className={`input ${error ? "input-error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "phone-error" : "phone-hint"}
        />
      </div>
      {error ? <p id="phone-error" className="field-error" role="alert">{error}</p> : <p id="phone-hint" className="mt-1.5 text-sm text-muted">8 أرقام. نستخدمه فقط للتواصل بخصوص الحجز.</p>}
    </div>
  );
}