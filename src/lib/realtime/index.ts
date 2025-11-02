/**
 * Supabase Realtime Utilities
 * Provides type-safe real-time subscriptions
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { log } from '@/lib/logger';

type TableName = 'locations' | 'inspection_records' | 'inspection_templates';

type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionOptions<T = any> {
  table: TableName;
  event?: ChangeEvent;
  filter?: string;
  onInsert?: (record: T) => void;
  onUpdate?: (oldRecord: T, newRecord: T) => void;
  onDelete?: (record: T) => void;
  onChange?: (record: T, event: ChangeEvent) => void;
}

/**
 * Create a Supabase client for real-time subscriptions
 */
export function createRealtimeClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Subscribe to real-time changes on a table
 *
 * @example
 * ```ts
 * const unsubscribe = subscribeToTable({
 *   table: 'locations',
 *   event: '*',
 *   onChange: (record, event) => {
 *     console.log('Location changed:', event, record);
 *   },
 * });
 *
 * // Later: unsubscribe()
 * ```
 */
export function subscribeToTable<T = any>(
  options: SubscriptionOptions<T>
): () => void {
  const { table, event = '*', filter, onInsert, onUpdate, onDelete, onChange } = options;

  const supabase = createRealtimeClient();
  let channel: RealtimeChannel;

  try {
    log.info('Setting up real-time subscription', { table, event });

    // Create channel
    channel = supabase.channel(`${table}-changes`);

    // Configure subscription
    channel.on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table,
        filter,
      },
      (payload) => {
        log.debug('Real-time change received', {
          table,
          event: payload.eventType,
          recordId: (payload.new as any)?.id || (payload.old as any)?.id,
        });

        // Call specific handlers
        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload.new as T);
            onChange?.(payload.new as T, 'INSERT');
            break;

          case 'UPDATE':
            onUpdate?.(payload.old as T, payload.new as T);
            onChange?.(payload.new as T, 'UPDATE');
            break;

          case 'DELETE':
            onDelete?.(payload.old as T);
            onChange?.(payload.old as T, 'DELETE');
            break;
        }
      }
    );

    // Subscribe to channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        log.info('Real-time subscription active', { table });
      } else if (status === 'CLOSED') {
        log.warn('Real-time subscription closed', { table });
      } else if (status === 'CHANNEL_ERROR') {
        log.error('Real-time subscription error', { table });
      }
    });

    // Return unsubscribe function
    return () => {
      log.info('Unsubscribing from real-time', { table });
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  } catch (error) {
    log.error('Failed to setup real-time subscription', error as Error, { table });
    throw error;
  }
}

/**
 * Subscribe to location changes
 */
export function subscribeToLocations(
  onChange: (location: any, event: ChangeEvent) => void
): () => void {
  return subscribeToTable({
    table: 'locations',
    onChange,
  });
}

/**
 * Subscribe to inspection changes
 */
export function subscribeToInspections(
  onChange: (inspection: any, event: ChangeEvent) => void,
  filter?: string
): () => void {
  return subscribeToTable({
    table: 'inspection_records',
    onChange,
    filter,
  });
}

/**
 * Subscribe to template changes
 */
export function subscribeToTemplates(
  onChange: (template: any, event: ChangeEvent) => void
): () => void {
  return subscribeToTable({
    table: 'inspection_templates',
    onChange,
  });
}

/**
 * React Hook for real-time subscriptions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRealtimeSubscription({
 *     table: 'locations',
 *     onChange: (location, event) => {
 *       console.log('Location changed:', location);
 *       // Update local state
 *     },
 *   });
 * }
 * ```
 */
export function useRealtimeSubscription<T = any>(
  options: SubscriptionOptions<T>,
  deps: React.DependencyList = []
): void {
  if (typeof window === 'undefined') return; // SSR guard

  const { useEffect } = require('react');

  useEffect(() => {
    const unsubscribe = subscribeToTable(options);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Broadcast a message to all clients in a channel
 *
 * @example
 * ```ts
 * broadcastMessage('notifications', {
 *   type: 'inspection_completed',
 *   data: { inspectionId: '123' },
 * });
 * ```
 */
export async function broadcastMessage(
  channelName: string,
  event: string,
  payload: any
): Promise<void> {
  const supabase = createRealtimeClient();
  const channel = supabase.channel(channelName);

  await channel.subscribe();

  channel.send({
    type: 'broadcast',
    event,
    payload,
  });

  log.info('Broadcast message sent', { channelName, event });
}

/**
 * Listen to broadcast messages
 *
 * @example
 * ```ts
 * const unsubscribe = listenToBroadcast('notifications', (payload) => {
 *   console.log('Received:', payload);
 * });
 * ```
 */
export function listenToBroadcast(
  channelName: string,
  event: string,
  callback: (payload: any) => void
): () => void {
  const supabase = createRealtimeClient();
  const channel = supabase.channel(channelName);

  channel
    .on('broadcast', { event }, ({ payload }) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  };
}
