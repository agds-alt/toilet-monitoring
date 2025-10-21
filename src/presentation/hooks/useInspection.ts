// src/presentation/hooks/useInspection.ts
// ============================================
// MAIN INSPECTION HOOK - ORCHESTRATOR
// ============================================

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UIMode,
  PhotoMode,
  LocationMode,
  ComponentResponse,
  InspectionFormState,
  InspectionFormData,
  InspectionDraft,
  PhotoUploadItem,
  UseInspectionReturn,
} from '@/core/types/inspection.types';
import { useTimer } from './useTimer';
import { usePhotoUpload } from './usePhotoUpload';
import { useGeolocation } from './useGeolocation';
import { inspectionService } from '@/infrastructure/services/inspection.service';
import { templateService } from '@/infrastructure/services/template.service';
import { locationService } from '@/infrastructure/services/location.service';
import { calculateOverallStatus, getCompletionPercentage } from '@/lib/utils/rating.utils';
import { canSubmitInspection, validateInspectionForm } from '@/lib/utils/validation.utils';
import { DRAFT_CONFIG } from '@/lib/constants/inspection.constants';

export function useInspection(
  templateId?: string,
  locationId?: string,
  userId?: string
): UseInspectionReturn {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [state, setState] = useState<InspectionFormState>({
    template: null,
    location: null,
    responses: {},
    photos: [],
    pendingPhotos: [],
    geolocation: null,
    notes: '',
    startTime: null,
    uiState: {
      uiMode: 'professional',
      photoMode: 'solo',
      locationMode: 'qr',
      currentStep: 1,
      totalSteps: 1,
      isSubmitting: false,
      isDraft: false,
    },
  });

  // ============================================
  // HOOKS
  // ============================================

  const timer = useTimer(false);
  const photoUpload = usePhotoUpload();
  const geolocationHook = useGeolocation();

  // ============================================
  // LOAD TEMPLATE
  // ============================================

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        if (templateId) {
          const template = await templateService.getTemplateById(templateId);
          if (template) {
            setState((prev) => ({
              ...prev,
              template,
              uiState: {
                ...prev.uiState,
                totalSteps: template.fields.components.length,
              },
            }));
          }
        } else {
          // Load default template
          const defaultTemplate = await templateService.getDefaultTemplate();
          if (defaultTemplate) {
            setState((prev) => ({
              ...prev,
              template: defaultTemplate,
              uiState: {
                ...prev.uiState,
                totalSteps: defaultTemplate.fields.components.length,
              },
            }));
          }
        }
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };

    loadTemplate();
  }, [templateId]);

  // ============================================
  // LOAD LOCATION
  // ============================================

  useEffect(() => {
    const loadLocation = async () => {
      try {
        if (locationId) {
          const location = await locationService.getLocationById(locationId);
          if (location) {
            setState((prev) => ({ ...prev, location }));
          }
        }
      } catch (error) {
        console.error('Error loading location:', error);
      }
    };

    loadLocation();
  }, [locationId]);

  // ============================================
  // AUTO-SAVE DRAFT
  // ============================================

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (state.uiState.isDraft && Object.keys(state.responses).length > 0) {
        saveDraft();
      }
    }, DRAFT_CONFIG.autoSaveInterval);

    return () => clearInterval(autoSave);
  }, [state]);

  // ============================================
  // START INSPECTION (start timer)
  // ============================================

  useEffect(() => {
    if (state.template && !state.startTime) {
      setState((prev) => ({
        ...prev,
        startTime: Date.now(),
      }));
      timer.startTimer();
    }
  }, [state.template]);

  // ============================================
  // UI MODE SETTERS
  // ============================================

  const setUIMode = useCallback((mode: UIMode) => {
    setState((prev) => ({
      ...prev,
      uiState: { ...prev.uiState, uiMode: mode },
    }));
    localStorage.setItem('inspection-ui-mode', mode);
  }, []);

  const setPhotoMode = useCallback((mode: PhotoMode) => {
    setState((prev) => ({
      ...prev,
      uiState: { ...prev.uiState, photoMode: mode },
    }));
  }, []);

  const setLocationMode = useCallback((mode: LocationMode) => {
    setState((prev) => ({
      ...prev,
      uiState: { ...prev.uiState, locationMode: mode },
    }));
  }, []);

  // ============================================
  // UPDATE RESPONSE
  // ============================================

  const updateResponse = useCallback(
    (componentId: string, response: Partial<ComponentResponse>) => {
      setState((prev) => ({
        ...prev,
        responses: {
          ...prev.responses,
          [componentId]: {
            ...prev.responses[componentId],
            ...response,
            timestamp: new Date().toISOString(),
          },
        },
        uiState: { ...prev.uiState, isDraft: true },
      }));
    },
    []
  );

  // ============================================
  // PHOTO MANAGEMENT
  // ============================================

  const addPhoto = useCallback((photo: PhotoUploadItem) => {
    setState((prev) => ({
      ...prev,
      pendingPhotos: [...prev.pendingPhotos, photo],
      uiState: { ...prev.uiState, isDraft: true },
    }));
  }, []);

  const removePhoto = useCallback((photoId: string) => {
    setState((prev) => ({
      ...prev,
      pendingPhotos: prev.pendingPhotos.filter((p) => p.file.name !== photoId),
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  }, []);

  // ============================================
  // NOTES
  // ============================================

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({
      ...prev,
      notes,
      uiState: { ...prev.uiState, isDraft: true },
    }));
  }, []);

  // ============================================
  // LOCATION
  // ============================================

  const fetchLocationFromQR = useCallback(async (qrData: string) => {
    const location = await locationService.getLocationByQR(qrData);
    if (location) {
      setState((prev) => ({ ...prev, location }));
    }
  }, []);

  const getCurrentGeolocation = useCallback(async () => {
    const geo = await geolocationHook.getLocation();
    if (geo) {
      setState((prev) => ({ ...prev, geolocation: geo }));
    }
  }, [geolocationHook]);

  // ============================================
  // DRAFT MANAGEMENT
  // ============================================

  const saveDraft = useCallback(() => {
    if (!state.template || !state.location) return;

    const draft: InspectionDraft = {
      id: `draft-${Date.now()}`,
      template_id: state.template.id,
      location_id: state.location.id,
      responses: state.responses,
      photos: state.pendingPhotos,
      notes: state.notes,
      geolocation: state.geolocation || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + DRAFT_CONFIG.expiryHours * 60 * 60 * 1000).toISOString(),
    };

    const drafts = JSON.parse(localStorage.getItem(DRAFT_CONFIG.storageKey) || '[]');
    drafts.push(draft);

    // Keep only latest 5 drafts
    if (drafts.length > DRAFT_CONFIG.maxDrafts) {
      drafts.shift();
    }

    localStorage.setItem(DRAFT_CONFIG.storageKey, JSON.stringify(drafts));
    console.log('💾 Draft saved');
  }, [state]);

  const loadDraft = useCallback((draftId: string) => {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_CONFIG.storageKey) || '[]');
    const draft = drafts.find((d: InspectionDraft) => d.id === draftId);

    if (draft) {
      setState((prev) => ({
        ...prev,
        responses: draft.responses,
        pendingPhotos: draft.photos,
        notes: draft.notes,
        geolocation: draft.geolocation || null,
        uiState: { ...prev.uiState, isDraft: true },
      }));
      console.log('📂 Draft loaded');
    }
  }, []);

  const deleteDraft = useCallback((draftId: string) => {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_CONFIG.storageKey) || '[]');
    const filtered = drafts.filter((d: InspectionDraft) => d.id !== draftId);
    localStorage.setItem(DRAFT_CONFIG.storageKey, JSON.stringify(filtered));
    console.log('🗑️ Draft deleted');
  }, []);

  // ============================================
  // SUBMIT INSPECTION
  // ============================================

  const submit = useCallback(async () => {
    if (!state.template || !state.location || !userId) {
      return {
        success: false,
        error: 'Missing required data',
      };
    }

    try {
      setState((prev) => ({
        ...prev,
        uiState: { ...prev.uiState, isSubmitting: true },
      }));

      timer.stopTimer();

      console.log('🚀 Starting submission process...');

      // 1. Upload photos (if batch mode or any pending)
      let uploadedPhotos = state.photos;

      if (state.pendingPhotos.length > 0) {
        console.log(`📤 Uploading ${state.pendingPhotos.length} pending photos...`);
        const results = await photoUpload.uploadBatch(state.pendingPhotos, userId);
        uploadedPhotos = [...uploadedPhotos, ...results];
      }

      // 2. Prepare form data
      const now = new Date();
      const formData: InspectionFormData = {
        template_id: state.template.id,
        location_id: state.location.id,
        user_id: userId,
        inspection_date: now.toISOString().split('T')[0],
        inspection_time: now.toTimeString().split(' ')[0],
        overall_status: calculateOverallStatus(state.responses),
        responses: state.responses,
        photo_urls: uploadedPhotos.map((p) => p.file_url),
        notes: state.notes || undefined,
        duration_seconds: timer.duration,
        geolocation: state.geolocation || undefined,
      };

      // 3. Submit to database
      const result = await inspectionService.submitInspection(formData, uploadedPhotos);

      if (result.success) {
        // Clear draft
        setState((prev) => ({
          ...prev,
          uiState: { ...prev.uiState, isDraft: false },
        }));

        console.log('✅ Inspection submitted successfully!');
      }

      return result;
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      return {
        success: false,
        error: error.message || 'Submission failed',
      };
    } finally {
      setState((prev) => ({
        ...prev,
        uiState: { ...prev.uiState, isSubmitting: false },
      }));
    }
  }, [state, userId, timer, photoUpload]);

  // ============================================
  // VALIDATION
  // ============================================

  const validate = useCallback(() => {
    if (!state.template || !state.location || !userId) {
      return {
        isValid: false,
        errors: [{ field: 'general', message: 'Missing required data', severity: 'error' as const }],
        warnings: [],
      };
    }

    const formData: Partial<InspectionFormData> = {
      template_id: state.template.id,
      location_id: state.location.id,
      user_id: userId,
      responses: state.responses,
      photo_urls: state.photos.map((p) => p.file_url),
      notes: state.notes,
    };

    return validateInspectionForm(formData, state.template.fields.components.length);
  }, [state, userId]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const progress = useMemo(() => {
    if (!state.template) return 0;
    return getCompletionPercentage(state.responses, state.template.fields.components.length);
  }, [state.responses, state.template]);

  const canSubmit = useMemo(() => {
    if (!state.template || !state.location || !userId) return false;

    const formData: Partial<InspectionFormData> = {
      template_id: state.template.id,
      location_id: state.location.id,
      user_id: userId,
      responses: state.responses,
    };

    return canSubmitInspection(formData, state.template.fields.components.length);
  }, [state, userId]);

  // ============================================
  // RETURN HOOK VALUES
  // ============================================

  return {
    state,
    setUIMode,
    setPhotoMode,
    setLocationMode,
    updateResponse,
    addPhoto,
    removePhoto,
    setNotes,
    fetchLocationFromQR,
    getCurrentGeolocation,
    saveDraft,
    loadDraft,
    deleteDraft,
    submit,
    validate,
    progress,
    duration: timer.duration,
    canSubmit,
  };
}