import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../context';
import { TRPCError } from '@trpc/server';

// ============================================
// Zod Validation Schemas
// ============================================

const listTemplatesSchema = z.object({
  defaultOnly: z.boolean().default(false),
  includeInactive: z.boolean().default(false),
});

const getTemplateByIdSchema = z.object({
  id: z.string().uuid('Invalid template ID format'),
});

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  questions: z.array(z.any()), // JSONB array of questions
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

const updateTemplateSchema = z.object({
  id: z.string().uuid('Invalid template ID format'),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  questions: z.array(z.any()).optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

const deleteTemplateSchema = z.object({
  id: z.string().uuid('Invalid template ID format'),
});

// ============================================
// Template Router
// ============================================

export const templateRouter = router({
  /**
   * List all templates
   * Public - can be accessed without authentication
   */
  list: publicProcedure
    .input(listTemplatesSchema)
    .query(async ({ ctx, input }) => {
      try {
        let query = ctx.supabase
          .from('inspection_templates')
          .select('*')
          .order('created_at', { ascending: false });

        // Filter by active status
        if (!input.includeInactive) {
          query = query.eq('is_active', true);
        }

        // Filter for default template only
        if (input.defaultOnly) {
          query = query.eq('is_default', true);
        }

        const { data, error } = await query;

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch templates',
            cause: error,
          });
        }

        // If default only and not found
        if (input.defaultOnly && (!data || data.length === 0)) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Default template not found',
          });
        }

        return {
          success: true,
          data: input.defaultOnly && data && data.length > 0 ? data[0] : data || [],
          count: data?.length || 0,
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
   * Get a single template by ID
   * Public - can be accessed without authentication
   */
  getById: publicProcedure
    .input(getTemplateByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('inspection_templates')
          .select('*')
          .eq('id', input.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Template not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch template',
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
   * Create a new template
   * Protected - requires authentication
   */
  create: protectedProcedure
    .input(createTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // If this is set as default, unset other defaults first
        if (input.is_default) {
          await ctx.supabase
            .from('inspection_templates')
            .update({ is_default: false })
            .eq('is_default', true);
        }

        const { data, error } = await ctx.supabase
          .from('inspection_templates')
          .insert(input)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create template',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Template created successfully',
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
   * Update an existing template
   * Protected - requires authentication
   */
  update: protectedProcedure
    .input(updateTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // If this is being set as default, unset other defaults first
        if (updateData.is_default) {
          await ctx.supabase
            .from('inspection_templates')
            .update({ is_default: false })
            .eq('is_default', true)
            .neq('id', id);
        }

        const { data, error } = await ctx.supabase
          .from('inspection_templates')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Template not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update template',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Template updated successfully',
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
   * Delete a template (soft delete by setting is_active to false)
   * Protected - requires authentication
   */
  delete: protectedProcedure
    .input(deleteTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('inspection_templates')
          .update({ is_active: false })
          .eq('id', input.id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Template not found',
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete template',
            cause: error,
          });
        }

        return {
          success: true,
          data,
          message: 'Template deleted successfully',
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
