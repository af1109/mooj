"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PROGRAM } from "@/config/program";
import { findPeriod, findSeason, periodsForSeason, type ShiftId } from "@/data/periods";
import { normalizeDigits } from "@/lib/digits";
import { getAgeGroup } from "@/features/registration/rules";
import { validateChild, type ChildErrors, type ChildInput } from "@/features/registration/schema";
import { useCart } from "@/features/cart/cart-store";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DemoBadge } from "@/components/ui/Decor";
import { DiscountPromo } from "@/components/cart/DiscountPromo";
import { PoolAssignmentDisplay } from "./PoolAssignmentDisplay";
import { ProgramPeriodCard } from "./ProgramPeriodCard";
import { ShiftOptionCard } from "./ShiftOptionCard";

const EMPTY: ChildInput = { name: "", age: "", periodId: "", shiftId: "", ageConfirmed: false };

export function ChildRegistrationForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const { items, pricing, hydrated, addItem, updateItem } = useCart();
  const [values, setValues] = useState<ChildInput>(EMPTY);
  const [errors, setErrors] = useState<ChildErrors>({});
  const [added, setAdded] = useState<string | null>(null);
  const loadedFor = useRef<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const editing = editId ? items.find((i) => i.id === editId) : undefined;
  const seasonId = (editing && findPeriod(editing.periodId)?.seasonId) || params.get("season") || "";
  const season = findSeason(seasonId);

  // Registration needs a season: send the parent to pick one first.
  useEffect(() => {
    if (hydrated && !editId && (!season || season.status !== "open")) router.replace("/seasons");
  }, [hydrated, editId, season, router]);

  // Prefill when editing (once the stored cart has been read)
  useEffect(() => {
    if (hydrated && editing && loadedFor.current !== editing.id) {
      loadedFor.current = editing.id;
      setValues({ name: editing.name, age: String(editing.age), periodId: editing.periodId, shiftId: editing.shiftId, ageConfirmed: true });
    }
  }, [hydrated, editing]);

  const normalizedAge = normalizeDigits(values.age.trim());
  const group = /^\d+$/.test(normalizedAge) ? getAgeGroup(Number(normalizedAge)) : undefined;
  const periods = periodsForSeason(seasonId);
  const selectedPeriod = findPeriod(values.periodId);

  function set<K extends keyof ChildInput>(key: K, value: ChildInput[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      // A changed age means the previous age-group confirmation no longer applies
      if (key === "age") next.ageConfirmed = false;
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined, ...(key === "age" ? { ageConfirmed: undefined } : {}) }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validateChild(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    if (editing) {
      updateItem({ ...result.data, id: editing.id });
      router.push("/cart");
      return;
    }
    addItem(result.data);
    setAdded(result.data.name);
  }

  function addAnother() {
    // Keep the chosen course and shift: siblings usually share them. Still editable.
    setValues({ ...EMPTY, periodId: values.periodId, shiftId: values.shiftId });
    setErrors({});
    setAdded(null);
    setTimeout(() => nameRef.current?.focus(), 0);
  }

  if (added) {
    return (
      <div className="space-y-4">
        <div className="card text-center" role="status">
          <p className="text-5xl" aria-hidden>🎉</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gulf">انضاف {added} للسلة!</h2>
          <p className="mt-1 text-muted">تقدر تضيف طفل ثاني (مو لازم يكونون أقارب) أو تروح للسلة.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton onClick={addAnother}>أضف طفل ثاني</PrimaryButton>
            <PrimaryButton href="/cart" variant="secondary">عرض السلة</PrimaryButton>
          </div>
        </div>
        <DiscountPromo childCount={pricing.childCount} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gulf">{editing ? "تعديل بيانات الطفل" : "بيانات الطفل"}</h2>
        {season && (
          <p className="mt-1 text-sm text-muted">
            الموسم: <b className="text-gulf">{season.nameAr}</b>{" "}
            {!editing && <Link href="/seasons" className="font-bold text-ocean underline">تغيير</Link>}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="child-name" className="label">اسم الطفل</label>
        <input
          ref={nameRef}
          id="child-name"
          className={`input ${errors.name ? "input-error" : ""}`}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="off"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "child-name-error" : undefined}
        />
        {errors.name && <p id="child-name-error" className="field-error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="child-age" className="label">عمر الطفل (6 – 17 سنة)</label>
        <input
          id="child-age"
          inputMode="numeric"
          className={`input max-w-[180px] ${errors.age ? "input-error" : ""}`}
          value={values.age}
          onChange={(e) => set("age", e.target.value)}
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? "child-age-error" : undefined}
        />
        {errors.age && <p id="child-age-error" className="field-error">{errors.age}</p>}
      </div>

      <div className="space-y-3">
        <PoolAssignmentDisplay group={group} />
        {group && (
          <div>
            <label htmlFor="age-confirm" className="flex min-h-[48px] cursor-pointer items-start gap-3">
              <input
                id="age-confirm"
                type="checkbox"
                className="mt-1 h-6 w-6 shrink-0 accent-[#087E83]"
                checked={values.ageConfirmed}
                onChange={(e) => set("ageConfirmed", e.target.checked)}
                aria-describedby={errors.ageConfirmed ? "age-confirm-error" : undefined}
              />
              <span className="text-sm font-bold text-gulf">
                أؤكد إن الطفل ({normalizedAge} سنة) ضمن الفئة {group.label} ومسبحه رقم {group.pool}
              </span>
            </label>
            {errors.ageConfirmed && <p id="age-confirm-error" className="field-error">{errors.ageConfirmed}</p>}
          </div>
        )}
      </div>

      <fieldset>
        <legend className="label">اختار الدورة (14 يوم)</legend>
        <div className="mb-3"><DemoBadge>الدورات والتوفر تجريبية</DemoBadge></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {periods.map((p) => (
            <ProgramPeriodCard
              key={p.id}
              period={p}
              selected={values.periodId === p.id}
              onSelect={(id) => set("periodId", id)}
              describedBy={errors.periodId ? "child-period-error" : undefined}
            />
          ))}
        </div>
        {errors.periodId && <p id="child-period-error" className="field-error" role="alert">{errors.periodId}</p>}
      </fieldset>

      <fieldset>
        <legend className="label">اختار فترة وحدة تداوم فيها كل يوم</legend>
        <div className="grid grid-cols-3 gap-3">
          {PROGRAM.shifts.map((s) => (
            <ShiftOptionCard
              key={s.id}
              id={s.id}
              label={s.label}
              hours={s.hours}
              status={selectedPeriod ? selectedPeriod.shifts[s.id as ShiftId] : "available"}
              selected={values.shiftId === s.id}
              onSelect={(id) => set("shiftId", id)}
              describedBy={errors.shiftId ? "child-shift-error" : undefined}
            />
          ))}
        </div>
        {errors.shiftId && <p id="child-shift-error" className="field-error" role="alert">{errors.shiftId}</p>}
        <p className="mt-2 text-sm text-muted">كل فترة ساعتين، والطفل يداوم في فترة وحدة بس طول الـ 14 يوم.</p>
      </fieldset>

      <DiscountPromo childCount={pricing.childCount} />

      <button
        type="submit"
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-ocean px-8 text-lg font-bold text-white hover:bg-gulf sm:w-auto"
      >
        {editing ? "حفظ التعديل" : "أضف للسلة"}
      </button>
    </form>
  );
}