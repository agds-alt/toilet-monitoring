// src/presentation/components/features/inspection/ComponentRating.tsx
// ============================================
// COMPONENT RATING - Star/Emoji Rating Input
// ============================================

'use client';

import React, { useState } from 'react';
import { RatingValue, UIMode } from '@/core/types/inspection.types';
import { getRatingEmoji, getRatingLabel } from '@/lib/utils/rating.utils';
import styles from './ComponentRating.module.css';

interface ComponentRatingProps {
  componentId: string;
  label: string;
  icon?: string;
  value?: RatingValue;
  onChange: (value: RatingValue) => void;
  uiMode: UIMode;
  required?: boolean;
  className?: string;
}

export function ComponentRating({
  componentId,
  label,
  icon,
  value,
  onChange,
  uiMode,
  required = false,
  className = '',
}: ComponentRatingProps) {
  const [hoverValue, setHoverValue] = useState<RatingValue | null>(null);

  const isProfessional = uiMode === 'professional';
  const displayValue = hoverValue || value;

  const handleClick = (rating: RatingValue) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating: RatingValue) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {icon && <span className={styles.componentIcon}>{icon}</span>}
          <h3 className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </h3>
        </div>

        {displayValue && (
          <span className={styles.ratingBadge}>
            {isProfessional ? (
              <span className={styles.ratingText}>{displayValue}/5</span>
            ) : (
              <span className={styles.ratingEmoji}>{getRatingEmoji(displayValue)}</span>
            )}
          </span>
        )}
      </div>

      {/* Rating Input */}
      <div className={styles.ratingWrapper}>
        {isProfessional ? (
          <StarRating
            value={value}
            hoverValue={hoverValue}
            onRate={handleClick}
            onHoverEnter={handleMouseEnter}
            onHoverLeave={handleMouseLeave}
          />
        ) : (
          <EmojiRating
            value={value}
            hoverValue={hoverValue}
            onRate={handleClick}
            onHoverEnter={handleMouseEnter}
            onHoverLeave={handleMouseLeave}
          />
        )}
      </div>

      {/* Label */}
      {displayValue && (
        <div className={styles.ratingLabel}>
          <span
            className={`${styles.labelText} ${isProfessional ? styles.professional : styles.genz}`}
          >
            {getRatingLabel(displayValue, 'id')}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// STAR RATING (Professional Mode)
// ============================================

interface StarRatingProps {
  value?: RatingValue;
  hoverValue: RatingValue | null;
  onRate: (value: RatingValue) => void;
  onHoverEnter: (value: RatingValue) => void;
  onHoverLeave: () => void;
}

function StarRating({ value, hoverValue, onRate, onHoverEnter, onHoverLeave }: StarRatingProps) {
  const ratings: RatingValue[] = [1, 2, 3, 4, 5];

  return (
    <div className={styles.starRating}>
      {ratings.map((rating) => {
        const isFilled = rating <= (hoverValue || value || 0);

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onRate(rating)}
            onMouseEnter={() => onHoverEnter(rating)}
            onMouseLeave={onHoverLeave}
            className={`${styles.star} ${isFilled ? styles.filled : ''}`}
            aria-label={`Rate ${rating} out of 5`}
          >
            ⭐
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// EMOJI RATING (Gen Z Mode)
// ============================================

interface EmojiRatingProps {
  value?: RatingValue;
  hoverValue: RatingValue | null;
  onRate: (value: RatingValue) => void;
  onHoverEnter: (value: RatingValue) => void;
  onHoverLeave: () => void;
}

function EmojiRating({ value, hoverValue, onRate, onHoverEnter, onHoverLeave }: EmojiRatingProps) {
  const ratings: RatingValue[] = [1, 2, 3, 4, 5];

  return (
    <div className={styles.emojiRating}>
      {ratings.map((rating) => {
        const isSelected = rating === value;
        const isHovered = rating === hoverValue;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onRate(rating)}
            onMouseEnter={() => onHoverEnter(rating)}
            onMouseLeave={onHoverLeave}
            className={`${styles.emoji} ${isSelected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
            aria-label={`Rate ${getRatingLabel(rating, 'id')}`}
          >
            {getRatingEmoji(rating)}
          </button>
        );
      })}
    </div>
  );
}
