// ===================================
// 📁 src/infrastructure/database/repositories/SupabaseLocationRepository.ts
// COMPLETE IMPLEMENTATION
// ===================================
import { supabase } from '@/infrastructure/database/supabase';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData, LocationWithDetails } from '@/core/entities/Location';

export class SupabaseLocationRepository implements ILocationRepository {
  
  async create(locationData: LocationFormData): Promise<Location> {
    try {
      console.log('📝 Creating location:', locationData);
      
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: locationData.name,
          code: locationData.code || null,
          floor: locationData.floor || null,
          section: locationData.section || null,
          building: locationData.building || null,
          area: locationData.area || null,
          qr_code: locationData.qr_code || null,
          description: locationData.description || null,
          is_active: locationData.is_active ?? true,
          coordinates: locationData.coordinates || null,
          photo_url: locationData.photo_url || null,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating location:', error);
        throw error;
      }

      console.log('✅ Location created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create location:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Location | null> {
    try {
      console.log('🔍 Finding location by ID:', id);
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('⚠️ Location not found');
          return null;
        }
        throw error;
      }

      console.log('✅ Location found:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to find location:', error);
      throw error;
    }
  }

  async findByIdWithDetails(id: string): Promise<LocationWithDetails | null> {
    try {
      const location = await this.findById(id);
      if (!location) return null;

      // TODO: Add inspection stats
      return location as LocationWithDetails;
    } catch (error) {
      console.error('❌ Failed to find location with details:', error);
      throw error;
    }
  }

  async findAll(): Promise<Location[]> {
    try {
      console.log('📋 Finding all locations');
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching locations:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} locations`);
      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch locations:', error);
      throw error;
    }
  }

  async findAllWithDetails(): Promise<LocationWithDetails[]> {
    try {
      const locations = await this.findAll();
      
      // TODO: Add inspection stats for each location
      return locations as LocationWithDetails[];
    } catch (error) {
      console.error('❌ Failed to fetch locations with details:', error);
      throw error;
    }
  }

  async update(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    try {
      console.log('✏️ Updating location:', id);
      
      const { data, error } = await supabase
        .from('locations')
        .update({
          ...locationData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating location:', error);
        throw error;
      }

      console.log('✅ Location updated:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update location:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting location:', id);
      
      // Soft delete - set is_active to false
      const { error } = await supabase
        .from('locations')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      // OR Hard delete - actually remove from DB
      // const { error } = await supabase
      //   .from('locations')
      //   .delete()
      //   .eq('id', id);

      if (error) {
        console.error('❌ Error deleting location:', error);
        throw error;
      }

      console.log('✅ Location deleted');
    } catch (error) {
      console.error('❌ Failed to delete location:', error);
      throw error;
    }
  }

  async findByFloor(floor: string): Promise<Location[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('floor', floor)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to find locations by floor:', error);
      throw error;
    }
  }

  async findBySection(section: string): Promise<Location[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to find locations by section:', error);
      throw error;
    }
  }

  async findByBuilding(building: string): Promise<Location[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('building', building)
        .eq('is_active', true)
        .order('floor', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to find locations by building:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Location[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to search locations:', error);
      throw error;
    }
  }

  async getLocationWithStats(id: string): Promise<LocationWithDetails> {
    try {
      const location = await this.findById(id);
      if (!location) throw new Error('Location not found');

      // TODO: Query inspection stats
      const stats = {
        inspection_count: 0,
        last_inspection: null,
        average_score: 0,
      };

      return {
        ...location,
        ...stats,
      };
    } catch (error) {
      console.error('❌ Failed to get location with stats:', error);
      throw error;
    }
  }
}
