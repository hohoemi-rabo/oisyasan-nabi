import type {
  AIRecommendRequest,
  AIRecommendResponse,
  FollowUpRequest,
  FollowUpResponse,
} from '@/src/types/ai';

const TIMEOUT_MS = 8000;

function workerUrl(): string {
  const url = process.env.EXPO_PUBLIC_AI_WORKER_URL;
  if (!url) throw new Error('EXPO_PUBLIC_AI_WORKER_URL is not configured');
  return url.replace(/\/$/, '');
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
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
  return postJson<AIRecommendResponse>('/api/ai-recommend', payload);
}

export function fetchFollowUp(payload: FollowUpRequest): Promise<FollowUpResponse> {
  return postJson<FollowUpResponse>('/api/follow-up', payload);
}
