import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { log } from '@/lib/logger';

/**
 * Health Check Endpoint
 * Returns application health status
 * Used by monitoring systems and load balancers
 */

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'pass' | 'fail';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'pass' | 'warn' | 'fail';
      usage: {
        used: number;
        total: number;
        percentage: number;
      };
    };
    environment: {
      status: 'pass' | 'fail';
      missing?: string[];
    };
  };
}

const startTime = Date.now();

export async function GET(request: NextRequest) {
  const start = Date.now();

  try {
    // Check environment variables
    const envCheck = checkEnvironment();

    // Check database connection
    const dbCheck = await checkDatabase();

    // Check memory usage
    const memCheck = checkMemory();

    // Determine overall status
    const status = determineStatus([
      envCheck.status,
      dbCheck.status,
      memCheck.status,
    ]);

    const result: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      checks: {
        database: dbCheck,
        memory: memCheck,
        environment: envCheck,
      },
    };

    // Log health check
    log.info('Health check', {
      type: 'health',
      status,
      duration: Date.now() - start,
    });

    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    log.error('Health check failed', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheckResult['checks']['database']> {
  const start = Date.now();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Simple query to check connection
    const { error } = await supabase
      .from('locations')
      .select('id')
      .limit(1);

    const responseTime = Date.now() - start;

    if (error) {
      return {
        status: 'fail',
        error: error.message,
        responseTime,
      };
    }

    return {
      status: 'pass',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - start,
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): HealthCheckResult['checks']['memory'] {
  const usage = process.memoryUsage();
  const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const percentage = Math.round((usedMB / totalMB) * 100);

  let status: 'pass' | 'warn' | 'fail' = 'pass';

  if (percentage > 90) {
    status = 'fail';
  } else if (percentage > 75) {
    status = 'warn';
  }

  return {
    status,
    usage: {
      used: usedMB,
      total: totalMB,
      percentage,
    },
  };
}

/**
 * Check required environment variables
 */
function checkEnvironment(): HealthCheckResult['checks']['environment'] {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return {
      status: 'fail',
      missing,
    };
  }

  return {
    status: 'pass',
  };
}

/**
 * Determine overall status from individual checks
 */
function determineStatus(
  statuses: Array<'pass' | 'warn' | 'fail'>
): 'healthy' | 'degraded' | 'unhealthy' {
  if (statuses.includes('fail')) {
    return 'unhealthy';
  }

  if (statuses.includes('warn')) {
    return 'degraded';
  }

  return 'healthy';
}
