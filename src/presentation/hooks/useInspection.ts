// ============================================
// 4. INSPECTION HOOK - Enhanced Error Logging
// src/presentation/hooks/useInspection.ts
// ============================================

'use client';

import { useState } from 'react';
import { CreateInspectionUseCase } from '@/core/use-cases/CreateInspection';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { CloudinaryPhotoRepository } from '@/infrastructure/storage/CloudinaryPhotoRepository';
import { CreateInspectionDTO } from '@/core/types/interfaces';

export const useInspection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inspectionRepository = new SupabaseInspectionRepository();
  const photoRepository = new CloudinaryPhotoRepository();
  const createInspectionUseCase = new CreateInspectionUseCase(
    inspectionRepository,
    photoRepository
  );

  const createInspection = async (dto: CreateInspectionDTO) => {
    console.log('🎯 useInspection: Starting create inspection');
    setLoading(true);
    setError(null);

    try {
      const inspection = await createInspectionUseCase.execute(dto);
      console.log('✅ useInspection: Success!');
      return inspection;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create inspection';
      console.error('❌ useInspection: Failed!');
      console.error('Error:', errorMessage);
      setError(errorMessage);
      
      // Show user-friendly alert
      alert(`Gagal menyimpan inspeksi:\n${errorMessage}\n\nCek console untuk detail.`);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createInspection, loading, error };
};
