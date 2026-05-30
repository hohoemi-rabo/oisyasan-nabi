import type {
  AIRecommendRequest,
  AIRecommendResponse,
  FollowUpRequest,
  FollowUpResponse,
} from '@/src/types/ai';

// AI 判定は概ね 5 秒（§3.3.2）。thinking 無効化で応答は ~2.5s。クライアントは
// Workers 側 AI_TIMEOUT_MS=5s の判定（成功 or fallback）を取りこぼさないよう少し長め。
const RECOMMEND_TIMEOUT_MS = 8000;
const FOLLOW_UP_TIMEOUT_MS = 10000;

function workerUrl(): string {
  const url = process.env.EXPO_PUBLIC_AI_WORKER_URL;
  if (!url) throw new Error('EXPO_PUBLIC_AI_WORKER_URL is not configured');
  return url.replace(/\/$/, '');
}

async function postJson<T>(path: string, body: unknown, timeoutMs: number): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${workerUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchAiRecommend(payload: AIRecommendRequest): Promise<AIRecommendResponse> {
  return postJson<AIRecommendResponse>('/api/ai-recommend', payload, RECOMMEND_TIMEOUT_MS);
}

export function fetchFollowUp(payload: FollowUpRequest): Promise<FollowUpResponse> {
  return postJson<FollowUpResponse>('/api/follow-up', payload, FOLLOW_UP_TIMEOUT_MS);
}
