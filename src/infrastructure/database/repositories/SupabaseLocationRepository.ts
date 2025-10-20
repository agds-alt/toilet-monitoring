// src/infrastructure/database/repositories/SupabaseLocationRepository.ts
import { Location } from '@/core/entities/Location';

export interface LocationWithDetails extends Location {
  code: string;
  section: string;
  created_at: string;
  updated_at: string;
  inspection_count?: number;
  last_inspection?: string;
  average_score?: number;
}

export class SupabaseLocationRepository {
  async findById(id: string): Promise<LocationWithDetails | null> {
    try {
      console.log('🔍 Fetching location from database:', id);
      
      // This would be your actual Supabase query
      // For now, we'll use the CSV data structure
      const locationsData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Lobby - Toilet Pria & Wanita',
          code: 'LOBBY',
          floor: '0',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Lt. 1 - Toilet Depan Pria & Wanita', 
          code: 'LT1-DEPAN',
          floor: '1',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Lt. 1 - Toilet Belakang Pria',
          code: 'LT1-BELAKANG',
          floor: '1',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Lt. 1 - Toilet Belakang Wanita',
          code: 'LT2-DEPAN',
          floor: '2',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Lt. 2 - Toilet Depan Pria & Wanita',
          code: 'LT2-BELAKANG',
          floor: '2',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440006',
          name: 'Lt. 2 - Toilet Belakang Pria',
          code: 'LT3-DEPAN',
          floor: '3',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          name: 'Lt. 2 - Toilet Belakang Wanita',
          code: 'LT3-BELAKANG',
          floor: '3',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          name: 'Security - Toilet Pria',
          code: 'SECURITY',
          floor: '0',
          section: 'security',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        }
      ];

      const location = locationsData.find(loc => loc.id === id);
      
      if (!location) {
        console.log('❌ Location not found:', id);
        return null;
      }

      // Add inspection statistics
      const locationWithStats = await this.addInspectionStats(location);
      console.log('✅ Location found:', locationWithStats);
      
      return locationWithStats;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw error;
    }
  }

  async findAll(): Promise<LocationWithDetails[]> {
    try {
      console.log('🔍 Fetching all locations from database');
      
      const locationsData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Lobby - Toilet Pria & Wanita',
          code: 'LOBBY',
          floor: '0',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Lt. 1 - Toilet Depan Pria & Wanita', 
          code: 'LT1-DEPAN',
          floor: '1',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Lt. 1 - Toilet Belakang Pria',
          code: 'LT1-BELAKANG',
          floor: '1',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Lt. 1 - Toilet Belakang Wanita',
          code: 'LT2-DEPAN',
          floor: '2',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Lt. 2 - Toilet Depan Pria & Wanita',
          code: 'LT2-BELAKANG',
          floor: '2',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440006',
          name: 'Lt. 2 - Toilet Belakang Pria',
          code: 'LT3-DEPAN',
          floor: '3',
          section: 'front',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          name: 'Lt. 2 - Toilet Belakang Wanita',
          code: 'LT3-BELAKANG',
          floor: '3',
          section: 'back',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          name: 'Security - Toilet Pria',
          code: 'SECURITY',
          floor: '0',
          section: 'security',
          created_at: '2025-10-18 07:16:44.982+00',
          updated_at: '2025-10-18 07:18:11.355623+00'
        }
      ];

      // Add inspection stats to all locations
      const locationsWithStats = await Promise.all(
        locationsData.map(loc => this.addInspectionStats(loc))
      );

      console.log(`✅ Found ${locationsWithStats.length} locations`);
      return locationsWithStats;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw error;
    }
  }

  private async addInspectionStats(location: any): Promise<LocationWithDetails> {
    // Mock inspection data from your CSV
    const inspectionsData = [
      { location_id: '550e8400-e29b-41d4-a716-446655440001', created_at: '2025-10-18T18:27:16.756Z', assessments: { totalScore: 17, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440001', created_at: '2025-10-18T18:07:34.554Z', assessments: { totalScore: 19, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440001', created_at: '2025-10-18T20:50:10.630Z', assessments: { totalScore: 18, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440001', created_at: '2025-10-18T20:18:23.144Z', assessments: { totalScore: 5, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440002', created_at: '2025-10-18T20:22:19.422Z', assessments: { totalScore: 10, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440003', created_at: '2025-10-18T17:13:15.027851+00', assessments: { totalScore: 7, maxScore: 10 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440003', created_at: '2025-10-18T17:14:21.635915+00', assessments: { totalScore: 7, maxScore: 10 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440003', created_at: '2025-10-18T16:57:42.644181+00', assessments: { totalScore: 16, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440004', created_at: '2025-10-18T20:46:20.849075+00', assessments: { totalScore: 20, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440005', created_at: '2025-10-18T19:51:08.882964+00', assessments: { totalScore: 20, maxScore: 25 } },
      { location_id: '550e8400-e29b-41d4-a716-446655440008', created_at: '2025-10-18T17:17:14.754288+00', assessments: { totalScore: 25, maxScore: 25 } }
    ];

    const locationInspections = inspectionsData.filter(insp => insp.location_id === location.id);
    
    return {
      ...location,
      inspection_count: locationInspections.length,
      last_inspection: locationInspections.length > 0 
        ? locationInspections[locationInspections.length - 1].created_at 
        : null,
      average_score: locationInspections.length > 0
        ? locationInspections.reduce((sum, insp) => {
            const percentage = (insp.assessments.totalScore / insp.assessments.maxScore) * 100;
            return sum + percentage;
          }, 0) / locationInspections.length
        : 0
    };
  }
}