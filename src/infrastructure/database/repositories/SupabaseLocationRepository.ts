// ===================================
// 📁 src/infrastructure/database/repositories/SupabaseLocationRepository.ts
// ===================================
import { supabase } from '@/infrastructure/database/supabase';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData, LocationWithDetails } from '@/core/entities/Location';
import { Json } from '@/core/types/database.types';

export class SupabaseLocationRepository implements ILocationRepository {
  async create(locationData: LocationFormData): Promise<Location> {
    // Validasi field required
    if (!locationData.name || !locationData.qr_code) {
      throw new Error('Name and QR code are required');
    }

    const { data, error } = await supabase
      .from('locations')
      .insert({
        name: locationData.name,
        code: locationData.code,
        floor: locationData.floor,
        section: locationData.section,
        building: locationData.building,
        area: locationData.area,
        qr_code: locationData.qr_code,
        description: locationData.description,
        is_active: locationData.is_active ?? true,
        coordinates: locationData.coordinates as Json | null,
        photo_url: locationData.photo_url,
        created_by: locationData.created_by,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Location | null> {
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
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
      inspection_stats: {
        total_inspections: totalInspections,
        clean_count: cleanCount,
        dirty_count: dirtyCount,
        needs_work_count: needsWorkCount,
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
    return data || [];
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
        inspection_stats: {
          total_inspections: totalInspections,
          clean_count: cleanCount,
          dirty_count: dirtyCount,
          needs_work_count: needsWorkCount,
        },
      });
    }

    return locationsWithDetails;
  }

  async update(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .update({
        ...locationData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
  }

  async findBySection(section: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('section', section)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  async findByBuilding(building: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('building', building)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
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
    return data || [];
  }

  async getLocationWithStats(id: string): Promise<LocationWithDetails> {
    const locationWithDetails = await this.findByIdWithDetails(id);
    if (!locationWithDetails) throw new Error('Location not found');
    return locationWithDetails;
  }
}
