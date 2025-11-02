import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../context';
import { TRPCError } from '@trpc/server';

// ============================================
// Zod Validation Schemas
// ============================================

const createInspectionSchema = z.object({
  template_id: z.string().uuid('Invalid template ID format'),
  location_id: z.string().uuid('Invalid location ID format'),
  user_id: z.string().uuid('Invalid user ID format'),
  inspection_date: z.string().optional(),
  inspection_time: z.string().optional(),
  overall_status: z.enum(['pass', 'fail', 'needs_attention']).optional(),
  responses: z.record(z.any()).optional(),
  photo_urls: z.array(z.string().url()).optional().default([]),
  notes: z.string().nullable().optional(),
  duration_seconds: z.number().int().positive().optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      accuracy: z.number().optional(),
    })
    .nullable()
    .optional(),
});

const listInspectionsSchema = z.object({
  location_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  status: z.enum(['pass', 'fail', 'needs_attention']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
});

const verifyInspectionSchema = z.object({
  id: z.string().uuid('Invalid inspection ID format'),
  verification_notes: z.string().optional(),
});

const getInspectionByIdSchema = z.object({
  id: z.string().uuid('Invalid inspection ID format'),
});

// ============================================
// Inspection Router
// ============================================

export const inspectionRouter = router({
  /**
   * Create a new inspection
   * Protected - requires authentication
   */
  create: protectedProcedure
    .input(createInspectionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Prepare data for insertion
        const inspectionData = {
          template_id: input.template_id,
          location_id: input.location_id,
          user_id: input.user_id,
          inspection_date: input.inspection_date,
          inspection_time: input.inspection_time,
          overall_status: input.overall_status,
          responses: input.responses as any,
          photo_urls: input.photo_urls,
          notes: input.notes,
          duration_seconds: input.duration_seconds,
          geolocation: input.geolocation as any,
        };

        // Insert into database
        const { data, error } = await ctx.supabase
          .from('inspection_records')
          .insert(inspectionData)
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create inspection',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Inspection created successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error('Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),

  /**
   * List inspections with filtering and pagination
   * Public - can be accessed without authentication
   */
  list: publicProcedure
    .input(listInspectionsSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Build query
        let query = ctx.supabase
          .from('inspection_records')
          .select('*', { count: 'exact' })
          .order('inspection_date', { ascending: false })
          .order('inspection_time', { ascending: false })
          .range(input.offset, input.offset + input.limit - 1);

        // Apply filters
        if (input.location_id) {
          query = query.eq('location_id', input.location_id);
        }

        if (input.user_id) {
          query = query.eq('user_id', input.user_id);
        }

        if (input.status) {
          query = query.eq('overall_status', input.status);
        }

        if (input.date_from) {
          query = query.gte('inspection_date', input.date_from);
        }

        if (input.date_to) {
          query = query.lte('inspection_date', input.date_to);
        }

        // Execute query
        const { data, error, count } = await query;

        if (error) {
          console.error('Database error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch inspections',
            cause: error,
          });
        }

        return {
          success: true,
          data: data || [],
          pagination: {
            total: count || 0,
            limit: input.limit,
            offset: input.offset,
            hasMore: count ? input.offset + input.limit < count : false,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error('Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),

  /**
   * Get a single inspection by ID
   * Public - can be accessed without authentication
   */
  getById: publicProcedure
    .input(getInspectionByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('inspection_records')
          .select('*')
          .eq('id', input.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Inspection not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch inspection',
            cause: error,
          });
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),

  /**
   * Verify an inspection
   * Protected - requires authentication
   */
  verify: protectedProcedure
    .input(verifyInspectionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('inspection_records')
          .update({
            verified_by: ctx.user.id,
            verified_at: new Date().toISOString(),
            verification_notes: input.verification_notes,
          })
          .eq('id', input.id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Inspection not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to verify inspection',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Inspection verified successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),
});
