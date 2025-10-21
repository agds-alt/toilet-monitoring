// src/presentation/components/features/Inspection/InspectionForm.tsx
// ============================================
// REFACTORED INSPECTION FORM - Type-Safe Version
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
import { formatDuration } from '@/presentation/hooks/useTimer';
import { UIModeSwitcher } from './UIModeSwitcher';
import { PhotoModeSwitcher } from './PhotoModeSwitcher';
import { LocationModeSwitcher } from './LocationModeSwitcher';
import { ComponentRating } from './ComponentRating';
import { CommentModal } from './CommentModal';
import { PhotoCapture } from './PhotoCapture';
import { PhotoPreview } from './PhotoPreview';
import styles from './InspectionForm.module.css';

// ============================================
// SIMPLIFIED TYPES - Based on Supabase Schema
// ============================================

type UIMode = 'genz' | 'professional';
type PhotoMode = 'solo' | 'batch';
type LocationMode = 'qr' | 'gps' | 'manual';

interface ComponentResponse {
  rating: 'clean' | 'needs_work' | 'dirty' | null;
  comment?: string;
  photos?: string[];
}

interface PendingPhoto {
  file: File;
  preview: string;
  fieldReference: string;
}

interface InspectionFormState {
  // Core data
  templateId: string;
  locationId: string | null;
  locationName: string | null;
  userId: string;
  
  // Template structure (from JSONB fields column)
  components: Array<{
    id: string;
    label: string;
    label_id?: string;
    icon?: string;
    type: 'rating';
    required: boolean;
    order: number;
  }>;
  
  // User responses
  responses: Record<string, ComponentResponse>;
  pendingPhotos: PendingPhoto[];
  notes: string;
  
  // UI state
  uiMode: UIMode;
  photoMode: PhotoMode;
  locationMode: LocationMode;
  
  // Timer
  startTime: number;
  duration: number;
}

// ============================================
// PROPS
// ============================================

