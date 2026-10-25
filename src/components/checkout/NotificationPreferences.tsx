import type { Channel, ContactData } from "@/types";

interface Props {
  contact: ContactData;
  errors: { consentBooking?: string; consentWhatsApp?: string };
  onChange: (patch: Partial<ContactData>) => void;
}

const OPTIONS: { value: Channel; label: string }[] = [
  { value: "sms", label: "رسالة نصية SMS" },
  { value: "whatsapp", label: "واتساب" },
  { value: "both", label: "الاثنين" },
];

export function NotificationPreferences({ contact, errors, onChange }: Props) {
  const needsWhatsApp = contact.channel === "whatsapp" || contact.channel === "both";
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="label">وين نرسل لك تفاصيل الحجز؟</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`flex min-h-[52px] cursor-pointer items-center justify-center rounded-2xl border-2 px-4 text-center font-bold focus-within:outline focus-within:outline-[3px] focus-within:outline-turquoise ${
                contact.channel === o.value ? "border-ocean bg-ocean/5 text-gulf" : "border-sand bg-white text-muted"
              }`}
            >
              <input
                type="radio"
                name="channel"
                className="sr-only"
                checked={contact.channel === o.value}
                onChange={() => onChange({ channel: o.value })}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <Check
          id="consent-booking"
          checked={contact.consentBooking}
          onChange={(v) => onChange({ consentBooking: v })}
          error={errors.consentBooking}
        >
          أوافق على استلام رسائل الحجز (تأكيد الحجز والتحديثات المهمة المتعلقة به) على الرقم أعلاه.
        </Check>
        {needsWhatsApp && (
          <Check
            id="consent-whatsapp"
            checked={contact.consentWhatsApp}
            onChange={(v) => onChange({ consentWhatsApp: v })}
            error={errors.consentWhatsApp}
          >
            أوافق على التواصل معي عبر واتساب على هالرقم.
          </Check>
        )}
        <Check
          id="consent-reminders"
          checked={contact.consentReminders}
          onChange={(v) => onChange({ consentReminders: v })}
        >
          (اختياري) أبي تذكيرات قبل بداية البرنامج وتذكير لو خليت السلة بدون دفع. تقدر توقفها في أي وقت.
        </Check>
      </div>
    </div>
  );
}

function Check({
  id, checked, onChange, error, children,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[#087E83]"
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className="text-sm leading-relaxed">{children}</span>
      </label>
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}