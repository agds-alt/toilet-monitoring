import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../_app';
import { createMockInspection, createMockUser } from '@/test/mocks/mockData';
import type { Context } from '../../context';

/**
 * Unit tests for Inspection Router
 */
describe('Inspection Router', () => {
  let mockContext: Context;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    mockContext = {
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          lte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockReturnThis(),
          single: vi.fn().mockReturnThis(),
        })),
      } as any,
      user: createMockUser() as any,
      req: new Request('http://localhost:3000'),
      resHeaders: new Headers(),
    };

    caller = appRouter.createCaller(mockContext);
  });

  describe('inspection.create', () => {
    it('should create a new inspection', async () => {
      const newInspection = {
        template_id: '123e4567-e89b-12d3-a456-426614174002',
        location_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        overall_status: 'pass' as const,
        photo_urls: [],
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...newInspection, id: 'new-id' },
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.inspection.create(newInspection);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Inspection created successfully');
      expect(mockQuery.insert).toHaveBeenCalled();
    });

    it('should validate UUID format for template_id', async () => {
      await expect(
        caller.inspection.create({
          template_id: 'invalid-uuid',
          location_id: '123e4567-e89b-12d3-a456-426614174001',
          user_id: '123e4567-e89b-12d3-a456-426614174000',
        } as any)
      ).rejects.toThrow();
    });

    it('should require authentication', async () => {
      mockContext.user = null as any;
      caller = appRouter.createCaller(mockContext);

      await expect(
        caller.inspection.create({
          template_id: '123e4567-e89b-12d3-a456-426614174002',
          location_id: '123e4567-e89b-12d3-a456-426614174001',
          user_id: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).rejects.toThrow('You must be logged in');
    });
  });

  describe('inspection.list', () => {
    it('should return paginated list of inspections', async () => {
      const mockInspections = [
        createMockInspection({ id: '1' }),
        createMockInspection({ id: '2' }),
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockInspections,
          error: null,
          count: 2,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.inspection.list({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should filter by location_id', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.inspection.list({
        location_id: '123e4567-e89b-12d3-a456-426614174001',
      });

      expect(mockQuery.eq).toHaveBeenCalledWith(
        'location_id',
        '123e4567-e89b-12d3-a456-426614174001'
      );
    });

    it('should filter by status', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.inspection.list({
        status: 'pass',
      });

      expect(mockQuery.eq).toHaveBeenCalledWith('overall_status', 'pass');
    });

    it('should filter by date range', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.inspection.list({
        date_from: '2024-01-01',
        date_to: '2024-01-31',
      });

      expect(mockQuery.gte).toHaveBeenCalledWith('inspection_date', '2024-01-01');
      expect(mockQuery.lte).toHaveBeenCalledWith('inspection_date', '2024-01-31');
    });

    it('should respect limit parameter', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.inspection.list({
        limit: 20,
        offset: 0,
      });

      expect(mockQuery.range).toHaveBeenCalledWith(0, 19);
    });
  });

  describe('inspection.getById', () => {
    it('should return a single inspection', async () => {
      const mockInspection = createMockInspection();

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockInspection,
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.inspection.getById({
        id: mockInspection.id,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockInspection);
    });

    it('should throw NOT_FOUND when inspection does not exist', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' },
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await expect(
        caller.inspection.getById({
          id: '123e4567-e89b-12d3-a456-426614174999',
        })
      ).rejects.toThrow('Inspection not found');
    });
  });

  describe('inspection.verify', () => {
    it('should verify an inspection', async () => {
      const inspectionId = '123e4567-e89b-12d3-a456-426614174003';
      const verificationNotes = 'Approved by supervisor';

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            ...createMockInspection(),
            verified_by: mockContext.user!.id,
            verified_at: new Date().toISOString(),
            verification_notes: verificationNotes,
          },
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.inspection.verify({
        id: inspectionId,
        verification_notes: verificationNotes,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Inspection verified successfully');
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          verified_by: mockContext.user!.id,
          verification_notes: verificationNotes,
        })
      );
    });

    it('should require authentication', async () => {
      mockContext.user = null as any;
      caller = appRouter.createCaller(mockContext);

      await expect(
        caller.inspection.verify({
          id: '123e4567-e89b-12d3-a456-426614174003',
        })
      ).rejects.toThrow('You must be logged in');
    });
  });
});
