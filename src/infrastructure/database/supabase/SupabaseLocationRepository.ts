// Infrastructure: SupabaseLocationRepository
import { createClient } from '@supabase/supabase-js';
import { LocationEntity } from '../../../domain/entities/Location';
import { ILocationRepository } from '../../../application/interfaces/repositories/ILocationRepository';
import { Database } from '../../../core/types/supabase.types';

export class SupabaseLocationRepository implements ILocationRepository {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async findById(id: string): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findByCode(code: string): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findByQRCode(qrCode: string): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('qr_code', qrCode)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findAll(): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .order('name');

    if (error) throw new Error(`Failed to fetch locations: ${error.message}`);

    return data.map(this.mapToEntity);
  }

  async findByBuilding(building: string): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('building', building)
      .order('name');

    if (error) throw new Error(`Failed to fetch locations by building: ${error.message}`);

    return data.map(this.mapToEntity);
  }

  async findByFloor(floor: string): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('floor', floor)
      .order('name');

    if (error) throw new Error(`Failed to fetch locations by floor: ${error.message}`);

    return data.map(this.mapToEntity);
  }

  async create(location: LocationEntity): Promise<LocationEntity> {
    const { data, error } = await this.supabase
      .from('locations')
      .insert(this.mapToDatabase(location))
      .select()
      .single();

    if (error) throw new Error(`Failed to create location: ${error.message}`);

    return this.mapToEntity(data);
  }

  async update(location: LocationEntity): Promise<LocationEntity> {
    const { data, error } = await this.supabase
      .from('locations')
      .update(this.mapToDatabase(location))
      .eq('id', location.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update location: ${error.message}`);

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete location: ${error.message}`);
  }

  async search(query: string): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%,code.ilike.%${query}%,building.ilike.%${query}%`)
      .order('name');

    if (error) throw new Error(`Failed to search locations: ${error.message}`);

    return data.map(this.mapToEntity);
  }

  private mapToEntity(data: any): LocationEntity {
    return new LocationEntity(
      data.id,
      data.name,
      data.code,
      data.qr_code,
      data.building,
      data.floor,
      data.area,
      data.section,
      data.description,
      data.photo_url,
      data.coordinates,
      data.is_active,
      data.created_by,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  private mapToDatabase(location: LocationEntity): any {
    return {
      id: location.id,
      name: location.name,
      code: location.code,
      qr_code: location.qrCode,
      building: location.building,
      floor: location.floor,
      area: location.area,
      section: location.section,
      description: location.description,
      photo_url: location.photoUrl,
      coordinates: location.coordinates,
      is_active: location.isActive,
      created_by: location.createdBy,
      created_at: location.createdAt.toISOString(),
      updated_at: location.updatedAt.toISOString()
    };
  }
}
