import { initTRPC, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { createClient } from '@supabase/supabase-js';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { log } from '@/lib/logger';
import { errorTracker } from '@/lib/sentry/error-tracker';

/**
 * Create context for tRPC requests
 * This includes the authenticated Supabase client, logging, and error tracking
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  const authHeader = opts.req.headers.get('authorization');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: authHeader ? { authorization: authHeader } : {},
      },
    }
  );

  // Get the session if auth header is present
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Set user context for error tracking
  if (user) {
    errorTracker.setUser({
      id: user.id,
      email: user.email,
    });
  }

  return {
    supabase,
    user,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Log error
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      log.error('tRPC Internal Server Error', error, {
        code: error.code,
        path: shape.path,
      });

      // Track in Sentry
      if (error instanceof Error) {
        errorTracker.captureException(error, {
          trpc: {
            code: error.code,
            path: shape.path,
          },
        });
      }
    } else {
      log.warn('tRPC Error', {
        code: error.code,
        message: error.message,
        path: shape.path,
      });
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe user is now guaranteed
    },
  });
});

/**
 * Admin procedure that requires admin role
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Check if user has admin role from metadata or a dedicated table
  const { data: userRole } = await ctx.supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', ctx.user.id)
    .single();

  if (userRole?.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userRole: userRole.role,
    },
  });
});
