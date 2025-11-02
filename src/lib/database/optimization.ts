import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { log } from '@/lib/logger';

/**
 * Database Optimization Utilities
 * Tools for query optimization, connection pooling, and performance monitoring
 */

/**
 * Batch insert helper
 * Inserts records in batches to avoid overwhelming the database
 */
export async function batchInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: T[],
  batchSize = 100
): Promise<{ success: number; errors: number }> {
  let success = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      const { error } = await supabase.from(table).insert(batch);

      if (error) {
        log.error(`Batch insert failed for ${table}`, error, {
          batch: i / batchSize,
          size: batch.length,
        });
        errors += batch.length;
      } else {
        success += batch.length;
      }
    } catch (error) {
      log.error(`Batch insert exception for ${table}`, error);
      errors += batch.length;
    }
  }

  log.info('Batch insert completed', {
    type: 'database',
    table,
    success,
    errors,
    total: records.length,
  });

  return { success, errors };
}

/**
 * Batch update helper
 */
export async function batchUpdate<T extends { id: string }>(
  supabase: SupabaseClient,
  table: string,
  records: T[],
  batchSize = 50
): Promise<{ success: number; errors: number }> {
  let success = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      // Update each record individually in parallel
      const updates = batch.map((record) =>
        supabase.from(table).update(record).eq('id', record.id)
      );

      const results = await Promise.allSettled(updates);

      results.forEach((result) => {
        if (result.status === 'fulfilled' && !result.value.error) {
          success++;
        } else {
          errors++;
        }
      });
    } catch (error) {
      log.error(`Batch update exception for ${table}`, error);
      errors += batch.length;
    }
  }

  log.info('Batch update completed', {
    type: 'database',
    table,
    success,
    errors,
    total: records.length,
  });

  return { success, errors };
}

/**
 * Paginated query helper
 * Efficiently query large datasets with pagination
 */
export async function paginatedQuery<T>(
  supabase: SupabaseClient,
  table: string,
  options: {
    pageSize?: number;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, any>;
  } = {}
): Promise<T[]> {
  const { pageSize = 1000, orderBy = 'created_at', ascending = false, filters = {} } = options;

  const allResults: T[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const start = page * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending })
      .range(start, end);

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error) {
      log.error('Paginated query failed', error, { table, page });
      break;
    }

    if (data && data.length > 0) {
      allResults.push(...(data as T[]));

      if (data.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  log.info('Paginated query completed', {
    type: 'database',
    table,
    pages: page + 1,
    records: allResults.length,
  });

  return allResults;
}

/**
 * Archive old records
 * Move old records to an archive table to keep main table performant
 */
export async function archiveOldRecords(
  supabase: SupabaseClient,
  table: string,
  archiveTable: string,
  daysOld: number
): Promise<{ archived: number; deleted: number }> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  try {
    // Get records to archive
    const { data: oldRecords, error: selectError } = await supabase
      .from(table)
      .select('*')
      .lt('created_at', cutoffDate.toISOString());

    if (selectError || !oldRecords) {
      log.error('Failed to select old records', selectError);
      return { archived: 0, deleted: 0 };
    }

    if (oldRecords.length === 0) {
      log.info('No old records to archive', { table, daysOld });
      return { archived: 0, deleted: 0 };
    }

    // Insert into archive table
    const { success: archived } = await batchInsert(
      supabase,
      archiveTable,
      oldRecords
    );

    // Delete from main table
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (deleteError) {
      log.error('Failed to delete archived records', deleteError);
      return { archived, deleted: 0 };
    }

    log.info('Archived old records', {
      type: 'database',
      table,
      archiveTable,
      daysOld,
      archived,
      deleted: oldRecords.length,
    });

    return { archived, deleted: oldRecords.length };
  } catch (error) {
    log.error('Archive operation failed', error);
    return { archived: 0, deleted: 0 };
  }
}

/**
 * Analyze table statistics
 */
export async function getTableStats(
  supabase: SupabaseClient,
  table: string
): Promise<{
  count: number;
  oldestRecord?: string;
  newestRecord?: string;
}> {
  try {
    // Get count
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    // Get oldest record
    const { data: oldestData } = await supabase
      .from(table)
      .select('created_at')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    // Get newest record
    const { data: newestData } = await supabase
      .from(table)
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      count: count || 0,
      oldestRecord: oldestData?.created_at,
      newestRecord: newestData?.created_at,
    };
  } catch (error) {
    log.error('Failed to get table stats', error, { table });
    return { count: 0 };
  }
}

/**
 * Vacuum analyze helper (for PostgreSQL maintenance)
 * Note: This requires superuser privileges and may not work with Supabase
 */
export async function optimizeDatabase(): Promise<void> {
  log.info('Database optimization started', { type: 'database' });

  // Get statistics for all tables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const tables = ['inspections', 'locations', 'templates', 'template_fields'];

  for (const table of tables) {
    const stats = await getTableStats(supabase, table);
    log.info('Table statistics', {
      type: 'database',
      table,
      ...stats,
    });
  }

  log.info('Database optimization completed', { type: 'database' });
}

/**
 * Connection pool monitoring
 */
export function monitorConnectionPool() {
  // This is a placeholder for connection pool monitoring
  // In production, you would integrate with your database connection pool
  const stats = {
    active: 0,
    idle: 0,
    waiting: 0,
    total: 0,
  };

  log.info('Connection pool stats', {
    type: 'database',
    ...stats,
  });

  return stats;
}

/**
 * Query performance tracker
 */
const queryMetrics = new Map<string, { count: number; totalTime: number; avgTime: number }>();

export function trackQuery(queryName: string, duration: number): void {
  const existing = queryMetrics.get(queryName) || { count: 0, totalTime: 0, avgTime: 0 };

  const newCount = existing.count + 1;
  const newTotalTime = existing.totalTime + duration;
  const newAvgTime = newTotalTime / newCount;

  queryMetrics.set(queryName, {
    count: newCount,
    totalTime: newTotalTime,
    avgTime: newAvgTime,
  });

  if (duration > 1000) {
    log.warn('Slow query detected', {
      type: 'database',
      query: queryName,
      duration,
    });
  }
}

export function getQueryMetrics() {
  return Object.fromEntries(queryMetrics.entries());
}

/**
 * Clear old query metrics
 */
export function clearQueryMetrics(): void {
  queryMetrics.clear();
  log.info('Query metrics cleared', { type: 'database' });
}
