// src/presentation/components/features/inspection/InspectionForm.tsx
// ============================================
// INSPECTION FORM - Main Form Component
// ============================================

'use client';

import React, { useState } from 'react';
import { useInspection } from '@/presentation/hooks/useInspection';
import { formatDuration } from '@/presentation/hooks/useTimer';
import { UIModeSwitcher } from './UIModeSwitcher';
import { PhotoModeSwitcher } from './PhotoModeSwitcher';
import { LocationModeSwitcher } from './LocationModeSwitcher';
import { ComponentRating } from './ComponentRating';
import { CommentModal } from './CommentModal';
import { PhotoCapture } from './PhotoCapture';
import { PhotoPreview } from './PhotoPreview';
import styles from './InspectionForm.module.css';

interface InspectionFormProps {
  templateId?: string;
  locationId?: string;
  userId: string;
  onSuccess?: (inspectionId: string) => void;
  onCancel?: () => void;
  onOpenQRScanner?: () => void;
}

export function InspectionForm({
  templateId,
  locationId,
  userId,
  onSuccess,
  onCancel,
  onOpenQRScanner,
}: InspectionFormProps) {
  const {
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
    submit,
    validate,
    progress,
    duration,
    canSubmit,
  } = useInspection(templateId, locationId, userId);

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [currentComponentId, setCurrentComponentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get current component for comment modal
  const currentComponent = state.template?.fields.components.find(
    (c) => c.id === currentComponentId
  );

  const handleOpenComment = (componentId: string) => {
    setCurrentComponentId(componentId);
    setCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string) => {
    if (currentComponentId) {
      updateResponse(currentComponentId, { comment });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await submit();
      
      if (result.success && result.data) {
        if (onSuccess) {
          onSuccess(result.data.id);
        }
      } else {
        setSubmitError(result.error || 'Gagal mengirim inspeksi');
      }
    } catch (error: any) {
      setSubmitError(error.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validation = validate();

  if (!state.template) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Memuat template...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{state.template.name}</h1>
          <div className={styles.timer}>
            ⏱️ {formatDuration(duration)}
          </div>
        </div>

        {state.template.description && (
          <p className={styles.description}>{state.template.description}</p>
        )}

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressText}>{progress}% selesai</p>
      </div>

      {/* Settings Section */}
      <div className={styles.settings}>
        <UIModeSwitcher
          mode={state.uiState.uiMode}
          onChange={setUIMode}
        />

        <PhotoModeSwitcher
          mode={state.uiState.photoMode}
          onChange={setPhotoMode}
        />

        <LocationModeSwitcher
          mode={state.uiState.locationMode}
          onChange={setLocationMode}
          onGetLocation={getCurrentGeolocation}
          onScanQR={onOpenQRScanner}
          locationName={state.location?.name}
        />
      </div>

      {/* Components Section */}
      <div className={styles.components}>
        <h2 className={styles.sectionTitle}>
          📋 Komponen Inspeksi ({state.template.fields.components.length})
        </h2>

        {state.template.fields.components.map((component) => {
          const response = state.responses[component.id];
          const componentPhotos = state.pendingPhotos.filter(
            (p) => p.fieldReference === component.id
          );

          return (
            <div key={component.id} className={styles.componentCard}>
              <ComponentRating
                componentId={component.id}
                label={component.label}
                icon={component.icon}
                value={response?.rating}
                onChange={(rating) =>
                  updateResponse(component.id, { rating })
                }
                uiMode={state.uiState.uiMode}
                required={component.required}
              />

              {/* Actions Row */}
              <div className={styles.componentActions}>
                <button
                  type="button"
                  onClick={() => handleOpenComment(component.id)}
                  className={`${styles.actionButton} ${
                    response?.comment ? styles.hasContent : ''
                  }`}
                >
                  💬 {response?.comment ? 'Edit Komentar' : 'Tambah Komentar'}
                </button>

                {state.uiState.photoMode === 'solo' && (
                  <PhotoCapture
                    fieldReference={component.id}
                    locationId={state.location?.id || ''}
                    onCapture={addPhoto}
                    currentPhotoCount={componentPhotos.length}
                  />
                )}
              </div>

              {/* Photo Preview */}
              {componentPhotos.length > 0 && (
                <PhotoPreview
                  photos={componentPhotos}
                  onRemove={removePhoto}
                />
              )}

              {/* Comment Preview */}
              {response?.comment && (
                <div className={styles.commentPreview}>
                  <span className={styles.commentIcon}>💬</span>
                  <p className={styles.commentText}>{response.comment}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Batch Photo Upload */}
      {state.uiState.photoMode === 'batch' && state.pendingPhotos.length > 0 && (
        <div className={styles.batchPhotos}>
          <h3 className={styles.sectionTitle}>📷 Semua Foto</h3>
          <PhotoPreview
            photos={state.pendingPhotos}
            onRemove={removePhoto}
          />
        </div>
      )}

      {/* Notes Section */}
      <div className={styles.notes}>
        <label className={styles.notesLabel}>
          📝 Catatan Tambahan (Opsional)
        </label>
        <textarea
          value={state.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tambahkan catatan umum tentang inspeksi ini..."
          className={styles.notesTextarea}
          rows={4}
          maxLength={1000}
        />
        <div className={styles.notesCount}>
          {state.notes.length}/1000 karakter
        </div>
      </div>

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className={styles.warnings}>
          {validation.warnings.map((warning, idx) => (
            <div key={idx} className={styles.warning}>
              ⚠️ {warning.message}
            </div>
          ))}
        </div>
      )}

      {/* Submit Error */}
      {submitError && (
        <div className={styles.error}>
          ❌ {submitError}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Batal
          </button>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} />
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Kirim Inspeksi</span>
            </>
          )}
        </button>
      </div>

      {/* Comment Modal */}
      {currentComponent && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          onSave={handleSaveComment}
          initialValue={state.responses[currentComponentId]?.comment || ''}
          componentName={currentComponent.label}
        />
      )}
    </form>
  );
}