import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../_app';
import { createMockLocation } from '@/test/mocks/mockData';
import type { Context } from '../../context';

/**
 * Unit tests for Location Router
 */
describe('Location Router', () => {
  let mockContext: Context;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    // Create mock context
    mockContext = {
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      } as any,
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        created_at: '2024-01-01',
      } as any,
      req: new Request('http://localhost:3000'),
      resHeaders: new Headers(),
    };

    // Create tRPC caller with mock context
    caller = appRouter.createCaller(mockContext);
  });

  describe('location.list', () => {
    it('should return list of locations', async () => {
      const mockLocations = [
        createMockLocation({ id: '1', name: 'Toilet A' }),
        createMockLocation({ id: '2', name: 'Toilet B' }),
      ];

      // Mock Supabase response
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockLocations,
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.location.list({});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter locations by floor', async () => {
      const mockLocations = [createMockLocation({ floor: '1' })];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockLocations,
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.location.list({ floor: '1' });

      expect(mockQuery.eq).toHaveBeenCalledWith('floor', '1');
    });

    it('should filter locations by section', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      await caller.location.list({ section: 'A' });

      expect(mockQuery.eq).toHaveBeenCalledWith('section', 'A');
    });
  });

  describe('location.getById', () => {
    it('should return a single location', async () => {
      const mockLocation = createMockLocation();

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockLocation,
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.location.getById({
        id: mockLocation.id,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLocation);
    });

    it('should throw NOT_FOUND error when location does not exist', async () => {
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
        caller.location.getById({
          id: '123e4567-e89b-12d3-a456-426614174999',
        })
      ).rejects.toThrow('Location not found');
    });
  });

  describe('location.create', () => {
    it('should create a new location', async () => {
      const newLocation = {
        name: 'New Toilet',
        floor: '1',
        section: 'A',
        qr_code: 'QR-001',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...newLocation, id: 'new-id' },
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.location.create(newLocation);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe(newLocation.name);
      expect(mockQuery.insert).toHaveBeenCalledWith(newLocation);
    });

    it('should require authentication', async () => {
      // Remove user from context
      mockContext.user = null as any;
      caller = appRouter.createCaller(mockContext);

      await expect(
        caller.location.create({
          name: 'New Toilet',
          floor: '1',
          section: 'A',
        })
      ).rejects.toThrow('You must be logged in');
    });
  });

  describe('location.update', () => {
    it('should update an existing location', async () => {
      const updateData = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Updated Name',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...createMockLocation(), name: 'Updated Name' },
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.location.update(updateData);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated Name');
      expect(mockQuery.update).toHaveBeenCalledWith({ name: 'Updated Name' });
    });
  });

  describe('location.delete', () => {
    it('should soft delete a location', async () => {
      const locationId = '123e4567-e89b-12d3-a456-426614174001';

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...createMockLocation(), is_active: false },
          error: null,
        }),
      };

      mockContext.supabase.from = vi.fn(() => mockQuery) as any;

      const result = await caller.location.delete({ id: locationId });

      expect(result.success).toBe(true);
      expect(result.data.is_active).toBe(false);
      expect(mockQuery.update).toHaveBeenCalledWith({ is_active: false });
    });
  });
});
