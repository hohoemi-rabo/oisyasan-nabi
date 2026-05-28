// Mirror of workers/src/schemas.ts inferred types.
// Keep this file in sync when the worker schema changes.

export type UrgencyLevel = 'emergency' | 'soon' | 'watch';

export type AIRecommendRequest = {
  location: string[];
  duration: string | null;
  symptoms: string[];
  lumpSize?: string | null;
  conditions: string[];
  medicine: boolean | string | null;
  memo: string;
  profile?: {
    ageGroup?: string;
    area?: string;
    mobilityAid?: string;
  };
  followUpAnswers: { question_id: string; question_text: string; answer: string }[] | null;
};

export type AIRecommendResponse = {
  urgency: UrgencyLevel;
  urgency_reason: string;
  recommended_departments: string[];
  department_reason: string;
  advice: string;
  disclaimer: string;
  source: 'ai' | 'fallback';
};

export type FollowUpQuestion = {
  id: string;
  text: string;
  type: 'select' | 'text';
  options?: string[];
};

export type FollowUpRequest = {
  questionnaire: {
    location?: string[];
    duration?: string | null;
    symptoms?: string[];
    conditions?: string[];
  };
  ai_result?: {
    urgency?: UrgencyLevel;
    recommended_departments?: string[];
  };
};

export type FollowUpResponse = {
  questions: FollowUpQuestion[];
};
