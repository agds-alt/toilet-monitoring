// src/core/types/location.types.ts
// ============================================
// LOCATION DOMAIN TYPES
// ============================================

import { Location, LocationInsert, LocationUpdate } from './database.types';

export type { Location, LocationInsert, LocationUpdate };

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationFilters {
  building?: string;
  floor?: string;
  area?: string;
  section?: string;
  isActive?: boolean;
  searchTerm?: string;
}

export interface BulkLocationData {
  name: string;
  code?: string;
  building?: string;
  floor?: string;
  area?: string;
  section?: string;
  description?: string;
}

export interface LocationStats {
  totalInspections: number;
  cleanCount: number;
  needsWorkCount: number;
  dirtyCount: number;
  averageScore: number;
  lastInspectionDate: string | null;
}
