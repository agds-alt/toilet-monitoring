// src/infrastructure/services/location.service.ts
// ============================================
// LOCATION SERVICE
// ============================================

import { supabase } from '../database/supabase';
import { Location } from '@/core/types/database.types';

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

    return data;
  },

  async getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data;
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

    return data || [];
  },
};
