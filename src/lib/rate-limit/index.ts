import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate Limiting Configuration
 * Uses Upstash Redis for distributed rate limiting
 */

// Initialize Redis client (only if credentials are provided)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

/**
 * Rate limiter for API endpoints
 * Sliding window: 10 requests per 10 seconds
 */
export const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: 'ratelimit:api',
    })
  : null;

/**
 * Rate limiter for authentication endpoints
 * More restrictive: 5 requests per 15 minutes
 */
export const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'ratelimit:auth',
    })
  : null;

/**
 * Rate limiter for mutations/writes
 * Medium restriction: 20 requests per minute
 */
export const mutationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
      prefix: 'ratelimit:mutation',
    })
  : null;

/**
 * Rate limiter for file uploads
 * Strict: 5 uploads per 5 minutes
 */
export const uploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '5 m'),
      analytics: true,
      prefix: 'ratelimit:upload',
    })
  : null;

/**
 * Helper function to check rate limit
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // If no limiter configured, allow request
  if (!limiter) {
    return {
      success: true,
      limit: 9999,
      remaining: 9999,
      reset: Date.now() + 60000,
    };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Get identifier from request
 * Uses IP address or user ID
 */
export function getIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from headers
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';

  return `ip:${ip}`;
}

/**
 * Rate limit error response
 */
export function rateLimitResponse(resetTime: number) {
  const resetDate = new Date(resetTime);

  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      resetAt: resetDate.toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
        'X-RateLimit-Reset': resetDate.toISOString(),
      },
    }
  );
}

/**
 * Apply rate limit headers to response
 */
export function applyRateLimitHeaders(
  headers: Headers,
  limit: number,
  remaining: number,
  reset: number
): void {
  headers.set('X-RateLimit-Limit', String(limit));
  headers.set('X-RateLimit-Remaining', String(remaining));
  headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
}
