"use client";

import { useState, type FormEvent } from "react";

/**
 * OPTIONAL assignment stretch goal. Design demonstration only:
 * - not part of the main enrollment flow, no field here is required there;
 * - nothing is stored, sent or persisted (no localStorage, no network);
 * - passwords live only in component state, are never displayed, and are cleared on submit;
 * - prefilled values are obviously fictional. Do not type real health information.
 */
interface Parent { name: string; phone: string }

export function ExtendedRegistrationDemo() {
  const [mother, setMother] = useState<Parent>({ name: "أم تجريبية", phone: "" });
  const [father, setFather] = useState<Parent>({ name: "أب تجريبي", phone: "" });
  const [secondParent, setSecondParent] = useState(false);
  const [p2, setP2] = useState<Parent>({ name: "", phone: "" });
  const [child, setChild] = useState({ name: "طفل تجريبي", school: "مدرسة تجريبية", grade: "" });
  const [hasHealth, setHasHealth] = useState(false);
  const [health, setHealth] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("كلمة المرور لازم تكون 8 خانات على الأقل");
    if (password !== repeat) return setError("كلمتا المرور مو متطابقتين");
    setError(null);
    setPassword("");
    setRepeat("");
    setHealth("");
    setDone(true); // demonstration only: nothing is saved or sent
  }

  const field = (id: string, label: string, value: string, onChange: (v: string) => void, extra: Record<string, string> = {}) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} {...extra} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gulf">التسجيل الموسّع</h1>
        <p className="mt-2 rounded-2xl bg-sand/70 p-3 text-sm font-bold text-terracotta">
          ميزة اختيارية للتجربة فقط. ما تدخل في التسجيل الأساسي، وما يتحفظ ولا ينرسل أي شي. لا تكتب بيانات صحية أو كلمات مرور حقيقية.
        </p>
      </div>

      <section className="card space-y-4" aria-labelledby="sec-parent">
        <h2 id="sec-parent" className="text-xl font-extrabold text-gulf">1. بيانات ولي الأمر</h2>
        {field("mother-name", "اسم الأم", mother.name, (v) => setMother({ ...mother, name: v }))}
        {field("father-name", "اسم الأب", father.name, (v) => setFather({ ...father, name: v }))}
        {field("parent-phone", "رقم الموبايل (+965)", mother.phone, (v) => setMother({ ...mother, phone: v }), { inputMode: "numeric", dir: "ltr", placeholder: "XXXXXXXX" })}
        <label className="flex min-h-[48px] cursor-pointer items-center gap-3">
          <input type="checkbox" className="h-6 w-6 accent-[#087E83]" checked={secondParent} onChange={(e) => setSecondParent(e.target.checked)} />
          <span className="font-bold">أبي أضيف ولي أمر ثاني (اختياري)</span>
        </label>
        {secondParent && (
          <div className="space-y-4 rounded-2xl border-2 border-dashed border-turquoise p-4">
            {field("p2-name", "اسم ولي الأمر الثاني", p2.name, (v) => setP2({ ...p2, name: v }), { placeholder: "اسم تجريبي" })}
            {field("p2-phone", "رقم موبايل ولي الأمر الثاني", p2.phone, (v) => setP2({ ...p2, phone: v }), { inputMode: "numeric", dir: "ltr", placeholder: "XXXXXXXX" })}
          </div>
        )}
      </section>

      <section className="card space-y-4" aria-labelledby="sec-child">
        <h2 id="sec-child" className="text-xl font-extrabold text-gulf">2. بيانات الطفل</h2>
        {field("c-name", "اسم الطفل", child.name, (v) => setChild({ ...child, name: v }))}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("c-school", "المدرسة", child.school, (v) => setChild({ ...child, school: v }))}
          {field("c-grade", "الصف", child.grade, (v) => setChild({ ...child, grade: v }), { placeholder: "مثال: الرابع" })}
        </div>
        <label className="flex min-h-[48px] cursor-pointer items-center gap-3">
          <input type="checkbox" className="h-6 w-6 accent-[#087E83]" checked={hasHealth} onChange={(e) => setHasHealth(e.target.checked)} />
          <span className="font-bold">فيه حالة صحية لازم نعرفها؟ (اختياري)</span>
        </label>
        {hasHealth && (
          <div>
            <label htmlFor="health" className="label">الحالة الصحية (بيانات تجريبية فقط)</label>
            <textarea id="health" rows={3} className="input py-3" value={health} onChange={(e) => setHealth(e.target.value)} placeholder="نص تجريبي، لا تكتب معلومات حقيقية" />
          </div>
        )}
      </section>

      <section className="card space-y-4" aria-labelledby="sec-pass">
        <h2 id="sec-pass" className="text-xl font-extrabold text-gulf">3. كلمة المرور</h2>
        <div>
          <label htmlFor="pw" className="label">كلمة المرور</label>
          <input id="pw" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pw2" className="label">أعد كتابة كلمة المرور</label>
          <input id="pw2" type="password" autoComplete="new-password" className="input" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
        </div>
        <p className="text-sm text-muted">لو احتجنا حسابات فعلية، بتكون بمصادقة آمنة من جهة الخادم. هنا ما تتخزن كلمة المرور أبداً.</p>
        {error && <p role="alert" className="field-error">{error}</p>}
      </section>

      <button type="submit" className="min-h-[52px] w-full rounded-full bg-ocean px-8 text-lg font-bold text-white hover:bg-gulf sm:w-auto">
        تجربة الإرسال
      </button>
      {done && (
        <p role="status" className="rounded-2xl bg-turquoise/15 p-4 font-bold text-gulf">
          تمت التجربة. ما انحفظ ولا انرسل أي شي، وتم مسح كلمات المرور من الشاشة.
        </p>
      )}
    </form>
  );
}