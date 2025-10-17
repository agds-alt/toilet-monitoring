// src/lib/constants/locations.ts
import { Location } from '@/core/types/interfaces';

export const LOCATIONS: Location[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // ✅ UUID format
    name: 'Toilet Lobby',
    code: 'LOBBY',
    floor: 0,
    section: 'front'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Toilet Lt 1 Depan',
    code: 'LT1-DEPAN',
    floor: 1,
    section: 'front'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Toilet Lt 1 Belakang',
    code: 'LT1-BELAKANG',
    floor: 1,
    section: 'back'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Toilet Lt 2 Depan',
    code: 'LT2-DEPAN',
    floor: 2,
    section: 'front'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Toilet Lt 2 Belakang',
    code: 'LT2-BELAKANG',
    floor: 2,
    section: 'back'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Toilet Lt 3 Depan',
    code: 'LT3-DEPAN',
    floor: 3,
    section: 'front'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Toilet Lt 3 Belakang',
    code: 'LT3-BELAKANG',
    floor: 3,
    section: 'back'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Toilet Security',
    code: 'SECURITY',
    floor: 0,
    section: 'security'
  }
];

export const getLocationByCode = (code: string): Location | undefined => {
  return LOCATIONS.find(loc => loc.code === code);
};

export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS.find(loc => loc.id === id);
};

export const searchLocations = (query: string): Location[] => {
  const lowerQuery = query.toLowerCase();
  return LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(lowerQuery) ||
    loc.code.toLowerCase().includes(lowerQuery)
  );
};