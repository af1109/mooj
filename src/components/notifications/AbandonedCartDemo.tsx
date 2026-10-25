"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/features/cart/cart-store";
import { abandonedCartEligibility, planAbandonedCartReminder } from "@/features/messaging/notification-service";
import { NotificationPreview } from "./NotificationPreview";
import { PhoneNumberInput } from "@/components/checkout/PhoneNumberInput";
import type { Channel } from "@/types";

/**
 * Interactive demonstration of the reminder rules. It sends nothing.
 * Production reminders need a backend scheduler; browser timers are not reliable.
 */
export function AbandonedCartDemo() {
  const { items, contact } = useCart();
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("both");
  const [consent, setConsent] = useState(false);
  const [paid, setPaid] = useState(false);
  const [count, setCount] = useState(1);
  const [variant, setVariant] = useState(0);

  const input = { phone, channel, consentReminders: consent, childCount: count, paid };
  const eligibility = useMemo(() => abandonedCartEligibility(input), [phone, channel, consent, paid, count]);
  const messages = useMemo(() => planAbandonedCartReminder(input, "demo-cart", variant), [phone, channel, consent, paid, count, variant]);

  function loadFromCart() {
    setPhone(contact.phone);
    setChannel(contact.channel);
    setConsent(contact.consentReminders);
    setCount(items.length);
    setPaid(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gulf">معاينة تذكير السلة غير المكتملة</h1>
        <p className="mt-2 text-muted">
          معاينة تجريبية فقط، ما ينرسل شي فعلياً. التذكير الحقيقي يحتاج خدمة جدولة في الخادم.
        </p>
      </div>

      <div className="card space-y-5">
        <PrimaryButton2 onClick={loadFromCart} />
        <PhoneNumberInput value={phone} onChange={setPhone} />
        <div>
          <label htmlFor="demo-count" className="label">عدد الأطفال في السلة</label>
          <input id="demo-count" type="number" min={0} max={9} className="input max-w-[140px]" value={count} onChange={(e) => setCount(Number(e.target.value) || 0)} />
        </div>
        <div>
          <label htmlFor="demo-channel" className="label">القناة</label>
          <select id="demo-channel" className="input" value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
            <option value="sms">رسالة نصية SMS</option>
            <option value="whatsapp">واتساب</option>
            <option value="both">الاثنين</option>
          </select>
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-6 w-6 accent-[#087E83]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span className="text-sm">العميل وافق صراحةً على التذكيرات الاختيارية</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-6 w-6 accent-[#087E83]" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
          <span className="text-sm">الحجز اكتمل ودفع (تجريبي)</span>
        </label>
      </div>

      <div className="card space-y-4" aria-live="polite">
        <h2 className="text-xl font-extrabold text-gulf">النتيجة</h2>
        {eligibility.eligible ? (
          <>
            <p className="font-bold text-ocean">مؤهل لاستلام تذكير.</p>
            <button type="button" className="min-h-[44px] rounded-full border-2 border-ocean px-5 font-bold text-ocean" onClick={() => setVariant((v) => v + 1)}>
              صيغة ثانية
            </button>
            {messages.map((m) => <NotificationPreview key={m.eventId} message={m} />)}
          </>
        ) : (
          <>
            <p className="font-bold text-terracotta">ما راح ينرسل تذكير:</p>
            <ul className="list-disc ps-5 text-sm">
              {eligibility.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function PrimaryButton2({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-[44px] rounded-full border-2 border-ocean px-5 font-bold text-ocean hover:bg-ocean hover:text-white">
      عبّي من سلتي الحالية
    </button>
  );
}