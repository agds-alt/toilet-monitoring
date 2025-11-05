// src/domain/inspection/utils/validation.ts
// ============================================
// INSPECTION VALIDATION UTILITIES
// ============================================

import {
  CreateInspectionDTO,
  InspectionResponses,
  InspectionValidation,
  RatingValue,
} from '@/core/types/inspection.types';
import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  RATING_VALUES,
} from '@/lib/constants/inspection.constants';

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate rating value
 */
export function isValidRating(rating: unknown): rating is RatingValue {
  return RATING_VALUES.includes(rating as RatingValue);
}

/**
 * Validate photo file
 */
export function validatePhotoFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File harus berupa gambar',
    };
  }

  // Check file size
  if (file.size > VALIDATION_RULES.maxPhotoSize) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PHOTO_SIZE,
    };
  }

  return { isValid: true };
}

/**
 * Validate inspection responses
 */
export function validateResponses(
  responses: InspectionResponses,
  requiredComponents: string[]
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ratedCount = Object.values(responses).filter((r) => r.rating !== null).length;

  // Check minimum rated components
  if (ratedCount < VALIDATION_RULES.minRatedComponents) {
    errors.push(ERROR_MESSAGES.MIN_COMPONENTS);
  }

  // Check required components
  requiredComponents.forEach((componentId) => {
    const response = responses[componentId];
    if (!response || response.rating === null) {
      errors.push(`Komponen "${componentId}" wajib diisi`);
    }
  });

  // Validate each rating value
  Object.entries(responses).forEach(([componentId, response]) => {
    if (response.rating && !isValidRating(response.rating)) {
      errors.push(`Rating untuk "${componentId}" tidak valid`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate overall status from responses
 */
export function calculateOverallStatus(responses: InspectionResponses): string {
  const ratings = Object.values(responses)
    .map((r) => r.rating)
    .filter((r): r is RatingValue => r !== null);

  if (ratings.length === 0) return 'needs_work';

  const ratingScores: Record<string, number> = {
    clean: 3,
    needs_work: 2,
    dirty: 1,
  };

  const totalScore = ratings.reduce((sum, rating) => sum + ratingScores[rating], 0);
  const avgScore = totalScore / ratings.length;

  if (avgScore >= 2.5) return 'clean';
  if (avgScore >= 1.5) return 'needs_work';
  return 'dirty';
}

/**
 * Validate complete inspection form
 */
export function validateInspectionForm(
  dto: Partial<CreateInspectionDTO>,
  requiredComponents: string[]
): InspectionValidation {
  const errors: { field: string; message: string }[] = [];
  const warnings: { field: string; message: string }[] = [];

  // Required fields
  VALIDATION_RULES.requiredFields.forEach((field) => {
    if (!dto[field as keyof CreateInspectionDTO]) {
      errors.push({
        field,
        message: ERROR_MESSAGES.REQUIRED_FIELD,
      });
    }
  });

  // Validate responses
  if (dto.responses) {
    const responseValidation = validateResponses(dto.responses as unknown as InspectionResponses, requiredComponents);
    if (!responseValidation.isValid) {
      responseValidation.errors.forEach((error) => {
        errors.push({
          field: 'responses',
          message: error,
        });
      });
    }
  } else {
    errors.push({
      field: 'responses',
      message: 'Tidak ada komponen yang diisi',
    });
  }

  // Validate photos
  if (dto.photo_urls && dto.photo_urls.length > VALIDATION_RULES.maxTotalPhotos) {
    errors.push({
      field: 'photo_urls',
      message: ERROR_MESSAGES.MAX_PHOTOS,
    });
  }

  // Validate notes length
  if (dto.notes && dto.notes.length > VALIDATION_RULES.maxNotesLength) {
    errors.push({
      field: 'notes',
      message: ERROR_MESSAGES.NOTES_LENGTH,
    });
  }

  // Validate duration
  if (dto.duration_seconds && dto.duration_seconds < VALIDATION_RULES.minDurationSeconds) {
    warnings.push({
      field: 'duration_seconds',
      message: 'Inspeksi terlalu cepat, pastikan sudah lengkap',
    });
  }

  // Warning if no photos
  if (!dto.photo_urls || dto.photo_urls.length === 0) {
    warnings.push({
      field: 'photo_urls',
      message: 'Tidak ada foto dilampirkan',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize notes input
 */
export function sanitizeNotes(notes: string): string {
  return notes.trim().slice(0, VALIDATION_RULES.maxNotesLength).replace(/\s+/g, ' ');
}

/**
 * Get validation summary message
 */
export function getValidationSummary(validation: InspectionValidation): string {
  if (validation.isValid) {
    if (validation.warnings.length > 0) {
      return `✓ Form valid dengan ${validation.warnings.length} peringatan`;
    }
    return '✓ Form valid dan siap dikirim';
  }

  return `✗ ${validation.errors.length} error ditemukan`;
}
