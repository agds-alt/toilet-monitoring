// ===================================
// 📁 src/infrastructure/database/repositories/SupabaseLocationRepository.ts (UPDATE)
// ===================================
import { supabase } from '@/infrastructure/database/supabase';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData, LocationWithDetails } from '@/core/entities/Location';

export class SupabaseLocationRepository implements ILocationRepository {
  async create(locationData: LocationFormData): Promise<Location> {
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
        coordinates: locationData.coordinates,
        photo_url: locationData.photo_url,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async findByIdWithDetails(id: string): Promise<LocationWithDetails | null> {
    // Implementation with inspection stats
    const location = await this.findById(id);
    if (!location) return null;

    // Add stats logic here
    return location as LocationWithDetails;
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
    return locations as LocationWithDetails[];
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
      .delete()
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
      .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  async getLocationWithStats(id: string): Promise<LocationWithDetails> {
    const location = await this.findById(id);
    if (!location) throw new Error('Location not found');

    // Add inspection stats
    return location as LocationWithDetails;
  }
}