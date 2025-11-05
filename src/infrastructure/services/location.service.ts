// src/infrastructure/services/location.service.ts
// ============================================
// LOCATION SERVICE
// ============================================

import { supabase } from '../database/supabase';
import { Location } from '@/domain/entities/Location';

// Mapper to convert database format to domain format
function mapToLocation(dbRecord: any): Location {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    code: dbRecord.code,
    qrCode: dbRecord.qr_code,
    building: dbRecord.building,
    floor: dbRecord.floor,
    area: dbRecord.area,
    section: dbRecord.section,
    description: dbRecord.description,
    photoUrl: dbRecord.photo_url,
    coordinates: dbRecord.coordinates,
    isActive: dbRecord.is_active,
    createdBy: dbRecord.created_by,
    createdAt: new Date(dbRecord.created_at),
    updatedAt: new Date(dbRecord.updated_at),
  };
}

export const locationService = {
  async getLocationByQR(qrCode: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('qr_code', qrCode)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data ? mapToLocation(data) : null;
  },

  async getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data ? mapToLocation(data) : null;
  },

  async getAllLocations(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    return data ? data.map(mapToLocation) : [];
  },
};
