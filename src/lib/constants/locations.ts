// Fixed locations.ts
interface Location {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  floor?: string;
  building?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LOCATIONS: Location[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Lobby - Toilet Pria & Wanita',
    floor: '0',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', 
    name: 'Lt. 1 - Toilet Depan Pria & Wanita',
    floor: '1',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Lt. 1 - Toilet Belakang Pria',
    floor: '1', 
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Lt. 1 - Toilet Belakang Wanita',
    floor: '1',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Lt. 2 - Toilet Depan Pria & Wanita', 
    floor: '2',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Lt. 2 - Toilet Belakang Pria',
    floor: '2',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Lt. 2 - Toilet Belakang Wanita',
    floor: '2',
    building: 'Main Building'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Security - Toilet Pria',
    floor: '0',
    building: 'Security Post'
  }
];

export function getLocationById(id: string): Location | null {
  return LOCATIONS.find(location => location.id === id) || null;
}

export function getAllLocations(): Location[] {
  return LOCATIONS;
}
// UUID validation
export function isValidUUID(uuid: string): boolean {
  return uuid.length === 36 && uuid.includes('-');
}

