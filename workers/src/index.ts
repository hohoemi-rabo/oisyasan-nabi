import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { getDepartments } from './department-mapping';
import { fallbackUrgency } from './fallback-urgency';
import {
  AI_TIMEOUT_MS,
  createGemini,
  FOLLOW_UP_TIMEOUT_MS,
  generateJson,
} from './gemini';
import { ALL_DEPARTMENTS } from './master-data';
import {
  buildAiRecommendUserPrompt,
  buildFollowUpUserPrompt,
  FOLLOW_UP_PROMPT,
  SYSTEM_PROMPT,
} from './prompts';
import {
  aiRecommendCoreSchema,
  aiRecommendRequestSchema,
  followUpQuestionSchema,
  followUpRequestSchema,
  type AIRecommendRequest,
  type AIRecommendResponse,
} from './schemas';

type RateLimiter = {
  limit: (input: { key: string }) => Promise<{ success: boolean }>;
};

type Bindings = {
  GEMINI_API_KEY?: string;
  RATE_LIMITER: RateLimiter;
};

const ALLOWED_ORIGINS = new Set<string>([
  'http://localhost:8081',
  'http://localhost:19006',
  'https://expo.dev',
  'https://exp.host',
]);

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  '*',
  cors({
    origin: (origin) => {
      // Expo native fetch sends no Origin header — allow that, plus the explicit allowlist.
      if (!origin) return '*';
      return ALLOWED_ORIGINS.has(origin) ? origin : null;
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  }),
);

app.use('/api/*', async (c, next) => {
  const limiter = c.env.RATE_LIMITER;
  if (limiter) {
    const ip = c.req.header('cf-connecting-ip') ?? 'anon';
    const { success } = await limiter.limit({ key: ip });
    if (!success) {
      return c.json({ error: 'rate limit exceeded' }, 429, { 'Retry-After': '60' });
    }
  }
  await next();
});

app.get('/', (c) =>
  c.json({ ok: true, service: 'oisyasan-navi-ai' }),
);

app.post('/api/ai-recommend', zValidator('json', aiRecommendRequestSchema), async (c) => {
  const body = c.req.valid('json');
  const genAi = createGemini(c.env.GEMINI_API_KEY);

  if (!genAi) {
    return c.json(buildFallback(body));
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\n${buildAiRecommendUserPrompt(body)}`;
    const text = await generateJson(genAi, prompt, {
      timeoutMs: AI_TIMEOUT_MS,
      maxOutputTokens: 1000,
    });
    const parsed = aiRecommendCoreSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      console.warn('ai-recommend schema mismatch');
      return c.json(buildFallback(body));
    }

    const valid = new Set<string>(ALL_DEPARTMENTS);
    const recommended = parsed.data.recommended_departments.filter((d) => valid.has(d));
    const response: AIRecommendResponse = {
      ...parsed.data,
      recommended_departments: recommended.length > 0 ? recommended : ['内科'],
      source: 'ai',
    };
    return c.json(response);
  } catch (error) {
    console.warn(`ai-recommend error: ${(error as Error).name}`);
    return c.json(buildFallback(body));
  }
});

app.post('/api/follow-up', zValidator('json', followUpRequestSchema), async (c) => {
  const body = c.req.valid('json');
  const genAi = createGemini(c.env.GEMINI_API_KEY);

  if (!genAi) {
    return c.json({ questions: [] });
  }

  try {
    const prompt = `${FOLLOW_UP_PROMPT}\n\n${buildFollowUpUserPrompt(body)}`;
    const text = await generateJson(genAi, prompt, {
      timeoutMs: FOLLOW_UP_TIMEOUT_MS,
      maxOutputTokens: 800,
    });
    const raw = JSON.parse(text);
    if (!Array.isArray(raw)) {
      return c.json({ questions: [] });
    }
    const questions = raw
      .map((q) => followUpQuestionSchema.safeParse(q))
      .filter((r): r is { success: true; data: ReturnType<typeof followUpQuestionSchema.parse> } => r.success)
      .map((r) => r.data)
      .slice(0, 3);
    return c.json({ questions });
  } catch (error) {
    console.warn(`follow-up error: ${(error as Error).name}`);
    return c.json({ questions: [] });
  }
});

function buildFallback(req: AIRecommendRequest): AIRecommendResponse {
  const urgency = fallbackUrgency(req.symptoms);
  const departments = getDepartments(req.location, req.symptoms);
  const reasonMap = {
    emergency: '息苦しさやめまいなど、緊急性の高い症状が含まれています。',
    soon: '発熱や痛みがあるため、早めの受診をおすすめします。',
    watch: '現時点で緊急性は高くありませんが、症状が続く場合は受診してください。',
  } as const;

  return {
    urgency,
    urgency_reason: reasonMap[urgency],
    recommended_departments: departments,
    department_reason: `選択された部位（${req.location.join('、')}）と症状から判定しました。`,
    advice:
      urgency === 'emergency'
        ? '症状が重い場合はすぐに119番に電話してください。無理に動かず、安静にしてください。'
        : '受診前に保険証と服用中の薬があれば準備してください。症状の変化を記録しておくと医師に伝えやすくなります。',
    disclaimer: '※この判定は医療診断ではありません。症状が重い場合はすぐに119番に電話してください。',
    source: 'fallback',
  };
}

export default app;
