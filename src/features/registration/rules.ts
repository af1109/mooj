import { AGE_GROUPS, PROGRAM, type AgeGroup } from "@/config/program";

export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= PROGRAM.minAge && age <= PROGRAM.maxAge;
}

/** Age group (and therefore pool) for an age, or undefined when outside 6–17. */
export function getAgeGroup(age: number): AgeGroup | undefined {
  if (!isValidAge(age)) return undefined;
  return AGE_GROUPS.find((g) => age >= g.minAge && age <= g.maxAge);
}

export function getPool(age: number): number | undefined {
  return getAgeGroup(age)?.pool;
}