interface InspectionFormProps {
  templateId: string;
  locationId?: string;
  userId: string;
  onSuccess?: (inspectionId: string) => void;
  onCancel?: () => void;
  onOpenQRScanner?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function InspectionForm({
  templateId,
  locationId,
  userId,
  onSuccess,
  onCancel,
  onOpenQRScanner,
}: InspectionFormProps) {
  
  // ============================================
  // STATE
  // ============================================
  
  const [state, setState] = useState<InspectionFormState>({
    templateId,
    locationId: locationId || null,
    locationName: null,
    userId,
    components: [],
    responses: {},
    pendingPhotos: [],
    notes: '',
    uiMode: 'genz',
    photoMode: 'batch',
    locationMode: 'qr',
    startTime: Date.now(),
    duration: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [currentComponentId, setCurrentComponentId] = useState<string>('');

  // ============================================
  // LOAD TEMPLATE
  // ============================================
  
  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API call
        const response = await fetch(`/api/templates/${templateId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load template');
        }
        
        const template = await response.json();
        
        // Extract components from JSONB fields
        const components = template.fields?.components || [];
        
        setState(prev => ({
          ...prev,
          components: components.sort((a: any, b: any) => a.order - b.order),
        }));
        
      } catch (err: any) {
        setError(err.message || 'Failed to load template');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTemplate();
  }, [templateId]);

  // ============================================
  // TIMER
  // ============================================
  
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // HANDLERS - UI State
  // ============================================
  
  const setUIMode = (mode: UIMode) => {
    setState(prev => ({ ...prev, uiMode: mode }));
  };

  const setPhotoMode = (mode: PhotoMode) => {
    setState(prev => ({ ...prev, photoMode: mode }));
  };

  const setLocationMode = (mode: LocationMode) => {
    setState(prev => ({ ...prev, locationMode: mode }));
  };

  // ============================================
  // HANDLERS - Responses
  // ============================================
  
  const updateResponse = (componentId: string, data: Partial<ComponentResponse>) => {
    setState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [componentId]: {
          ...prev.responses[componentId],
          ...data,
        },
      },
    }));
  };

  const handleOpenComment = (componentId: string) => {
    setCurrentComponentId(componentId);
    setCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string) => {
    if (currentComponentId) {
      updateResponse(currentComponentId, { comment });
      setCommentModalOpen(false);
    }
  };

  // ============================================
  // HANDLERS - Photos
  // ============================================
  
  const addPhoto = (file: File, componentId: string) => {
    const preview = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      pendingPhotos: [
        ...prev.pendingPhotos,
        {
          file,
          preview,
          fieldReference: componentId,
        },
      ],
    }));
  };

  const removePhoto = (preview: string) => {
    setState(prev => ({
      ...prev,
      pendingPhotos: prev.pendingPhotos.filter(p => p.preview !== preview),
    }));
    
    // Cleanup blob URL
    URL.revokeObjectURL(preview);
  };

  // ============================================
  // HANDLERS - Location
  // ============================================
  
  const handleGetLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      // TODO: Reverse geocode or use location
      console.log('Got location:', position.coords);
      
    } catch (err) {
      console.error('Failed to get location:', err);
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  
  const validate = () => {
    const errors: string[] = [];
    
    // Check required components
    const requiredComponents = state.components.filter(c => c.required);
    
    for (const component of requiredComponents) {
      const response = state.responses[component.id];
      
      if (!response || !response.rating) {
        errors.push(`${component.label} harus diisi`);
      }
    }
    
    // Check location
    if (!state.locationId) {
      errors.push('Lokasi harus dipilih');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // ============================================
  // SUBMIT
  // ============================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validate();
    
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Upload photos first
      const photoUrls: string[] = [];
      
      for (const photo of state.pendingPhotos) {
        // TODO: Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', photo.file);
        formData.append('upload_preset', 'toilet-monitoring_unsigned');
        
        const uploadResponse = await fetch(
          'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        
        const uploadData = await uploadResponse.json();
        photoUrls.push(uploadData.secure_url);
      }
      
      // 2. Calculate overall status
      const ratings = Object.values(state.responses).map(r => r.rating);
      const dirtyCount = ratings.filter(r => r === 'dirty').length;
      const needsWorkCount = ratings.filter(r => r === 'needs_work').length;
      
      let overallStatus: 'clean' | 'needs_work' | 'dirty';
      
      if (dirtyCount > 0) {
        overallStatus = 'dirty';
      } else if (needsWorkCount > 0) {
        overallStatus = 'needs_work';
      } else {
        overallStatus = 'clean';
      }
      
      // 3. Prepare data (matching InspectionRecordInsert type)
      const now = new Date();
      const inspectionData: InspectionRecordInsert = {
        template_id: state.templateId,
        location_id: state.locationId!,
        user_id: state.userId,
        inspection_date: now.toISOString().split('T')[0], // YYYY-MM-DD
        inspection_time: now.toTimeString().split(' ')[0], // HH:MM:SS
        overall_status: overallStatus,
        responses: state.responses as any, // JSONB
        photo_urls: photoUrls,
        notes: state.notes || null,
        duration_seconds: state.duration,
        geolocation: null, // TODO: Add if using GPS
      };
      
      // 4. Submit to API
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inspectionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit inspection');
      }
      
      const result = await response.json();
      
      // 5. Success callback
      if (onSuccess) {
        onSuccess(result.id);
      }
      
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengirim inspeksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // PROGRESS CALCULATION
  // ============================================
  
  const progress = Math.round(
    (Object.keys(state.responses).length / state.components.length) * 100
  );

  // ============================================
  // RENDER - Loading
  // ============================================
  
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Memuat template...</p>
      </div>
    );
  }

  // ============================================
  // RENDER - Error
  // ============================================
  
  if (error && !isSubmitting) {
    return (
      <div className={styles.error}>
        <p>❌ {error}</p>
        <button onClick={() => setError(null)}>Coba Lagi</button>
      </div>
    );
  }

  // ============================================
  // RENDER - Form
  // ============================================
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Inspeksi Toilet</h1>
          <div className={styles.timer}>
            ⏱️ {formatDuration(state.duration)}
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className={styles.progressText}>
          {progress}% selesai ({Object.keys(state.responses).length}/{state.components.length})
        </p>
      </div>

      {/* SETTINGS */}
      <div className={styles.settings}>
        <UIModeSwitcher 
          mode={state.uiMode} 
          onChange={setUIMode} 
        />

        <PhotoModeSwitcher 
          mode={state.photoMode} 
          onChange={setPhotoMode} 
        />

        <LocationModeSwitcher
          mode={state.locationMode}
          onChange={setLocationMode}
          onGetLocation={handleGetLocation}
          onScanQR={onOpenQRScanner}
          locationName={state.locationName || undefined}
        />
      </div>

      {/* COMPONENTS */}
      <div className={styles.components}>
        <h2 className={styles.sectionTitle}>
          📋 Komponen Inspeksi ({state.components.length})
        </h2>

        {state.components.map((component) => {
          const response = state.responses[component.id];
          const componentPhotos = state.pendingPhotos.filter(
            p => p.fieldReference === component.id
          );

          return (
            <div key={component.id} className={styles.componentCard}>
              
              {/* Rating */}
              <ComponentRating
                componentId={component.id}
                label={component.label}
                icon={component.icon}
                value={response?.rating || undefined}
                onChange={(rating) => updateResponse(component.id, { rating })}
                uiMode={state.uiMode}
                required={component.required}
              />

              {/* Actions */}
              <div className={styles.componentActions}>
                <button
                  type="button"
                  onClick={() => handleOpenComment(component.id)}
                  className={`${styles.actionButton} ${
                    response?.comment ? styles.hasContent : ''
                  }`}
                >
                  💬 {response?.comment ? 'Edit Catatan' : 'Tambah Catatan'}
                </button>

                <PhotoCapture
                  onCapture={(file) => addPhoto(file, component.id)}
                  mode={state.photoMode}
                />
              </div>

              {/* Comment Preview */}
              {response?.comment && (
                <div className={styles.commentPreview}>
                  <span className={styles.commentIcon}>💬</span>
                  <p className={styles.commentText}>{response.comment}</p>
                </div>
              )}

              {/* Photo Preview */}
              {componentPhotos.length > 0 && (
                <PhotoPreview
                  photos={componentPhotos}
                  onRemove={removePhoto}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* NOTES */}
      <div className={styles.notes}>
        <label className={styles.notesLabel}>
          📝 Catatan Tambahan (Opsional)
        </label>
        <textarea
          className={styles.notesTextarea}
          value={state.notes}
          onChange={(e) => setState(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Tambahkan catatan atau observasi tambahan..."
          rows={4}
        />
      </div>

      {/* SUBMIT */}
      <div className={styles.footer}>
        {error && (
          <p className={styles.errorText}>❌ {error}</p>
        )}
        
        <div className={styles.footerButtons}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Batal
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || progress < 100}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Inspeksi'}
          </button>
        </div>
      </div>

      {/* COMMENT MODAL */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        onSave={handleSaveComment}
        initialValue={
          currentComponentId 
            ? state.responses[currentComponentId]?.comment || '' 
            : ''
        }
        componentName={
          state.components.find(c => c.id === currentComponentId)?.label || ''
        }
      />
    </form>
  );
}