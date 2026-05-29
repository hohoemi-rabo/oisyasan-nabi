import { isCurrentlyOpen } from '@/src/lib/is-currently-open';
import type { UrgencyLevel } from '@/src/types/ai';
import type { Hospital } from '@/src/types/hospital';

// REQUIREMENTS §3.3.3 のスコアリング（Web 版 hospitalScoring.ts 相当）。
const SCORE_DEPARTMENT_MATCH = 100;
const SCORE_FAVORITE = 50;
const SCORE_EMERGENCY = 40;
const SCORE_OPEN_NOW = 30;

/**
 * 推奨診療科に一致する病院だけを抽出し、加点してスコア降順で返す。
 * - 推奨診療科に一致: +100
 * - かかりつけ医に登録済み: +50
 * - 救急対応（urgency === 'emergency' の時のみ）: +40
 * - 現在営業中: +30
 */
export function scoreHospitals(
  hospitals: Hospital[],
  recommendedDepartments: string[],
  favoriteIds: Set<string>,
  urgency: UrgencyLevel,
  at: Date = new Date(),
): Hospital[] {
  const recommended = new Set(recommendedDepartments);

  return hospitals
    .filter((h) => h.category.some((c) => recommended.has(c)))
    .map((hospital) => {
      let score = SCORE_DEPARTMENT_MATCH;
      if (favoriteIds.has(hospital.id)) score += SCORE_FAVORITE;
      if (urgency === 'emergency' && hospital.emergency_available) score += SCORE_EMERGENCY;
      if (isCurrentlyOpen(hospital, at)) score += SCORE_OPEN_NOW;
      return { hospital, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((scored) => scored.hospital);
}
