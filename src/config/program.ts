export const ACADEMY = {
  nameEn: "Moja Swim Academy",
  nameAr: "أكاديمية موجة للسباحة",
  country: "الكويت",
} as const;

export const PROGRAM = {
  durationDays: 14,
  /** Prices are integer fils (1 KWD = 1000 fils) to avoid floating-point errors. */
  pricePerChildFils: 120_000,
  minAge: 6,
  maxAge: 17,
  /** Three daily shifts exist; each child picks ONE of them. */
  shiftCount: 3,
  shiftHours: 2,
  shifts: [
    { id: "morning", label: "الفترة الصباحية", hours: 2 },
    { id: "afternoon", label: "فترة بعد الظهر", hours: 2 },
    { id: "evening", label: "الفترة المسائية", hours: 2 },
  ],
} as const;

export const DAILY_HOURS = PROGRAM.shiftCount * PROGRAM.shiftHours;

export type PoolNumber = 1 | 2 | 3 | 4;

export interface AgeGroup {
  id: string;
  minAge: number;
  maxAge: number;
  pool: PoolNumber;
  label: string;
}

/** Exactly four age groups, each with its own exclusive pool. */
export const AGE_GROUPS: readonly AgeGroup[] = [
  { id: "g1", minAge: 6, maxAge: 8, pool: 1, label: "6–8 سنة" },
  { id: "g2", minAge: 9, maxAge: 11, pool: 2, label: "9–11 سنة" },
  { id: "g3", minAge: 12, maxAge: 14, pool: 3, label: "12–14 سنة" },
  { id: "g4", minAge: 15, maxAge: 17, pool: 4, label: "15–17 سنة" },
];

/** Discount tiers by number of children in one cart / one transaction. */
export const DISCOUNT_TIERS = [
  { minChildren: 3, percent: 15 },
  { minChildren: 2, percent: 10 },
] as const;

export const GROUP_DISCOUNT_LABEL = "خصم التسجيل الجماعي";