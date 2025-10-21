// 📁 src/infrastructure/database/repositories/SupabaseUserRepository.ts
import { supabase } from '@/infrastructure/database/supabase';
import { IUserRepository } from '@/core/repositories/IUserRepository';
import { User, UserWithRoles } from '@/core/entities/User';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        full_name: userData.full_name,
        password_hash: userData.password_hash,
        phone: userData.phone,
        profile_photo_url: userData.profile_photo_url,
        is_active: userData.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
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
      .from('users')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
    const user = await this.findById(userId);
    if (!user) return null;

    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select(`
        role:roles (
          id,
          name,
          display_name,
          level,
          color
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const roles = userRoles?.map(ur => ur.role) || [];

    return {
      ...user,
      roles
    };
  }

  async updateLastLogin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ 
        last_login_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) throw error;
  }
}