// ============================================
// 3. CREATE INSPECTION USE CASE - Enhanced Error Logging
// src/core/use-cases/CreateInspection.ts
// ============================================

import { InspectionEntity } from '@/core/entities/Inspection';
import { CreateInspectionDTO } from '@/core/types/interfaces';
import { IInspectionRepository } from '@/core/repositories/IInspectionRepository';
import { IPhotoRepository } from '@/core/repositories/IPhotoRepository';
import { validateAssessments } from '@/lib/constants/assessments';

export class CreateInspectionUseCase {
  constructor(
    private inspectionRepository: IInspectionRepository,
    private photoRepository: IPhotoRepository
  ) {}

  async execute(dto: CreateInspectionDTO): Promise<InspectionEntity> {
    console.log('🚀 ============================================');
    console.log('🚀 STARTING INSPECTION CREATION');
    console.log('🚀 ============================================');
    console.log('User ID:', dto.userId);
    console.log('Location ID:', dto.locationId);
    console.log('Status:', dto.status);
    console.log('Has Photo:', !!dto.photoData);
    console.log('Has Geo Data:', !!dto.geoData);

    try {
      // Step 1: Validate assessments
      console.log('1️⃣ Validating assessments...');
      const validation = validateAssessments(dto.assessments);
      if (!validation.valid) {
        console.error('❌ Validation failed!');
        console.error('Errors:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      console.log('✅ Assessments valid');

      // Step 2: Create inspection entity
      console.log('2️⃣ Creating inspection entity...');
      const inspection = InspectionEntity.create(dto);
      console.log('✅ Entity created:', inspection.id);

      // Step 3: Upload photo if provided
      let photoUrl: string | undefined;
      if (dto.photoData) {
        console.log('3️⃣ Uploading photo...');
        try {
          photoUrl = await this.photoRepository.upload(
            dto.photoData,
            {
              locationId: dto.locationId,
              userId: dto.userId,
              timestamp: new Date().toISOString(),
              gps: dto.geoData
            }
          );
          console.log('✅ Photo uploaded:', photoUrl);
        } catch (photoError: any) {
          console.error('❌ PHOTO UPLOAD FAILED!');
          console.error('Photo Error:', photoError.message);
          // Continue without photo - don't fail entire inspection
          console.log('⚠️ Continuing without photo...');
          photoUrl = undefined;
        }
      } else {
        console.log('3️⃣ No photo to upload');
      }

      // Step 4: Save to database
      console.log('4️⃣ Saving to database...');
      const savedInspection = await this.inspectionRepository.create({
        ...inspection.toJSON(),
        photoUrl
      });
      console.log('✅ Saved to database');

      console.log('🎉 ============================================');
      console.log('🎉 INSPECTION CREATED SUCCESSFULLY!');
      console.log('🎉 ============================================');

      return savedInspection;
    } catch (error: any) {
      console.error('💥 ============================================');
      console.error('💥 INSPECTION CREATION FAILED!');
      console.error('💥 ============================================');
      console.error('Error Type:', error.constructor.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('💥 ============================================');
      throw error;
    }
  }
}
