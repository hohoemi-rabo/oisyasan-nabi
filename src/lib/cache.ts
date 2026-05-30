// ローカルキャッシュの TTL 判定。
// get/set 自体は各ストアの zustand persist（createJSONStorage(AsyncStorage)）が担うため、
// ここでは鮮度判定と定数のみを提供する。

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 時間
export const FOREGROUND_REFRESH_MS = 60 * 60 * 1000; // 1 時間

// loadedAt が ttl 以内なら鮮度ありとみなす（再フェッチ不要）。
export function isFresh(loadedAt: number | null, ttlMs: number = CACHE_TTL_MS): boolean {
  if (loadedAt === null) return false;
  return Date.now() - loadedAt < ttlMs;
}
