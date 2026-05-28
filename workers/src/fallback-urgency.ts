import type { UrgencyLevel } from './schemas';

const EMERGENCY_SYMPTOMS = ['息苦しい', 'めまいがする'];
const SOON_SYMPTOMS = ['熱がある', '痛い'];

export function fallbackUrgency(symptoms: string[]): UrgencyLevel {
  if (symptoms.some((s) => EMERGENCY_SYMPTOMS.includes(s))) return 'emergency';
  if (symptoms.some((s) => SOON_SYMPTOMS.includes(s))) return 'soon';
  return 'watch';
}
