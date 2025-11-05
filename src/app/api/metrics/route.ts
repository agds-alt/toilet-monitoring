import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Metrics Endpoint
 * Returns application metrics in Prometheus format
 * Can be scraped by Prometheus or similar monitoring systems
 */

const startTime = Date.now();
let requestCount = 0;
let errorCount = 0;

export async function GET() {
  requestCount++;

  try {
    const metrics = await collectMetrics();
    const output = formatPrometheusMetrics(metrics);

    return new Response(output, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  } catch (error) {
    errorCount++;
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}

interface Metrics {
  uptime: number;
  requests: number;
  errors: number;
  memory: {
    used: number;
    total: number;
    external: number;
    rss: number;
  };
  database: {
    inspections: number;
    locations: number;
    templates: number;
  };
}

async function collectMetrics(): Promise<Metrics> {
  const memoryUsage = process.memoryUsage();
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  // Collect database metrics
  const dbMetrics = await collectDatabaseMetrics();

  return {
    uptime,
    requests: requestCount,
    errors: errorCount,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
    },
    database: dbMetrics,
  };
}

async function collectDatabaseMetrics() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [inspectionsResult, locationsResult, templatesResult] = await Promise.all([
      supabase.from('inspections').select('id', { count: 'exact', head: true }),
      supabase.from('locations').select('id', { count: 'exact', head: true }),
      supabase.from('templates').select('id', { count: 'exact', head: true }),
    ]);

    return {
      inspections: inspectionsResult.count || 0,
      locations: locationsResult.count || 0,
      templates: templatesResult.count || 0,
    };
  } catch (error) {
    return {
      inspections: 0,
      locations: 0,
      templates: 0,
    };
  }
}

function formatPrometheusMetrics(metrics: Metrics): string {
  const lines: string[] = [];

  // Application uptime
  lines.push('# HELP app_uptime_seconds Application uptime in seconds');
  lines.push('# TYPE app_uptime_seconds counter');
  lines.push(`app_uptime_seconds ${metrics.uptime}`);
  lines.push('');

  // Request count
  lines.push('# HELP http_requests_total Total HTTP requests');
  lines.push('# TYPE http_requests_total counter');
  lines.push(`http_requests_total ${metrics.requests}`);
  lines.push('');

  // Error count
  lines.push('# HELP http_errors_total Total HTTP errors');
  lines.push('# TYPE http_errors_total counter');
  lines.push(`http_errors_total ${metrics.errors}`);
  lines.push('');

  // Memory metrics
  lines.push('# HELP nodejs_heap_used_bytes Node.js heap used in bytes');
  lines.push('# TYPE nodejs_heap_used_bytes gauge');
  lines.push(`nodejs_heap_used_bytes ${metrics.memory.used * 1024 * 1024}`);
  lines.push('');

  lines.push('# HELP nodejs_heap_total_bytes Node.js heap total in bytes');
  lines.push('# TYPE nodejs_heap_total_bytes gauge');
  lines.push(`nodejs_heap_total_bytes ${metrics.memory.total * 1024 * 1024}`);
  lines.push('');

  lines.push('# HELP nodejs_external_bytes Node.js external memory in bytes');
  lines.push('# TYPE nodejs_external_bytes gauge');
  lines.push(`nodejs_external_bytes ${metrics.memory.external * 1024 * 1024}`);
  lines.push('');

  // Database metrics
  lines.push('# HELP db_inspections_total Total number of inspections');
  lines.push('# TYPE db_inspections_total gauge');
  lines.push(`db_inspections_total ${metrics.database.inspections}`);
  lines.push('');

  lines.push('# HELP db_locations_total Total number of locations');
  lines.push('# TYPE db_locations_total gauge');
  lines.push(`db_locations_total ${metrics.database.locations}`);
  lines.push('');

  lines.push('# HELP db_templates_total Total number of templates');
  lines.push('# TYPE db_templates_total gauge');
  lines.push(`db_templates_total ${metrics.database.templates}`);
  lines.push('');

  return lines.join('\n');
}

// Note: Counter functions are internal to this route
// If needed in middleware, move to separate utility file
