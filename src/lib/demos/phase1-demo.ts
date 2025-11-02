/**
 * Phase 1 Feature Demo
 * Demonstrates how to use new testing, logging, and error tracking
 */

// ============================================
// 1. STRUCTURED LOGGING DEMO
// ============================================

import { log, withTiming } from '@/lib/logger';

export async function loggingDemo() {
  // Basic logging
  log.info('Application started', { env: process.env.NODE_ENV });

  // HTTP request logging
  log.http({
    method: 'POST',
    url: '/api/inspection',
    statusCode: 201,
    duration: 45,
    userId: 'user-123',
  });

  // Database operation logging
  log.db({
    table: 'inspections',
    operation: 'INSERT',
    duration: 12,
    rowCount: 1,
  });

  // tRPC procedure logging
  log.trpc({
    path: 'inspection.create',
    type: 'mutation',
    duration: 150,
    success: true,
    userId: 'user-123',
  });

  // Performance logging
  log.performance({
    name: 'image-upload',
    value: 1250,
    unit: 'ms',
  });

  // Security event logging
  log.security({
    type: 'auth',
    action: 'failed-login-attempt',
    userId: 'user-123',
    success: false,
    context: { ip: '192.168.1.1' },
  });

  // Error logging
  try {
    throw new Error('Something went wrong!');
  } catch (error) {
    log.error('Operation failed', error, {
      operation: 'processData',
      userId: 'user-123',
    });
  }

  // Performance timing helper
  const result = await withTiming('database-query', async () => {
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, 50));
    return { data: 'result' };
  });

  console.log('✅ Logging demo complete!');
}

// ============================================
// 2. ERROR TRACKING DEMO
// ============================================

import { errorTracker, withPerformanceMonitoring } from '@/lib/sentry/error-tracker';

export async function errorTrackingDemo() {
  // Set user context
  errorTracker.setUser({
    id: 'user-123',
    email: 'user@example.com',
    username: 'john_doe',
  });

  // Add breadcrumbs for debugging trail
  errorTracker.addBreadcrumb({
    message: 'User navigated to inspection page',
    category: 'navigation',
    level: 'info',
  });

  errorTracker.addBreadcrumb({
    message: 'User clicked create button',
    category: 'ui.click',
    level: 'info',
    data: { buttonId: 'create-inspection' },
  });

  // Capture a message
  errorTracker.captureMessage('User completed onboarding', 'info');

  // Capture an exception
  try {
    throw new Error('Failed to save inspection');
  } catch (error) {
    errorTracker.captureException(error as Error, {
      inspectionId: 'insp-123',
      userId: 'user-123',
      action: 'create',
    });
  }

  // Set custom context
  errorTracker.setContext('inspection', {
    templateId: 'template-123',
    locationId: 'location-456',
    photoCount: 3,
  });

  // Wrap async function with error tracking
  const safeCreateInspection = errorTracker.wrapAsync(
    async (data: any) => {
      // Your function logic
      if (!data.template_id) {
        throw new Error('Template ID required');
      }
      return { success: true, id: 'new-id' };
    },
    {
      name: 'createInspection',
      onError: (error) => {
        console.error('Inspection creation failed:', error.message);
      },
    }
  );

  try {
    await safeCreateInspection({ template_id: 'test' });
  } catch (error) {
    // Error is automatically tracked in Sentry!
  }

  // Performance monitoring
  await withPerformanceMonitoring('upload-photos', async () => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  console.log('✅ Error tracking demo complete!');
}

// ============================================
// 3. TESTING DEMO
// ============================================

/**
 * Example: Writing a test for tRPC procedure
 *
 * File: src/server/routers/__tests__/example.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from '@/server/routers/_app';
import type { Context } from '@/server/context';

export function testingDemo() {
  describe('Example Test Suite', () => {
    let mockContext: Context;
    let caller: ReturnType<typeof appRouter.createCaller>;

    beforeEach(() => {
      // Setup mock context
      mockContext = {
        supabase: {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: '1', name: 'Test' },
              error: null,
            }),
          })),
        } as any,
        user: {
          id: 'user-123',
          email: 'test@example.com',
        } as any,
        req: new Request('http://localhost:3000'),
        resHeaders: new Headers(),
      };

      // Create tRPC caller
      caller = appRouter.createCaller(mockContext);
    });

    it('should create a location', async () => {
      const result = await caller.location.create({
        name: 'Test Toilet',
        floor: '1',
        section: 'A',
      });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Test Toilet');
    });

    it('should require authentication', async () => {
      // Remove user from context
      mockContext.user = null as any;
      const unauthCaller = appRouter.createCaller(mockContext);

      await expect(
        unauthCaller.location.create({
          name: 'Test',
          floor: '1',
          section: 'A',
        })
      ).rejects.toThrow('You must be logged in');
    });
  });

  console.log('✅ Testing demo complete!');
}

// ============================================
// 4. CI/CD INTEGRATION
// ============================================

/**
 * CI/CD automatically runs on:
 * - Push to: main, develop, claude/**
 * - Pull requests to: main, develop
 *
 * Pipeline steps:
 * 1. Lint & Format Check
 * 2. TypeScript Type Check
 * 3. Run Tests with Coverage
 * 4. Build Verification
 * 5. Security Audit
 * 6. Bundle Size Analysis (PR only)
 * 7. Deployment Ready Check
 *
 * To trigger CI:
 * ```bash
 * git add .
 * git commit -m "feat: my feature"
 * git push
 * ```
 *
 * View results at:
 * https://github.com/your-repo/actions
 */

// ============================================
// 5. USAGE IN REAL CODE
// ============================================

/**
 * Example: Using in a tRPC procedure
 */
export const exampleProcedure = {
  create: async (input: any) => {
    const startTime = Date.now();

    // Add breadcrumb
    errorTracker.addBreadcrumb({
      message: 'Starting inspection creation',
      category: 'business-logic',
      data: { templateId: input.template_id },
    });

    try {
      // Your business logic
      const result = await createInspectionInDatabase(input);

      // Log success
      log.info('Inspection created successfully', {
        inspectionId: result.id,
        duration: Date.now() - startTime,
      });

      // Performance metric
      log.performance({
        name: 'inspection.create',
        value: Date.now() - startTime,
        unit: 'ms',
      });

      return result;

    } catch (error) {
      // Log error
      log.error('Failed to create inspection', error as Error, {
        input,
        duration: Date.now() - startTime,
      });

      // Track in Sentry
      errorTracker.captureException(error as Error, {
        procedure: 'inspection.create',
        input,
      });

      throw error;
    }
  },
};

async function createInspectionInDatabase(input: any) {
  // Simulated database operation
  return { id: 'new-id', ...input };
}

// ============================================
// RUN ALL DEMOS
// ============================================

export async function runAllDemos() {
  console.log('\n🎯 Phase 1 Feature Demos\n');

  console.log('1️⃣ Structured Logging Demo');
  console.log('━'.repeat(50));
  await loggingDemo();

  console.log('\n2️⃣ Error Tracking Demo');
  console.log('━'.repeat(50));
  await errorTrackingDemo();

  console.log('\n3️⃣ Testing Demo');
  console.log('━'.repeat(50));
  testingDemo();

  console.log('\n✅ All demos complete!\n');
  console.log('📚 Read PHASE1_IMPLEMENTATION.md for full documentation');
}

// Uncomment to run demos:
// runAllDemos();
