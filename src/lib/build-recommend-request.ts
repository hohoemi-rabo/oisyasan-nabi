import type { AIRecommendRequest } from '@/src/types/ai';
import type { Profile } from '@/src/stores/profile-store';
import type { QuestionnaireDraft } from '@/src/stores/questionnaire-store';

// アンケート下書き + プロフィールを Workers の /api/ai-recommend ペイロードへ整形する。
export function buildRecommendRequest(
  draft: QuestionnaireDraft,
  profile: Profile,
): AIRecommendRequest {
  return {
    location: draft.location,
    duration: draft.duration,
    symptoms: draft.symptoms,
    lumpSize: draft.lumpSize,
    conditions: draft.conditions,
    medicine: draft.medicine,
    memo: draft.memo,
    profile: {
      ageGroup: profile.ageGroup ?? undefined,
      area: profile.residentialArea ?? undefined,
      mobilityAid: profile.mobilityAid ?? undefined,
    },
    followUpAnswers: null,
  };
}
