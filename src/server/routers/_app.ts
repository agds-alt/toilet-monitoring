import { router } from '../context';
import { inspectionRouter } from './inspection.router';
import { locationRouter } from './location.router';
import { templateRouter } from './template.router';

/**
 * Main tRPC router
 * Combines all feature routers
 */
export const appRouter = router({
  inspection: inspectionRouter,
  location: locationRouter,
  template: templateRouter,
});

// Export type definition for the router
export type AppRouter = typeof appRouter;
