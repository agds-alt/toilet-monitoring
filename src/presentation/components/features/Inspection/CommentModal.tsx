
// src/presentation/components/features/inspection/CommentModal.tsx
// ============================================
// COMMENT MODAL - Comment Popup
// ============================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './CommentModal.module.css';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string) => void;
  initialValue?: string;
  componentName: string;
  maxLength?: number;
}

export function CommentModal({
  isOpen,
  onClose,
  onSave,
  initialValue = '',
  componentName,
  maxLength = 500,
}: CommentModalProps) {
  const [comment, setComment] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setComment(initialValue);
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSave(comment.trim());
    onClose();
  };

  const handleClear = () => {
    setComment('');
  };

  const remainingChars = maxLength - comment.length;
  const isOverLimit = remainingChars < 0;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.icon}>💬</span>
            <h3 className={styles.title}>Tambah Komentar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Component Name */}
        <div className={styles.componentBadge}>
          <span className={styles.badgeText}>{componentName}</span>
        </div>

        {/* Textarea */}
        <div className={styles.body}>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tambahkan catatan atau komentar tentang komponen ini..."
            className={`${styles.textarea} ${isOverLimit ? styles.error : ''}`}
            rows={6}
            maxLength={maxLength}
          />

          <div className={styles.charCount}>
            <span className={isOverLimit ? styles.overLimit : ''}>
              {remainingChars} karakter tersisa
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={!comment}
          >
            🗑️ Hapus
          </button>

          <div className={styles.mainActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={styles.saveButton}
              disabled={isOverLimit}
            >
              ✓ Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}