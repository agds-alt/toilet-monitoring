// ===================================
// 📁 src/infrastructure/database/repositories/SupabaseLocationRepository.ts
// ===================================
import { supabase } from '@/infrastructure/database/supabase';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location } from '@/domain/entities/Location';
import type { LocationFormData, LocationWithDetails } from '@/core/repositories/ILocationRepository';
import { Json } from '@/core/types/supabase.types';

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

export class SupabaseLocationRepository implements ILocationRepository {
  async create(locationData: LocationFormData): Promise<Location> {
    // Validasi field required
    if (!locationData.name || !locationData.code) {
      throw new Error('Name and code are required');
    }

    // Generate QR code from code
    const qrCode = `toilet-${locationData.code}-${Date.now()}`;

    const { data, error } = await supabase
      .from('locations')
      .insert({
        name: locationData.name,
        code: locationData.code,
        floor: locationData.floor,
        section: locationData.section,
        building: locationData.building,
        area: locationData.area,
        qr_code: qrCode,
        description: locationData.description,
        is_active: locationData.isActive ?? true,
        coordinates: locationData.coordinates as Json | null,
        photo_url: locationData.photoUrl,
        created_by: locationData.createdBy,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToLocation(data);
  }

  async findById(id: string): Promise<Location | null> {
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? mapToLocation(data) : null;
  }

  async findByIdWithDetails(id: string): Promise<LocationWithDetails | null> {
    const location = await this.findById(id);
    if (!location) return null;

    // Get inspection statistics for this location
    const { data: inspectionStats, error: statsError } = await supabase
      .from('inspection_records')
      .select('overall_status')
      .eq('location_id', id);

    if (statsError) throw statsError;

    const totalInspections = inspectionStats?.length || 0;
    const cleanCount = inspectionStats?.filter((ir) => ir.overall_status === 'clean').length || 0;
    const dirtyCount = inspectionStats?.filter((ir) => ir.overall_status === 'dirty').length || 0;
    const needsWorkCount =
      inspectionStats?.filter((ir) => ir.overall_status === 'needs_work').length || 0;

    return {
      ...location,
      stats: {
        totalInspections: totalInspections,
        averageRating: totalInspections > 0 ? cleanCount / totalInspections : 0,
      },
    };
  }

  async findAll(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map(mapToLocation) : [];
  }

  async findAllWithDetails(): Promise<LocationWithDetails[]> {
    const locations = await this.findAll();
    const locationsWithDetails: LocationWithDetails[] = [];

    for (const location of locations) {
      const { data: inspectionStats, error: statsError } = await supabase
        .from('inspection_records')
        .select('overall_status')
        .eq('location_id', location.id);

      if (statsError) throw statsError;

      const totalInspections = inspectionStats?.length || 0;
      const cleanCount = inspectionStats?.filter((ir) => ir.overall_status === 'clean').length || 0;
      const dirtyCount = inspectionStats?.filter((ir) => ir.overall_status === 'dirty').length || 0;
      const needsWorkCount =
        inspectionStats?.filter((ir) => ir.overall_status === 'needs_work').length || 0;

      locationsWithDetails.push({
        ...location,
        stats: {
          totalInspections: totalInspections,
          averageRating: totalInspections > 0 ? cleanCount / totalInspections : 0,
        },
      });
    }

    return locationsWithDetails;
  }

  async update(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    // Convert camelCase to snake_case
    const dbData: any = {};
    if (locationData.name) dbData.name = locationData.name;
    if (locationData.code) dbData.code = locationData.code;
    if (locationData.floor) dbData.floor = locationData.floor;
    if (locationData.section) dbData.section = locationData.section;
    if (locationData.building) dbData.building = locationData.building;
    if (locationData.area) dbData.area = locationData.area;
    if (locationData.description) dbData.description = locationData.description;
    if (locationData.photoUrl !== undefined) dbData.photo_url = locationData.photoUrl;
    if (locationData.isActive !== undefined) dbData.is_active = locationData.isActive;
    if (locationData.coordinates) dbData.coordinates = locationData.coordinates;

    const { data, error } = await supabase
      .from('locations')
      .update({
        ...dbData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToLocation(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('locations')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  }

  async findByFloor(floor: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('floor', floor)
      .eq('is_active', true);

    if (error) throw error;
    return data ? data.map(mapToLocation) : [];
  }

  async findBySection(section: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('section', section)
      .eq('is_active', true);

    if (error) throw error;
    return data ? data.map(mapToLocation) : [];
  }

  async findByBuilding(building: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('building', building)
      .eq('is_active', true);

    if (error) throw error;
    return data ? data.map(mapToLocation) : [];
  }

  async search(query: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .or(
        `name.ilike.%${query}%,code.ilike.%${query}%,building.ilike.%${query}%,floor.ilike.%${query}%`
      )
      .eq('is_active', true);

    if (error) throw error;
    return data ? data.map(mapToLocation) : [];
  }

  async getLocationWithStats(id: string): Promise<LocationWithDetails> {
    const locationWithDetails = await this.findByIdWithDetails(id);
    if (!locationWithDetails) throw new Error('Location not found');
    return locationWithDetails;
  }
}
