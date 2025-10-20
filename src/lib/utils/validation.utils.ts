// src/lib/utils/validation.utils.ts
// ============================================
// VALIDATION UTILITIES (SOFT VALIDATION)
// ============================================

import {
  ComponentResponse,
  ValidationResult,
  ValidationError,
  InspectionFormData,
} from '@/core/types/inspection.types';
import { VALIDATION_RULES } from '@/lib/constants/inspection.constants';

// ============================================
// VALIDATE INSPECTION FORM
// ============================================

export function validateInspectionForm(
  data: Partial<InspectionFormData>,
  totalComponents: number
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check required fields (HARD VALIDATION)
  if (!data.template_id) {
    errors.push({
      field: 'template_id',
      message: 'Template is required',
      severity: 'error',
    });
  }

  if (!data.location_id) {
    errors.push({
      field: 'location_id',
      message: 'Location is required',
      severity: 'error',
    });
  }

  if (!data.user_id) {
    errors.push({
      field: 'user_id',
      message: 'User is required',
      severity: 'error',
    });
  }

  // Check responses (SOFT VALIDATION - just warnings)
  if (data.responses) {
    const ratedCount = Object.values(data.responses).filter(
      (r) => r.rating !== undefined
    ).length;

    // Warning if less than minimum rated components
    if (ratedCount < VALIDATION_RULES.minRatedComponents) {
      warnings.push({
        field: 'responses',
        message: `Sebaiknya nilai minimal ${VALIDATION_RULES.minRatedComponents} komponen (saat ini: ${ratedCount})`,
        severity: 'warning',
      });
    }

    // Warning if no components rated at all
    if (ratedCount === 0) {
      errors.push({
        field: 'responses',
        message: 'Minimal 1 komponen harus dinilai',
        severity: 'error',
      });
    }

    // Warning for low ratings without comments (optional)
    Object.entries(data.responses).forEach(([componentId, response]) => {
      if (response.rating && response.rating <= 2 && !response.comment) {
        warnings.push({
          field: componentId,
          message: `Komponen ${componentId}: rating rendah, pertimbangkan untuk menambahkan komentar`,
          severity: 'warning',
        });
      }
    });
  } else {
    errors.push({
      field: 'responses',
      message: 'Responses are required',
      severity: 'error',
    });
  }

  // Check notes length (SOFT)
  if (data.notes && data.notes.length > VALIDATION_RULES.maxNoteLength) {
    warnings.push({
      field: 'notes',
      message: `Catatan terlalu panjang (max: ${VALIDATION_RULES.maxNoteLength} karakter)`,
      severity: 'warning',
    });
  }

  // Photo validation (SOFT - just warning)
  if (VALIDATION_RULES.requirePhotos && (!data.photo_urls || data.photo_urls.length === 0)) {
    warnings.push({
      field: 'photos',
      message: 'Disarankan untuk menambahkan foto dokumentasi',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// VALIDATE COMPONENT RESPONSE
// ============================================

export function validateComponentResponse(
  response: Partial<ComponentResponse>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Rating is required
  if (!response.rating) {
    errors.push({
      field: 'rating',
      message: 'Rating is required',
      severity: 'error',
    });
  }

  // Rating must be 1-5
  if (response.rating && (response.rating < 1 || response.rating > 5)) {
    errors.push({
      field: 'rating',
      message: 'Rating must be between 1 and 5',
      severity: 'error',
    });
  }

  // Warning for low ratings without comment
  if (response.rating && response.rating <= 2 && !response.comment) {
    warnings.push({
      field: 'comment',
      message: 'Pertimbangkan untuk menambahkan komentar untuk rating rendah',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// VALIDATE PHOTO FILE
// ============================================

export function validatePhotoFile(file: File): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push({
      field: 'file',
      message: `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`,
      severity: 'error',
    });
  }

  // Check file type
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!acceptedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: 'Format file tidak didukung. Gunakan JPEG, PNG, atau WebP',
      severity: 'error',
    });
  }

  // Warning for large files
  const warnSize = 5 * 1024 * 1024; // 5MB
  if (file.size > warnSize && file.size <= maxSize) {
    warnings.push({
      field: 'file',
      message: 'File cukup besar, upload mungkin memakan waktu',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// CHECK CAN SUBMIT
// ============================================

export function canSubmitInspection(
  data: Partial<InspectionFormData>,
  totalComponents: number
): boolean {
  const validation = validateInspectionForm(data, totalComponents);
  
  // Can submit if no ERRORS (warnings are okay)
  return validation.errors.length === 0;
}

// ============================================
// GET VALIDATION SUMMARY
// ============================================

export function getValidationSummary(validation: ValidationResult): string {
  if (validation.isValid && validation.warnings.length === 0) {
    return 'Semua validasi berhasil ✓';
  }

  if (!validation.isValid) {
    return `${validation.errors.length} error ditemukan`;
  }

  return `${validation.warnings.length} peringatan`;
}

// ============================================
// FORMAT VALIDATION MESSAGE
// ============================================

export function formatValidationMessage(error: ValidationError): string {
  return `${error.field}: ${error.message}`;
}

// ============================================
// SANITIZE INPUT
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .substring(0, 1000);
}

// ============================================
// VALIDATE GEOLOCATION DATA
// ============================================

export function validateGeolocation(
  lat: number,
  lng: number
): ValidationResult {
  const errors: ValidationError[] = [];

  if (lat < -90 || lat > 90) {
    errors.push({
      field: 'latitude',
      message: 'Invalid latitude',
      severity: 'error',
    });
  }

  if (lng < -180 || lng > 180) {
    errors.push({
      field: 'longitude',
      message: 'Invalid longitude',
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
}