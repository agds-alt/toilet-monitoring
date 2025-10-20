// src/infrastructure/services/location.service.ts
// ============================================
// LOCATION SERVICE
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import { LocationData } from '@/core/types/inspection.types';

// ============================================
// LOCATION SERVICE CLASS
// ============================================

export class LocationService {
  // ============================================
  // GET LOCATION BY ID
  // ============================================

  async getLocationById(id: string): Promise<LocationData | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as LocationData;
    } catch (error) {
      console.error('❌ Get location by ID error:', error);
      return null;
    }
  }

  // ============================================
  // GET LOCATION BY QR CODE
  // ============================================

  async getLocationByQR(qrCode: string): Promise<LocationData | null> {
    try {
      console.log('🔍 Searching location by QR:', qrCode);

      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('qr_code', qrCode)
        .single();

      if (error) {
        console.error('❌ Location not found:', error);
        throw error;
      }

      console.log('✅ Location found:', data.name);
      return data as LocationData;
    } catch (error) {
      console.error('❌ Get location by QR error:', error);
      return null;
    }
  }

  // ============================================
  // GET ALL ACTIVE LOCATIONS
  // ============================================

  async getActiveLocations(): Promise<LocationData[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data as LocationData[]) || [];
    } catch (error) {
      console.error('❌ Get active locations error:', error);
      return [];
    }
  }

  // ============================================
  // GET LOCATIONS BY BUILDING
  // ============================================

  async getLocationsByBuilding(building: string): Promise<LocationData[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('building', building)
        .eq('is_active', true)
        .order('floor', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return (data as LocationData[]) || [];
    } catch (error) {
      console.error('❌ Get locations by building error:', error);
      return [];
    }
  }

  // ============================================
  // CREATE LOCATION
  // ============================================

  async createLocation(
    location: Omit<LocationData, 'id'>
  ): Promise<LocationData | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: location.name,
          address: location.address,
          city: location.city || null,
          postal_code: location.postal_code || null,
          floor: location.floor || null,
          building: location.building || null,
          qr_code: location.qr_code || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Location created:', data.id);
      return data as LocationData;
    } catch (error) {
      console.error('❌ Create location error:', error);
      return null;
    }
  }

  // ============================================
  // UPDATE LOCATION
  // ============================================

  async updateLocation(
    id: string,
    updates: Partial<LocationData>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Location updated:', id);
      return true;
    } catch (error) {
      console.error('❌ Update location error:', error);
      return false;
    }
  }

  // ============================================
  // DELETE LOCATION (soft delete)
  // ============================================

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Location deleted (soft):', id);
      return true;
    } catch (error) {
      console.error('❌ Delete location error:', error);
      return false;
    }
  }

  // ============================================
  // SEARCH LOCATIONS
  // ============================================

  async searchLocations(query: string): Promise<LocationData[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%,building.ilike.%${query}%`)
        .eq('is_active', true)
        .order('name', { ascending: true })
        .limit(10);

      if (error) throw error;

      return (data as LocationData[]) || [];
    } catch (error) {
      console.error('❌ Search locations error:', error);
      return [];
    }
  }

  // ============================================
  // GET LOCATION STATISTICS
  // ============================================

  async getLocationStats(locationId: string): Promise<{
    totalInspections: number;
    lastInspection: string | null;
    avgRating: number;
    statusBreakdown: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('location_id', locationId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const inspections = data || [];

      if (inspections.length === 0) {
        return {
          totalInspections: 0,
          lastInspection: null,
          avgRating: 0,
          statusBreakdown: {},
        };
      }

      // Calculate statistics
      const statusBreakdown: Record<string, number> = {};
      let totalRating = 0;

      inspections.forEach((inspection) => {
        statusBreakdown[inspection.overall_status] =
          (statusBreakdown[inspection.overall_status] || 0) + 1;

        // Calculate rating from responses
        const ratings = Object.values(inspection.responses).map(
          (r: any) => r.rating
        );
        const avg = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
        totalRating += avg;
      });

      return {
        totalInspections: inspections.length,
        lastInspection: inspections[0].submitted_at,
        avgRating: totalRating / inspections.length,
        statusBreakdown,
      };
    } catch (error) {
      console.error('❌ Get location stats error:', error);
      return {
        totalInspections: 0,
        lastInspection: null,
        avgRating: 0,
        statusBreakdown: {},
      };
    }
  }

  // ============================================
  // FORMAT LOCATION ADDRESS
  // ============================================

  formatLocationAddress(location: LocationData): string {
    const parts: string[] = [location.address];

    if (location.floor) parts.push(`Lantai ${location.floor}`);
    if (location.building) parts.push(location.building);
    if (location.city) parts.push(location.city);
    if (location.postal_code) parts.push(location.postal_code);

    return parts.join(', ');
  }

  // ============================================
  // VALIDATE QR CODE FORMAT
  // ============================================

  validateQRCode(qrCode: string): boolean {
    // Example format: LOC-XXXX-XXXX or UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const customRegex = /^LOC-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;

    return uuidRegex.test(qrCode) || customRegex.test(qrCode);
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const locationService = new LocationService();