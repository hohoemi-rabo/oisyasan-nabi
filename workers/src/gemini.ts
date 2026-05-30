import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_MODEL = 'gemini-3.5-flash';
export const AI_TIMEOUT_MS = 5000;
export const FOLLOW_UP_TIMEOUT_MS = 10000;

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
  const model = genAi.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: options.maxOutputTokens,
    },
  });

  const generation = model.generateContent(prompt);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new GeminiTimeoutError()), options.timeoutMs),
  );
  const result = await Promise.race([generation, timeout]);
  return result.response.text();
}
