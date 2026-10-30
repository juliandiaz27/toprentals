/** «hoy 14:32», «ayer 09:10» o «28 oct, 18:05» (hora de Buenos Aires). */
export function formatAuditDate(iso: string, now = new Date()): string {
  const tz = "America/Argentina/Buenos_Aires";
  const date = new Date(iso);
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);
  const time = new Intl.DateTimeFormat("es-AR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (day(date) === day(now)) return `hoy ${time}`;
  if (day(date) === day(yesterday)) return `ayer ${time}`;
  const label = new Intl.DateTimeFormat("es-AR", {
    timeZone: tz,
    day: "numeric",
    month: "short",
  }).format(date);
  return `${label}, ${time}`;
}
