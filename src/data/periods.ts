import { PROGRAM } from "@/config/program";

/**
 * DEMONSTRATION DATA ONLY.
 * Real seasons, dates and capacities have not been provided. Everything here is
 * sample data and is not confirmed availability.
 */
export type PeriodStatus = "available" | "full";
export type ShiftId = (typeof PROGRAM.shifts)[number]["id"];

export interface Season {
  id: string;
  nameAr: string;
  description: string;
  /** "open" seasons can be booked; "soon" seasons are listed but disabled. */
  status: "open" | "soon";
}

export interface ProgramPeriod {
  id: string;
  seasonId: string;
  /** ISO date (YYYY-MM-DD), inclusive */
  startDate: string;
  /** ISO date (YYYY-MM-DD), inclusive */
  endDate: string;
  status: PeriodStatus;
  /** Availability of each daily shift inside this period (demo). */
  shifts: Record<ShiftId, PeriodStatus>;
}

/** Add more seasons here later; periods link to a season by `seasonId`. */
export const SEASONS: readonly Season[] = [
  { id: "summer", nameAr: "الصيف", description: "14 يوم من السباحة والوناسة في أجواء الصيف الكويتي.", status: "open" },
  { id: "winter", nameAr: "الشتاء", description: "موسم الشتاء، قريباً.", status: "soon" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** End date of a 14-day period counting the start date as day 1. */
export function endDateFor(startIso: string): string {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  return new Date(start + (PROGRAM.durationDays - 1) * DAY_MS).toISOString().slice(0, 10);
}

const ALL_OPEN: Record<ShiftId, PeriodStatus> = { morning: "available", afternoon: "available", evening: "available" };

function period(
  id: string,
  startDate: string,
  status: PeriodStatus,
  shifts: Partial<Record<ShiftId, PeriodStatus>> = {},
  seasonId = "summer",
): ProgramPeriod {
  const base = status === "full" ? { morning: "full", afternoon: "full", evening: "full" } : ALL_OPEN;
  return { id, seasonId, startDate, endDate: endDateFor(startDate), status, shifts: { ...(base as Record<ShiftId, PeriodStatus>), ...shifts } };
}

export const DEMO_PERIODS: readonly ProgramPeriod[] = [
  period("p1", "2027-06-13", "available"),
  period("p2", "2027-06-27", "full"),
  period("p3", "2027-07-11", "available", { evening: "full" }),
  period("p4", "2027-07-25", "available"),
  period("p5", "2027-08-08", "available", { morning: "full" }),
];

export function findPeriod(id: string, periods: readonly ProgramPeriod[] = DEMO_PERIODS) {
  return periods.find((p) => p.id === id);
}

export function findSeason(id: string) {
  return SEASONS.find((s) => s.id === id);
}

export function periodsForSeason(seasonId: string, periods: readonly ProgramPeriod[] = DEMO_PERIODS) {
  return periods.filter((p) => p.seasonId === seasonId);
}

export function findShift(id: string) {
  return PROGRAM.shifts.find((s) => s.id === id);
}

/** A shift can be booked only when its period is open and the shift itself is open. */
export function isShiftAvailable(periodId: string, shiftId: string, periods: readonly ProgramPeriod[] = DEMO_PERIODS) {
  const p = findPeriod(periodId, periods);
  return Boolean(p && p.status === "available" && p.shifts[shiftId as ShiftId] === "available");
}