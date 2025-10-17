// ===================================
// 📁 6. src/infrastructure/database/repositories/SupabaseUserRepository.ts
// ===================================

import { supabase } from '../supabase';
import { IUserRepository } from '@/core/repositories/IUserRepository';
import { User } from '@/core/types/interfaces';
import { UserEntity } from '@/core/entities/User';
import { UserRole } from '@/core/types/enums';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return this.mapToEntity(data);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return this.mapToEntity(data);
  }

  async create(user: User): Promise<UserEntity> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);

    return this.mapToEntity(data);
  }

  async update(id: string, userData: Partial<User>): Promise<UserEntity> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.fullName,
        role: userData.role
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);

    return this.mapToEntity(data);
  }

  private mapToEntity(data: any): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.full_name,
      data.role as UserRole,
      new Date(data.created_at)
    );
  }
}
// ============================================================================
// END REPOSITORY
// ============================================================================