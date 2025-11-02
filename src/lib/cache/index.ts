import { redis } from '@/lib/rate-limit';
import { log } from '@/lib/logger';

/**
 * Production Caching Strategy
 * Multi-layer caching with Redis and in-memory cache
 */

// In-memory cache for frequently accessed data
const memoryCache = new Map<string, { value: any; expires: number }>();

// Cache duration constants (in seconds)
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  useMemoryCache?: boolean;
}

/**
 * Get value from cache
 */
export async function getCached<T>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> {
  const { useMemoryCache = true } = options;

  // Try memory cache first
  if (useMemoryCache) {
    const memCached = memoryCache.get(key);
    if (memCached && memCached.expires > Date.now()) {
      log.debug('Memory cache hit', { type: 'cache', key });
      return memCached.value as T;
    }
  }

  // Try Redis cache
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        log.debug('Redis cache hit', { type: 'cache', key });

        // Store in memory cache
        if (useMemoryCache && options.ttl) {
          memoryCache.set(key, {
            value: cached,
            expires: Date.now() + options.ttl * 1000,
          });
        }

        return cached as T;
      }
    } catch (error) {
      log.error('Redis cache get failed', error, { key });
    }
  }

  log.debug('Cache miss', { type: 'cache', key });
  return null;
}

/**
 * Set value in cache
 */
export async function setCached(
  key: string,
  value: any,
  options: CacheOptions = {}
): Promise<void> {
  const { ttl = CACHE_DURATION.MEDIUM, useMemoryCache = true } = options;

  // Store in memory cache
  if (useMemoryCache) {
    memoryCache.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
    });
  }

  // Store in Redis cache
  if (redis) {
    try {
      await redis.set(key, value, { ex: ttl });
      log.debug('Cached value', { type: 'cache', key, ttl });
    } catch (error) {
      log.error('Redis cache set failed', error, { key });
    }
  }
}

/**
 * Delete from cache
 */
export async function deleteCached(key: string): Promise<void> {
  // Delete from memory cache
  memoryCache.delete(key);

  // Delete from Redis cache
  if (redis) {
    try {
      await redis.del(key);
      log.debug('Deleted from cache', { type: 'cache', key });
    } catch (error) {
      log.error('Redis cache delete failed', error, { key });
    }
  }
}

/**
 * Get or set cached value with function
 */
export async function getOrSetCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache
  const cached = await getCached<T>(key, options);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const value = await fetcher();

  // Store in cache
  await setCached(key, value, options);

  return value;
}

/**
 * Cache patterns for common use cases
 */
export const cachePatterns = {
  /**
   * Cache inspection by ID
   */
  inspection: (id: string) => ({
    key: `inspection:${id}`,
    ttl: CACHE_DURATION.MEDIUM,
  }),

  /**
   * Cache location by ID
   */
  location: (id: string) => ({
    key: `location:${id}`,
    ttl: CACHE_DURATION.LONG,
  }),

  /**
   * Cache template by ID
   */
  template: (id: string) => ({
    key: `template:${id}`,
    ttl: CACHE_DURATION.VERY_LONG,
  }),

  /**
   * Cache user profile
   */
  user: (id: string) => ({
    key: `user:${id}`,
    ttl: CACHE_DURATION.MEDIUM,
  }),

  /**
   * Cache list of items
   */
  list: (type: string, page: number = 1, filters?: string) => ({
    key: `list:${type}:page:${page}${filters ? `:${filters}` : ''}`,
    ttl: CACHE_DURATION.SHORT,
  }),

  /**
   * Cache aggregated statistics
   */
  stats: (type: string, period?: string) => ({
    key: `stats:${type}${period ? `:${period}` : ''}`,
    ttl: CACHE_DURATION.MEDIUM,
  }),
};

/**
 * Invalidate cache by pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  // Clear memory cache
  for (const key of memoryCache.keys()) {
    if (key.startsWith(pattern)) {
      memoryCache.delete(key);
    }
  }

  // Clear Redis cache
  if (redis) {
    try {
      const keys = await redis.keys(`${pattern}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
        log.info('Invalidated cache pattern', {
          type: 'cache',
          pattern,
          count: keys.length,
        });
      }
    } catch (error) {
      log.error('Redis cache pattern invalidation failed', error, { pattern });
    }
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  // Clear memory cache
  memoryCache.clear();

  // Clear Redis cache
  if (redis) {
    try {
      await redis.flushdb();
      log.info('Cleared all caches', { type: 'cache' });
    } catch (error) {
      log.error('Redis flush failed', error);
    }
  }
}

/**
 * Clean expired memory cache entries
 */
export function cleanMemoryCache(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expires <= now) {
      memoryCache.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    log.debug('Cleaned memory cache', { type: 'cache', cleaned });
  }
}

/**
 * Start periodic memory cache cleanup
 */
export function startMemoryCacheCleanup(intervalMs = 60000): NodeJS.Timeout {
  return setInterval(() => {
    cleanMemoryCache();
  }, intervalMs);
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  const memorySize = memoryCache.size;
  let redisSize = 0;

  if (redis) {
    try {
      const keys = await redis.keys('*');
      redisSize = keys.length;
    } catch (error) {
      log.error('Failed to get Redis stats', error);
    }
  }

  return {
    memory: {
      size: memorySize,
      keys: Array.from(memoryCache.keys()),
    },
    redis: {
      size: redisSize,
      enabled: !!redis,
    },
  };
}

/**
 * Wrap a function with caching
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string;
    ttl?: number;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const key = options.keyGenerator(...args);
    return getOrSetCached(
      key,
      () => fn(...args),
      { ttl: options.ttl }
    );
  }) as T;
}
