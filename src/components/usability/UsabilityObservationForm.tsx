"use client";

import { useState } from "react";

/**
 * Observer-facing form for the stranger usability test (CODED assignment, Part 3).
 * The observer (not the tester) fills it in. Nothing is stored or sent: use "copy"
 * and paste the text into your report. No results are pre-filled.
 */
const TASK = "Enroll your two children for the summer swimming season.";

interface Form {
  testerCode: string;
  device: string;
  completed: "" | "yes" | "no" | "partly";
  hesitations: string;
  confusingLabels: string;
  wrongTaps: string;
  navigation: string;
  comments: string;
  timeMinutes: string;
}

const EMPTY: Form = {
  testerCode: "", device: "", completed: "", hesitations: "", confusingLabels: "",
  wrongTaps: "", navigation: "", comments: "", timeMinutes: "",
};

export function UsabilityObservationForm() {
  const [f, setF] = useState<Form>(EMPTY);
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));

  const report = [
    "# Usability observation",
    `Task attempted: ${TASK}`,
    `Tester (code or first name only): ${f.testerCode}`,
    `Device / one-handed phone use: ${f.device}`,
    `Completed the booking: ${f.completed}`,
    `Time taken (minutes): ${f.timeMinutes}`,
    `Where the tester hesitated:\n${f.hesitations}`,
    `Confusing buttons or labels:\n${f.confusingLabels}`,
    `Wrong taps (count and where):\n${f.wrongTaps}`,
    `Navigation difficulties:\n${f.navigation}`,
    `Comments spoken by the tester (verbatim):\n${f.comments}`,
  ].join("\n\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const area = (k: keyof Form, label: string, hint: string) => (
    <div>
      <label htmlFor={k} className="label">{label}</label>
      <textarea id={k} rows={3} className="input py-3" placeholder={hint} value={f[k]} onChange={(e) => set(k, e.target.value)} dir="auto" />
    </div>
  );

  return (
    <form className="card space-y-5" onSubmit={(e) => e.preventDefault()} dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-gulf">Usability test observation form</h1>
        <p className="mt-1 text-sm text-muted">للمراقب: عبّي النموذج أثناء الاختبار. لا تساعد الشخص ولا تشرح الشاشات. ما يحفظ هالنموذج شي.</p>
      </div>
      <div className="rounded-2xl bg-sand/70 p-4">
        <p className="text-sm font-bold text-muted">Task given to the tester (read it aloud, nothing more)</p>
        <p className="font-extrabold text-gulf" dir="ltr">&ldquo;{TASK}&rdquo;</p>
        <p className="mt-1 text-xs text-muted">Start at the home page. Observer notes only what happens.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="testerCode" className="label">Tester code or first name</label>
          <input id="testerCode" className="input" value={f.testerCode} onChange={(e) => set("testerCode", e.target.value)} />
        </div>
        <div>
          <label htmlFor="device" className="label">Device and how held</label>
          <input id="device" className="input" placeholder="e.g. phone, one hand" value={f.device} onChange={(e) => set("device", e.target.value)} />
        </div>
      </div>
      <fieldset>
        <legend className="label">Did the tester complete the booking?</legend>
        <div className="grid grid-cols-3 gap-3">
          {(["yes", "partly", "no"] as const).map((v) => (
            <label key={v} className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-2xl border-2 font-bold ${f.completed === v ? "border-ocean bg-ocean/5 text-gulf" : "border-sand"}`}>
              <input type="radio" name="completed" className="sr-only" checked={f.completed === v} onChange={() => set("completed", v)} />
              {v === "yes" ? "Yes" : v === "no" ? "No" : "Partly"}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="timeMinutes" className="label">Time taken (minutes)</label>
        <input id="timeMinutes" inputMode="decimal" className="input max-w-[160px]" value={f.timeMinutes} onChange={(e) => set("timeMinutes", e.target.value)} />
      </div>
      {area("hesitations", "Where did the tester hesitate?", "Screen / step, what they looked at, how long")}
      {area("confusingLabels", "Confusing buttons or labels", "Quote the label")}
      {area("wrongTaps", "Wrong taps", "How many, and what they tapped instead")}
      {area("navigation", "Navigation difficulties", "Lost, went back, could not find next step")}
      {area("comments", "Comments spoken by the tester", "Exact words, in their language")}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copy} className="min-h-[52px] rounded-full bg-ocean px-8 text-lg font-bold text-white hover:bg-gulf">
          {copied ? "Copied ✓" : "Copy as text"}
        </button>
        <button type="button" onClick={() => setF(EMPTY)} className="min-h-[52px] rounded-full border-2 border-terracotta px-8 font-bold text-terracotta">
          Clear form
        </button>
      </div>
    </form>
  );
}