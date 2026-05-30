import { format } from 'date-fns';

import type { EmergencyRotation, RotationType } from '@/src/types/emergency';

// 当番（休日当番医・歯科・薬局）の種別。night_emergency は固定カードで別表示。
const DUTY_TYPES: RotationType[] = ['duty_doctor', 'duty_dentist', 'duty_pharmacy'];

export function todayKey(at: Date = new Date()): string {
  return format(at, 'yyyy-MM-dd');
}

export function isWeekend(at: Date = new Date()): boolean {
  const day = at.getDay();
  return day === 0 || day === 6;
}

function isDuty(rotation: EmergencyRotation): boolean {
  return DUTY_TYPES.includes(rotation.rotation_type);
}

export function getRotationsForDate(
  rotations: EmergencyRotation[],
  dateKey: string,
): EmergencyRotation[] {
  return rotations.filter((r) => isDuty(r) && r.duty_date === dateKey);
}

// カレンダーのマーカー用：当番医データのある日付集合。
export function getDutyDateKeys(rotations: EmergencyRotation[]): Set<string> {
  const keys = new Set<string>();
  for (const r of rotations) {
    if (isDuty(r)) keys.add(r.duty_date);
  }
  return keys;
}

// 種別ごとに固定順でグループ化。空グループは含めない。
export function groupByType(
  rotations: EmergencyRotation[],
): { type: RotationType; items: EmergencyRotation[] }[] {
  return DUTY_TYPES.map((type) => ({
    type,
    items: rotations.filter((r) => r.rotation_type === type),
  })).filter((group) => group.items.length > 0);
}
