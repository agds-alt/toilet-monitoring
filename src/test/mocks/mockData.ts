/**
 * Mock data factory for tests
 */

export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockLocation = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Test Toilet A',
  floor: '1',
  section: 'A',
  qr_code: 'TEST-QR-001',
  description: 'Test location description',
  is_active: true,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockTemplate = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  name: 'Test Template',
  description: 'Test template description',
  questions: [
    {
      id: 'q1',
      text: 'Is the toilet clean?',
      type: 'boolean',
      required: true,
    },
    {
      id: 'q2',
      text: 'Are supplies available?',
      type: 'boolean',
      required: true,
    },
  ],
  is_default: true,
  is_active: true,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockInspection = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  template_id: mockTemplate.id,
  location_id: mockLocation.id,
  user_id: mockUser.id,
  inspection_date: '2024-01-01',
  inspection_time: '10:00:00',
  overall_status: 'pass' as const,
  responses: {
    q1: true,
    q2: true,
  },
  photo_urls: [],
  notes: 'Test inspection notes',
  duration_seconds: 120,
  geolocation: {
    latitude: -6.2,
    longitude: 106.8,
    accuracy: 10,
  },
  verified_by: null,
  verified_at: null,
  verification_notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

/**
 * Factory functions to create mock data with custom properties
 */
export const createMockLocation = (overrides?: Partial<typeof mockLocation>) => ({
  ...mockLocation,
  ...overrides,
});

export const createMockTemplate = (overrides?: Partial<typeof mockTemplate>) => ({
  ...mockTemplate,
  ...overrides,
});

export const createMockInspection = (overrides?: Partial<typeof mockInspection>) => ({
  ...mockInspection,
  ...overrides,
});

export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
  ...mockUser,
  ...overrides,
});
