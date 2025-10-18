"use strict";
// ===================================
// 📁 6. src/infrastructure/database/repositories/SupabaseUserRepository.ts
// ===================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseUserRepository = void 0;
const supabase_1 = require("../supabase");
const User_1 = require("@/core/entities/User");
class SupabaseUserRepository {
    async findById(id) {
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null;
            throw new Error(`Failed to find user: ${error.message}`);
        }
        return this.mapToEntity(data);
    }
    async findByEmail(email) {
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null;
            throw new Error(`Failed to find user: ${error.message}`);
        }
        return this.mapToEntity(data);
    }
    async create(user) {
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .insert({
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            role: user.role
        })
            .select()
            .single();
        if (error)
            throw new Error(`Failed to create user: ${error.message}`);
        return this.mapToEntity(data);
    }
    async update(id, userData) {
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .update({
            full_name: userData.fullName,
            role: userData.role
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(`Failed to update user: ${error.message}`);
        return this.mapToEntity(data);
    }
    mapToEntity(data) {
        return new User_1.UserEntity(data.id, data.email, data.full_name, data.role, new Date(data.created_at));
    }
}
exports.SupabaseUserRepository = SupabaseUserRepository;
// ============================================================================
// END REPOSITORY
// ============================================================================
