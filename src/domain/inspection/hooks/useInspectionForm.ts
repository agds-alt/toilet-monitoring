// src/domain/inspection/hooks/useInspectionForm.ts
// ============================================
// INSPECTION FORM HOOK
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  InspectionFormState,
  InspectionResponses,
  InspectionSettings,
  RatingValue,
  InspectionComponent,
  CreateInspectionDTO,
} from '@/core/types/inspection.types';
import { inspectionService } from '../services/inspection.service';
import {
  validateInspectionForm,
  calculateOverallStatus,
  validatePhotoFile,
} from '@/domain/inspection/utils/validation';
import { VALIDATION_RULES } from '@/core/constants/inspection.constant';

interface UseInspectionFormOptions {
  templateId?: string;
  locationId?: string;
  userId: string;
}

export function useInspectionForm({ templateId, locationId, userId }: UseInspectionFormOptions) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [formState, setFormState] = useState<InspectionFormState>({
    template: null,
    location: null,
    responses: {},
    photos: [],
    notes: '',
    startTime: new Date(),
    settings: {
      uiMode: 'professional',
      photoMode: 'solo',
      locationMode: 'gps',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // LOAD TEMPLATE & LOCATION
  // ============================================

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // Load template
        const template = templateId
          ? await inspectionService.getTemplateById(templateId)
          : await inspectionService.getDefaultTemplate();

        if (!template) {
          throw new Error('Template tidak ditemukan');
        }

        // Load location if provided
        let location = null;
        if (locationId) {
          location = await inspectionService.getLocationById(locationId);
        }

        setFormState((prev) => ({
          ...prev,
          template,
          location,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [templateId, locationId]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const components = useMemo(() => {
    if (!formState.template) return [];
    return ((formState.template.fields as any)?.components || []) as InspectionComponent[];
  }, [formState.template]);

  const requiredComponents = useMemo(() => {
    return components.filter((c) => c.required).map((c) => c.id);
  }, [components]);

  const ratedCount = useMemo(() => {
    return Object.values(formState.responses).filter((r) => r.rating !== null).length;
  }, [formState.responses]);

  const progress = useMemo(() => {
    if (components.length === 0) return 0;
    return Math.round((ratedCount / components.length) * 100);
  }, [ratedCount, components.length]);

  const overallStatus = useMemo(() => {
    return calculateOverallStatus(formState.responses);
  }, [formState.responses]);

  const validation = useMemo(() => {
    if (!formState.template) {
      return {
        isValid: false,
        errors: [{ field: 'template', message: 'Template belum dimuat' }],
        warnings: [],
      };
    }

    const dto: Partial<CreateInspectionDTO> = {
      template_id: formState.template.id,
      location_id: formState.location?.id,
      user_id: userId,
      responses: formState.responses,
      photo_urls: formState.photos.map(() => ''), // placeholder
      notes: formState.notes,
      duration_seconds: Math.floor((Date.now() - formState.startTime.getTime()) / 1000),
    };

    return validateInspectionForm(dto, requiredComponents);
  }, [formState, requiredComponents, userId]);

  // ============================================
  // RATING ACTIONS
  // ============================================

  const setRating = useCallback((componentId: string, rating: RatingValue | null) => {
    setFormState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [componentId]: {
          ...prev.responses[componentId],
          rating,
        },
      },
    }));
  }, []);

  const setComment = useCallback((componentId: string, comment: string) => {
    setFormState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [componentId]: {
          ...prev.responses[componentId],
          comment,
        },
      },
    }));
  }, []);

  const clearComponent = useCallback((componentId: string) => {
    setFormState((prev) => {
      const newResponses = { ...prev.responses };
      delete newResponses[componentId];
      return {
        ...prev,
        responses: newResponses,
      };
    });
  }, []);

  // ============================================
  // PHOTO ACTIONS
  // ============================================

  const addPhotos = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const validation = validatePhotoFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    setFormState((prev) => {
      const newPhotos = [...prev.photos, ...validFiles];
      if (newPhotos.length > VALIDATION_RULES.maxTotalPhotos) {
        setError(
          `Maksimal ${VALIDATION_RULES.maxTotalPhotos} foto. ${newPhotos.length - VALIDATION_RULES.maxTotalPhotos} foto tidak ditambahkan.`
        );
        return {
          ...prev,
          photos: newPhotos.slice(0, VALIDATION_RULES.maxTotalPhotos),
        };
      }
      return {
        ...prev,
        photos: newPhotos,
      };
    });
  }, []);

  const removePhoto = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const clearPhotos = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      photos: [],
    }));
  }, []);

  // ============================================
  // SETTINGS ACTIONS
  // ============================================

  const updateSettings = useCallback((settings: Partial<InspectionSettings>) => {
    setFormState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
    }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setFormState((prev) => ({
      ...prev,
      notes,
    }));
  }, []);

  const setLocation = useCallback((locationId: string) => {
    setIsLoading(true);
    inspectionService
      .getLocationById(locationId)
      .then((location) => {
        setFormState((prev) => ({
          ...prev,
          location,
        }));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // ============================================
  // FORM ACTIONS
  // ============================================

  const reset = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      responses: {},
      photos: [],
      notes: '',
      startTime: new Date(),
    }));
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!validation.isValid) {
      setError(validation.errors.map((e) => e.message).join('\n'));
      return null;
    }

    if (!formState.template || !formState.location) {
      setError('Template atau lokasi belum dipilih');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate temp inspection ID for photo upload
      const tempId = `temp-${Date.now()}`;

      // Upload photos
      const photoUrls =
        formState.photos.length > 0
          ? await inspectionService.uploadPhotos(formState.photos, tempId)
          : [];

      // Prepare DTO
      const now = new Date();
      const dto: CreateInspectionDTO = {
        template_id: formState.template.id,
        location_id: formState.location.id,
        user_id: userId,
        inspection_date: now.toISOString().split('T')[0],
        inspection_time: now.toTimeString().split(' ')[0],
        overall_status: overallStatus,
        responses: formState.responses,
        photo_urls: photoUrls,
        notes: formState.notes || null,
        duration_seconds: Math.floor((Date.now() - formState.startTime.getTime()) / 1000),
        geolocation: null, // TODO: implement GPS
      };

      // Submit
      const result = await inspectionService.createInspection(dto);

      // Reset form after success
      reset();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim inspeksi';
      setError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [validation, formState, userId, overallStatus, reset]);

  // ============================================
  // RETURN VALUES
  // ============================================

  return {
    // State
    formState,
    isLoading,
    isSubmitting,
    error,

    // Computed
    components,
    requiredComponents,
    ratedCount,
    progress,
    overallStatus,
    validation,

    // Actions
    setRating,
    setComment,
    clearComponent,
    addPhotos,
    removePhoto,
    clearPhotos,
    updateSettings,
    setNotes,
    setLocation,
    reset,
    submit,
    clearError: () => setError(null),
  };
}
