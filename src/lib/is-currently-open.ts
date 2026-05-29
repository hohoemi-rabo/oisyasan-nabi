import type { Hospital } from '@/src/types/hospital';

function toMinutes(value: string | null): number | null {
  if (!value) return null;
  const [h, m] = value.split(':').map((p) => parseInt(p, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function inRange(now: number, start: string | null, end: string | null): boolean {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === null || e === null) return false;
  if (s === 0 && e === 0) return false;
  return now >= s && now < e;
}

export function isCurrentlyOpen(hospital: Hospital, at: Date = new Date()): boolean {
  if (!hospital.schedules || hospital.schedules.length === 0) return false;
  const today = hospital.schedules.find((s) => s.day_of_week === at.getDay());
  if (!today || today.is_closed) return false;
  const now = at.getHours() * 60 + at.getMinutes();
  return (
    inRange(now, today.morning_start, today.morning_end) ||
    inRange(now, today.afternoon_start, today.afternoon_end)
  );
}
