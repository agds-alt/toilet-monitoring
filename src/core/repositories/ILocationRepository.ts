// infrastructure/database/repositories/SupabaseLocationRepository.ts
import { Location, LocationFormData } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { supabase } from '@/infrastructure/database/supabase';

export class SupabaseLocationRepository implements ILocationRepository {
  private tableName = 'locations';

  async create(data: LocationFormData): Promise<Location> {
    const { data: location, error } = await supabase
      .from(this.tableName)
      .insert([
        {
          name: data.name,
          code: data.code,
          floor: data.floor,
          section: data.section,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Gagal membuat lokasi: ${error.message}`);
    }
    
    if (!location) {
      throw new Error('Gagal membuat lokasi: Tidak ada data yang dikembalikan');
    }
    
    return location;
  }

  async findAll(): Promise<Location[]> {
    const { data: locations, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('floor', { ascending: true })
      .order('section', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Gagal mengambil data lokasi: ${error.message}`);
    }

    // Return empty array jika null
    return locations || [];
  }

  async findById(id: string): Promise<Location | null> {
    const { data: location, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase error:', error);
      throw new Error(`Gagal mengambil data lokasi: ${error.message}`);
    }

    return location;
  }

  async update(id: string, data: Partial<LocationFormData>): Promise<Location> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: location, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Gagal mengupdate lokasi: ${error.message}`);
    }
    
    if (!location) {
      throw new Error('Gagal mengupdate lokasi: Tidak ada data yang dikembalikan');
    }
    
    return location;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Gagal menghapus lokasi: ${error.message}`);
    }
  }
}