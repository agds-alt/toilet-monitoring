"use strict";
// ============================================
// 2. SUPABASE INSPECTION REPOSITORY - Enhanced Error Logging
// src/infrastructure/database/repositories/SupabaseInspectionRepository.ts
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseInspectionRepository = void 0;
const supabase_1 = require("../supabase");
const Inspection_1 = require("@/core/entities/Inspection");
class SupabaseInspectionRepository {
    async create(inspection) {
        console.log('💾 Saving inspection to Supabase...');
        console.log('Inspection data:', {
            id: inspection.id,
            userId: inspection.userId,
            locationId: inspection.locationId,
            status: inspection.status,
            hasPhoto: !!inspection.photoUrl
        });
        try {
            const { data, error } = await supabase_1.supabase
                .from('inspections')
                .insert({
                id: inspection.id,
                user_id: inspection.userId,
                location_id: inspection.locationId,
                status: inspection.status,
                assessments: inspection.assessments,
                overall_comment: inspection.overallComment,
                photo_url: inspection.photoUrl,
                photo_metadata: inspection.photoMetadata,
                latitude: inspection.latitude,
                longitude: inspection.longitude
            })
                .select()
                .single();
            if (error) {
                console.error('❌ SUPABASE INSERT ERROR!');
                console.error('Error Code:', error.code);
                console.error('Error Message:', error.message);
                console.error('Error Details:', error.details);
                console.error('Error Hint:', error.hint);
                // Check specific errors
                if (error.code === '23505') {
                    throw new Error('Inspection already exists (duplicate ID)');
                }
                if (error.code === '23503') {
                    throw new Error('Invalid user or location reference');
                }
                if (error.code === 'PGRST301') {
                    throw new Error('Permission denied: Check RLS policies');
                }
                throw new Error(`Failed to create inspection: ${error.message}`);
            }
            console.log('✅ Inspection saved successfully!');
            console.log('Saved ID:', data.id);
            return this.mapToEntity(data);
        }
        catch (error) {
            console.error('❌ CREATE INSPECTION ERROR!');
            console.error('Error:', error);
            throw error;
        }
    }
    async findById(id) {
        console.log('🔍 Finding inspection by ID:', id);
        try {
            const { data, error } = await supabase_1.supabase
                .from('inspections')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('ℹ️ Inspection not found:', id);
                    return null;
                }
                console.error('❌ FIND ERROR:', error);
                throw new Error(`Failed to find inspection: ${error.message}`);
            }
            console.log('✅ Inspection found');
            return this.mapToEntity(data);
        }
        catch (error) {
            console.error('❌ FIND BY ID ERROR:', error);
            throw error;
        }
    }
    async findMany(filters) {
        console.log('🔍 Finding inspections with filters:', filters);
        try {
            let query = supabase_1.supabase
                .from('inspections')
                .select('*')
                .order('created_at', { ascending: false });
            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }
            if (filters.locationId) {
                query = query.eq('location_id', filters.locationId);
            }
            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate.toISOString());
            }
            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate.toISOString());
            }
            if (filters.limit) {
                query = query.limit(filters.limit);
            }
            if (filters.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
            }
            const { data, error } = await query;
            if (error) {
                console.error('❌ FIND MANY ERROR:', error);
                throw new Error(`Failed to find inspections: ${error.message}`);
            }
            console.log(`✅ Found ${data.length} inspections`);
            return data.map(this.mapToEntity);
        }
        catch (error) {
            console.error('❌ FIND MANY ERROR:', error);
            throw error;
        }
    }
    async update(id, data) {
        console.log('✏️ Updating inspection:', id);
        try {
            const { data: updated, error } = await supabase_1.supabase
                .from('inspections')
                .update({
                status: data.status,
                assessments: data.assessments,
                overall_comment: data.overallComment,
                photo_url: data.photoUrl
            })
                .eq('id', id)
                .select()
                .single();
            if (error) {
                console.error('❌ UPDATE ERROR:', error);
                throw new Error(`Failed to update inspection: ${error.message}`);
            }
            console.log('✅ Inspection updated');
            return this.mapToEntity(updated);
        }
        catch (error) {
            console.error('❌ UPDATE ERROR:', error);
            throw error;
        }
    }
    async delete(id) {
        console.log('🗑️ Deleting inspection:', id);
        try {
            const { error } = await supabase_1.supabase
                .from('inspections')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('❌ DELETE ERROR:', error);
                throw new Error(`Failed to delete inspection: ${error.message}`);
            }
            console.log('✅ Inspection deleted');
        }
        catch (error) {
            console.error('❌ DELETE ERROR:', error);
            throw error;
        }
    }
    mapToEntity(data) {
        return new Inspection_1.InspectionEntity(data.id, data.user_id, data.location_id, data.status, data.assessments, new Date(data.created_at), data.overall_comment, data.photo_url, data.photo_metadata, data.latitude, data.longitude);
    }
}
exports.SupabaseInspectionRepository = SupabaseInspectionRepository;
