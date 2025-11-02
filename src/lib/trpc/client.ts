import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@/server/routers/_app';

/**
 * Create tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get base URL for tRPC requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Reference for server-side rendering
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Assume localhost in development
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * tRPC Client Configuration
 */
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // Add authorization header if needed
          // authorization: getAuthToken(),
        };
      },
    }),
  ],
});
