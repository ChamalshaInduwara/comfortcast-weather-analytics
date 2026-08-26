interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<number, CacheEntry<unknown>>();

const CACHE_TTL = 5 * 60 * 1000;

let cacheHits = 0;
let cacheMisses = 0;

export const getFromCache = <T>(
  key: number
): T | null => {
  const entry = cache.get(key);

  if (!entry) {
    cacheMisses++;
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    cacheMisses++;
    return null;
  }

  cacheHits++;

  return entry.data as T;
};

export const setCache = <T>(
  key: number,
  data: T
): void => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
  });
};

export const getCacheStatus = () => {
  const entries = Array.from(cache.entries()).map(
    ([cityId, entry]) => ({
      cityId,
      status:
        Date.now() < entry.expiresAt
          ? "HIT"
          : "EXPIRED",
      expiresInSeconds: Math.max(
        0,
        Math.floor(
          (entry.expiresAt - Date.now()) / 1000
        )
      ),
    })
  );

  return {
    size: cache.size,
    hits: cacheHits,
    misses: cacheMisses,
    ttlSeconds: CACHE_TTL / 1000,
    entries,
  };
};