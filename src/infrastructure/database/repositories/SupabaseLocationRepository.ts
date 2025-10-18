// infrastructure/database/repositories/SupabaseLocationRepository.ts
import { Location, LocationFormData } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { supabase } from '@/infrastructure/database/supabase';

export class SupabaseLocationRepository implements ILocationRepository {
  private tableName = 'locations';

  async findAll(): Promise<Location[]> {
    console.log('🔍 SupabaseLocationRepository - findAll called');
    
    try {
      console.log('🔍 Executing Supabase query...');
      
      const { data: locations, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('floor', { ascending: true })
        .order('section', { ascending: true })
        .order('created_at', { ascending: false });

      console.log('🔍 Supabase query completed:', {
        dataCount: locations?.length || 0,
        error: error?.message || 'No error',
        hasData: !!locations
      });

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Gagal mengambil data lokasi: ${error.message}`);
      }

      console.log('🔍 Returning locations:', locations || []);
      return locations || [];
    } catch (error) {
      console.error('❌ Exception in findAll:', error);
      throw error;
    }
  }

  


  async findAll(): Promise<Location[]> {
    const { data: locations, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('floor', { ascending: true })
      .order('section', { ascending: true });

    if (error) throw new Error(`Failed to fetch locations: ${error.message}`);
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
      throw new Error(`Failed to fetch location: ${error.message}`);
    }

    return location;
  }

  async update(id: string, data: Partial<LocationFormData>): Promise<Location> {
    const { data: location, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update location: ${error.message}`);
    return location;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete location: ${error.message}`);
  }
}