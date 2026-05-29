// Workers 不通・タイムアウト時のアプリ内ルールベース緊急度判定。
// workers/src/fallback-urgency.ts の移植。症状値はアンケート
// （src/constants/symptom-options.ts）のカノニカル値に合わせている。
import type { UrgencyLevel } from '@/src/types/ai';

const EMERGENCY_SYMPTOMS = ['息苦しい', 'めまい'];
const SOON_SYMPTOMS = ['熱', '痛い'];

export function fallbackUrgency(symptoms: string[]): UrgencyLevel {
  if (symptoms.some((s) => EMERGENCY_SYMPTOMS.includes(s))) return 'emergency';
  if (symptoms.some((s) => SOON_SYMPTOMS.includes(s))) return 'soon';
  return 'watch';
}
