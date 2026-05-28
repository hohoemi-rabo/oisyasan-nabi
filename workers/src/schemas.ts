import { z } from 'zod';

export const urgencyLevelSchema = z.enum(['emergency', 'soon', 'watch']);
export type UrgencyLevel = z.infer<typeof urgencyLevelSchema>;

export const aiRecommendRequestSchema = z.object({
  location: z.array(z.string()).min(1, '部位が選択されていません'),
  duration: z.string().nullable(),
  symptoms: z.array(z.string()).default([]),
  lumpSize: z.string().nullable().optional(),
  conditions: z.array(z.string()).default([]),
  medicine: z.union([z.boolean(), z.string(), z.null()]).default(null),
  memo: z.string().default(''),
  profile: z
    .object({
      ageGroup: z.string().optional(),
      area: z.string().optional(),
      mobilityAid: z.string().optional(),
    })
    .partial()
    .default({}),
  followUpAnswers: z
    .array(
      z.object({
        question_id: z.string(),
        question_text: z.string(),
        answer: z.string(),
      }),
    )
    .nullable()
    .default(null),
});

export type AIRecommendRequest = z.infer<typeof aiRecommendRequestSchema>;

export const aiRecommendCoreSchema = z.object({
  urgency: urgencyLevelSchema,
  urgency_reason: z.string(),
  recommended_departments: z.array(z.string()),
  department_reason: z.string(),
  advice: z.string(),
  disclaimer: z.string(),
});

export const aiRecommendResponseSchema = aiRecommendCoreSchema.extend({
  source: z.enum(['ai', 'fallback']),
});

export type AIRecommendResponse = z.infer<typeof aiRecommendResponseSchema>;

export const followUpRequestSchema = z.object({
  questionnaire: z
    .object({
      location: z.array(z.string()).optional(),
      duration: z.string().nullable().optional(),
      symptoms: z.array(z.string()).optional(),
      conditions: z.array(z.string()).optional(),
    })
    .passthrough(),
  ai_result: z
    .object({
      urgency: urgencyLevelSchema.optional(),
      recommended_departments: z.array(z.string()).optional(),
    })
    .optional(),
});

export type FollowUpRequest = z.infer<typeof followUpRequestSchema>;

export const followUpQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['select', 'text']),
  options: z.array(z.string()).optional(),
});

export type FollowUpQuestion = z.infer<typeof followUpQuestionSchema>;

export const followUpResponseSchema = z.object({
  questions: z.array(followUpQuestionSchema),
});

export type FollowUpResponse = z.infer<typeof followUpResponseSchema>;
