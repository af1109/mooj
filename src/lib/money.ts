/** Format integer fils as a KWD string, e.g. 120000 -> "120 د.ك", 216500 -> "216.500 د.ك". */
export function formatKwd(fils: number): string {
  const whole = Math.trunc(fils / 1000);
  const rest = Math.abs(fils % 1000);
  const text = rest === 0 ? String(whole) : `${whole}.${String(rest).padStart(3, "0")}`;
  return `${text} د.ك`;
}