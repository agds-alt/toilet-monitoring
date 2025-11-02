import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../context';
import { TRPCError } from '@trpc/server';

// ============================================
// Zod Validation Schemas
// ============================================

const listLocationsSchema = z.object({
  floor: z.string().optional(),
  section: z.string().optional(),
  includeStats: z.boolean().default(false),
});

const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  floor: z.string().min(1, 'Floor is required'),
  section: z.string().min(1, 'Section is required'),
  qr_code: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const updateLocationSchema = z.object({
  id: z.string().uuid('Invalid location ID format'),
  name: z.string().min(1).optional(),
  floor: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  qr_code: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const getLocationByIdSchema = z.object({
  id: z.string().uuid('Invalid location ID format'),
});

const deleteLocationSchema = z.object({
  id: z.string().uuid('Invalid location ID format'),
});

// ============================================
// Location Router
// ============================================

export const locationRouter = router({
  /**
   * List all locations with optional filtering
   * Public - can be accessed without authentication
   */
  list: publicProcedure
    .input(listLocationsSchema)
    .query(async ({ ctx, input }) => {
      try {
        let query = ctx.supabase.from('locations').select('*');

        // Apply filters
        if (input.floor) {
          query = query.eq('floor', input.floor);
        }

        if (input.section) {
          query = query.eq('section', input.section);
        }

        const { data, error } = await query.order('name', { ascending: true });

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch locations',
            cause: error,
          });
        }

        return {
          success: true,
          data: data || [],
          meta: {
            total: data?.length || 0,
            filters: {
              floor: input.floor || 'all',
              section: input.section || 'all',
              includeStats: input.includeStats,
            },
          },
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
   * Get a single location by ID
   * Public - can be accessed without authentication
   */
  getById: publicProcedure
    .input(getLocationByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('locations')
          .select('*')
          .eq('id', input.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Location not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch location',
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
   * Create a new location
   * Protected - requires authentication
   */
  create: protectedProcedure
    .input(createLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('locations')
          .insert(input)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create location',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Location created successfully',
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
   * Update an existing location
   * Protected - requires authentication
   */
  update: protectedProcedure
    .input(updateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        const { data, error } = await ctx.supabase
          .from('locations')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Location not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update location',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Location updated successfully',
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
   * Delete a location (soft delete by setting is_active to false)
   * Protected - requires authentication
   */
  delete: protectedProcedure
    .input(deleteLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('locations')
          .update({ is_active: false })
          .eq('id', input.id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Location not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete location',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Location deleted successfully',
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
