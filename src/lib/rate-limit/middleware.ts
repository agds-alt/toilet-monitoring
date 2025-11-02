import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  apiLimiter,
  authLimiter,
  mutationLimiter,
  uploadLimiter,
  checkRateLimit,
  getIdentifier,
  rateLimitResponse,
  applyRateLimitHeaders,
} from './index';
import { log } from '@/lib/logger';

/**
 * Rate limiting middleware for Next.js routes
 */

type RateLimiterType = 'api' | 'auth' | 'mutation' | 'upload';

const limiterMap = {
  api: apiLimiter,
  auth: authLimiter,
  mutation: mutationLimiter,
  upload: uploadLimiter,
};

/**
 * Apply rate limiting to a Next.js API route
 *
 * @example
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = await applyRateLimit(req, 'mutation');
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // Your route logic here
 * }
 * ```
 */
export async function applyRateLimit(
  req: NextRequest,
  type: RateLimiterType = 'api',
  userId?: string
): Promise<Response | null> {
  const limiter = limiterMap[type];

  // Get identifier (user ID or IP address)
  const identifier = getIdentifier(req, userId);

  // Check rate limit
  const result = await checkRateLimit(limiter, identifier);

  // Log rate limit check
  log.debug('Rate limit check', {
    type,
    identifier,
    success: result.success,
    remaining: result.remaining,
    limit: result.limit,
  });

  // If rate limit exceeded, log security event
  if (!result.success) {
    log.security({
      type: 'suspicious',
      action: 'rate-limit-exceeded',
      userId,
      success: false,
      context: {
        limiterType: type,
        identifier,
        limit: result.limit,
        reset: new Date(result.reset).toISOString(),
      },
    });

    // Return rate limit error response
    return rateLimitResponse(result.reset);
  }

  // Add rate limit headers to subsequent response
  // Note: This won't automatically apply to the response
  // You'll need to manually add these headers in your route handler

  return null; // No rate limit error, continue with request
}

/**
 * Higher-order function to wrap API routes with rate limiting
 *
 * @example
 * ```ts
 * export const POST = withRateLimit(
 *   async (req: NextRequest) => {
 *     // Your route logic
 *     return NextResponse.json({ success: true });
 *   },
 *   { type: 'mutation' }
 * );
 * ```
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  options: {
    type?: RateLimiterType;
    getUserId?: (req: NextRequest) => Promise<string | undefined>;
  } = {}
) {
  return async (req: NextRequest): Promise<Response> => {
    const { type = 'api', getUserId } = options;

    // Get user ID if provided
    const userId = getUserId ? await getUserId(req) : undefined;

    // Apply rate limit
    const rateLimitResult = await applyRateLimit(req, type, userId);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Get identifier for headers
    const identifier = getIdentifier(req, userId);
    const limiter = limiterMap[type];
    const result = await checkRateLimit(limiter, identifier);

    // Execute handler
    const response = await handler(req);

    // Add rate limit headers to response
    if (response instanceof Response) {
      applyRateLimitHeaders(
        response.headers,
        result.limit,
        result.remaining,
        result.reset
      );
    }

    return response;
  };
}

/**
 * Rate limit for tRPC procedures
 * Can be used as a middleware in tRPC context
 */
export async function rateLimitTRPC(
  identifier: string,
  type: RateLimiterType = 'api'
): Promise<{ success: boolean; remaining: number }> {
  const limiter = limiterMap[type];
  const result = await checkRateLimit(limiter, identifier);

  if (!result.success) {
    log.security({
      type: 'suspicious',
      action: 'trpc-rate-limit-exceeded',
      success: false,
      context: {
        limiterType: type,
        identifier,
        limit: result.limit,
      },
    });

    throw new Error('Rate limit exceeded. Please try again later.');
  }

  return {
    success: true,
    remaining: result.remaining,
  };
}
