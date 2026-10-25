const fmt = new Intl.DateTimeFormat("ar-KW-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return fmt.format(new Date(`${iso}T00:00:00Z`));
}

export function formatRange(startIso: string, endIso: string): string {
  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}