// ===================================
// 📁 SUPABASE USER REPOSITORY - ENHANCED
// src/infrastructure/database/repositories/SupabaseUserRepository.ts
// ===================================

import { supabase } from '../supabase';
import { IUserRepository } from '@/core/repositories/IUserRepository';
import { User } from '@/core/types/interfaces';
import { UserEntity } from '@/core/entities/User';
import { UserRole } from '@/core/types/enums';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    console.log('🔍 Finding user by ID:', id);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ User not found:', id);
          return null;
        }
        console.error('❌ FIND USER ERROR:', error);
        throw new Error(`Failed to find user: ${error.message}`);
      }

      console.log('✅ User found:', data.full_name);
      return this.mapToEntity(data);
    } catch (error: any) {
      console.error('❌ FIND BY ID ERROR:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    console.log('🔍 Finding user by email:', email);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ User not found with email:', email);
          return null;
        }
        console.error('❌ FIND BY EMAIL ERROR:', error);
        throw new Error(`Failed to find user by email: ${error.message}`);
      }

      console.log('✅ User found by email:', data.full_name);
      return this.mapToEntity(data);
    } catch (error: any) {
      console.error('❌ FIND BY EMAIL ERROR:', error);
      throw error;
    }
  }

  async create(user: User): Promise<UserEntity> {
    console.log('💾 Creating new user...');
    console.log('User data:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });

    try {
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

      if (error) {
        console.error('❌ CREATE USER ERROR!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        
        // Handle specific errors
        if (error.code === '23505') {
          throw new Error('User already exists (duplicate ID or email)');
        }
        if (error.code === 'PGRST301') {
          throw new Error('Permission denied: Check RLS policies');
        }
        
        throw new Error(`Failed to create user: ${error.message}`);
      }

      console.log('✅ User created successfully!');
      console.log('User ID:', data.id);
      return this.mapToEntity(data);
    } catch (error: any) {
      console.error('❌ CREATE USER ERROR:', error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>): Promise<UserEntity> {
    console.log('✏️ Updating user:', id);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          role: userData.role
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ UPDATE USER ERROR:', error);
        throw new Error(`Failed to update user: ${error.message}`);
      }

      console.log('✅ User updated successfully');
      return this.mapToEntity(data);
    } catch (error: any) {
      console.error('❌ UPDATE USER ERROR:', error);
      throw error;
    }
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