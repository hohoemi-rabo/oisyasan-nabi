// Returns "HH:MM" from a Postgres time string ("HH:MM:SS"). "00:00" / null is normalised
// to an empty string so callers can render a single "休診"/"−" placeholder instead.
export function formatTime(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.slice(0, 5);
  if (trimmed === '00:00') return '';
  return trimmed;
}

export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const s = formatTime(start);
  const e = formatTime(end);
  if (!s || !e) return '';
  return `${s} – ${e}`;
}
