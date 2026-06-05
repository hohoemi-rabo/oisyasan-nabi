import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_MODEL = 'gemini-3.5-flash';
// 実プロンプトは長く、Gemini 混雑時は応答が遅くなる（5s だと頻繁に GeminiTimeoutError →
// fallback になった）。空いている時は ~2-3s で返るが、混雑耐性のため余裕を持たせる。
export const AI_TIMEOUT_MS = 12000;
export const FOLLOW_UP_TIMEOUT_MS = 12000;

export class GeminiTimeoutError extends Error {
  constructor() {
    super('Gemini request timed out');
    this.name = 'GeminiTimeoutError';
  }
}

export function createGemini(apiKey: string | undefined) {
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

type GenAi = NonNullable<ReturnType<typeof createGemini>>;

export async function generateJson(
  genAi: GenAi,
  prompt: string,
  options: { timeoutMs: number; maxOutputTokens: number },
): Promise<string> {
  // gemini-3.5-flash は既定で thinking が有効で、maxOutputTokens を思考トークンが
  // 食い尽くして JSON が途中で切れる（finishReason=MAX_TOKENS → パース失敗 → fallback）。
  // thinkingBudget=0 で thinking を無効化（応答も ~2.5s に高速化）。
  // SDK 0.21 の GenerationConfig 型に thinkingConfig が無いため、変数に切り出して渡す
  // （インライン literal だと excess-property チェックに掛かる）。
  const generationConfig = {
    responseMimeType: 'application/json',
    temperature: 0.7,
    maxOutputTokens: options.maxOutputTokens,
    thinkingConfig: { thinkingBudget: 0 },
  };
  const model = genAi.getGenerativeModel({ model: GEMINI_MODEL, generationConfig });

  const generation = model.generateContent(prompt);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new GeminiTimeoutError()), options.timeoutMs),
  );
  const result = await Promise.race([generation, timeout]);
  return result.response.text();
}
