import { z } from "zod";
import { PROGRAM } from "@/config/program";
import { DEMO_PERIODS, isShiftAvailable, type ProgramPeriod } from "@/data/periods";
import { normalizeDigits } from "@/lib/digits";

export const MESSAGES = {
  nameRequired: "اكتب اسم الطفل",
  nameTooLong: "الاسم طويل، اختصره شوي",
  ageRequired: "اكتب عمر الطفل",
  ageWhole: "العمر لازم يكون رقم صحيح",
  ageRange: `عذراً، البرنامج للأعمار من ${PROGRAM.minAge} إلى ${PROGRAM.maxAge} سنة فقط`,
  ageNotConfirmed: "أكّد الفئة العمرية والمسبح عشان نكمل",
  periodRequired: "اختار الدورة اللي تناسبكم",
  periodUnavailable: "هالدورة مكتملة العدد، اختار دورة ثانية",
  shiftRequired: "اختار الفترة اليومية (صباح، بعد الظهر أو مساء)",
  shiftUnavailable: "هالفترة اليومية مكتملة في هالدورة، اختار فترة ثانية",
} as const;

export interface ChildInput {
  name: string;
  age: string;
  periodId: string;
  shiftId: string;
  /** The parent confirmed the automatically assigned age group and pool */
  ageConfirmed: boolean;
}

export interface ChildData {
  name: string;
  age: number;
  periodId: string;
  shiftId: string;
}

export type ChildErrors = Partial<Record<keyof ChildInput, string>>;

function childSchema(periods: readonly ProgramPeriod[]) {
  return z
    .object({
      name: z.string().trim().min(1, MESSAGES.nameRequired).max(60, MESSAGES.nameTooLong),
      age: z
        .string()
        .trim()
        .min(1, MESSAGES.ageRequired)
        .regex(/^\d+$/, MESSAGES.ageWhole)
        .refine((v) => Number(v) >= PROGRAM.minAge && Number(v) <= PROGRAM.maxAge, MESSAGES.ageRange),
      ageConfirmed: z.boolean(),
      periodId: z
        .string()
        .min(1, MESSAGES.periodRequired)
        .refine((id) => periods.find((p) => p.id === id)?.status === "available", MESSAGES.periodUnavailable),
      shiftId: z.string().min(1, MESSAGES.shiftRequired),
    })
    .superRefine((v, ctx) => {
      if (v.shiftId && v.periodId && periods.find((p) => p.id === v.periodId)?.status === "available") {
        if (!isShiftAvailable(v.periodId, v.shiftId, periods)) {
          ctx.addIssue({ code: "custom", path: ["shiftId"], message: MESSAGES.shiftUnavailable });
        }
      }
      if (!v.ageConfirmed && /^\d+$/.test(v.age) && Number(v.age) >= PROGRAM.minAge && Number(v.age) <= PROGRAM.maxAge) {
        ctx.addIssue({ code: "custom", path: ["ageConfirmed"], message: MESSAGES.ageNotConfirmed });
      }
    });
}

export function validateChild(
  input: ChildInput,
  periods: readonly ProgramPeriod[] = DEMO_PERIODS,
): { success: true; data: ChildData } | { success: false; errors: ChildErrors } {
  const result = childSchema(periods).safeParse({ ...input, age: normalizeDigits(input.age) });
  if (result.success) {
    const d = result.data;
    return { success: true, data: { name: d.name, age: Number(d.age), periodId: d.periodId, shiftId: d.shiftId } };
  }
  const errors: ChildErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ChildInput;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}