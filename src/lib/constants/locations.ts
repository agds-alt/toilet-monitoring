// src/lib/constants/locations.ts
import { Location } from '@/core/types/interfaces';

export const LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Toilet Lobby',
    code: 'LOBBY',
    floor: 0,
    section: 'front'
  },
  {
    id: '2',
    name: 'Toilet Lt 1 Depan',
    code: 'LT1-DEPAN',
    floor: 1,
    section: 'front'
  },
  {
    id: '3',
    name: 'Toilet Lt 1 Belakang',
    code: 'LT1-BELAKANG',
    floor: 1,
    section: 'back'
  },
  {
    id: '4',
    name: 'Toilet Lt 2 Depan',
    code: 'LT2-DEPAN',
    floor: 2,
    section: 'front'
  },
  {
    id: '5',
    name: 'Toilet Lt 2 Belakang',
    code: 'LT2-BELAKANG',
    floor: 2,
    section: 'back'
  },
  {
    id: '6',
    name: 'Toilet Lt 3 Depan',
    code: 'LT3-DEPAN',
    floor: 3,
    section: 'front'
  },
  {
    id: '7',
    name: 'Toilet Lt 3 Belakang',
    code: 'LT3-BELAKANG',
    floor: 3,
    section: 'back'
  },
  {
    id: '8',
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
