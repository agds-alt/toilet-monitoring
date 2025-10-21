// src/lib/utils/rating.utils.ts
// ============================================
// RATING UTILITIES - String-based ratings
// ============================================

import {
  RatingValue,
  ComponentResponse,
  OverallStatus,
} from '@/core/types/inspection.types';

// ============================================
// RATING CONSTANTS
// ============================================

export const RATING_VALUES: RatingValue[] = ['clean', 'needs_work', 'dirty'];

export const RATING_EMOJI_MAP: Record<RatingValue, string> = {
  clean: '😊',
  needs_work: '😐',
  dirty: '😞',
};

export const RATING_LABEL_MAP: Record<RatingValue, { en: string; id: string }> = {
  clean: { en: 'Clean', id: 'Bersih' },
  needs_work: { en: 'Needs Work', id: 'Perlu Perbaikan' },
  dirty: { en: 'Dirty', id: 'Kotor' },
};

export const RATING_COLORS: Record<RatingValue, string> = {
  clean: '#10b981',
  needs_work: '#f59e0b',
  dirty: '#ef4444',
};

// ============================================
// RATING TO SCORE CONVERSION
// ============================================

export function ratingToScore(rating: RatingValue): number {
  const scoreMap: Record<RatingValue, number> = {
    clean: 5,
    needs_work: 3,
    dirty: 1,
  };
  return scoreMap[rating];
}

export function scoreToRating(score: number): RatingValue {
  if (score >= 4) return 'clean';
  if (score >= 2) return 'needs_work';
  return 'dirty';
}

// ============================================
// CALCULATE OVERALL STATUS
// ============================================

export function calculateOverallStatus(responses: Record<string, ComponentResponse>): OverallStatus {
  const ratings = Object.values(responses)
    .map(r => r.rating)
    .filter((r): r is RatingValue => r !== null);

  if (ratings.length === 0) return 'needs_work';

  // Count each rating type
  const counts = {
    clean: ratings.filter(r => r === 'clean').length,
    needs_work: ratings.filter(r => r === 'needs_work').length,
    dirty: ratings.filter(r => r === 'dirty').length,
  };

  // If more than 30% dirty → overall dirty
  if (counts.dirty / ratings.length > 0.3) return 'dirty';
  
  // If more than 70% clean → overall clean
  if (counts.clean / ratings.length > 0.7) return 'clean';
  
  // Otherwise needs work
  return 'needs_work';
}

// ============================================
// CALCULATE AVERAGE SCORE
// ============================================

export function calculateAverageScore(responses: Record<string, ComponentResponse>): number {
  const scores = Object.values(responses)
    .map(r => r.rating)
    .filter((r): r is RatingValue => r !== null)
    .map(ratingToScore);

  if (scores.length === 0) return 0;

  const sum = scores.reduce((a, b) => a + b, 0);
  return Number((sum / scores.length).toFixed(2));
}

// ============================================
// UI HELPERS
// ============================================

export function getRatingEmoji(rating: RatingValue): string {
  return RATING_EMOJI_MAP[rating] || '😐';
}

export function getRatingLabel(rating: RatingValue, lang: 'en' | 'id' = 'id'): string {
  return RATING_LABEL_MAP[rating]?.[lang] || 'Unknown';
}

export function getRatingColor(rating: RatingValue): string {
  return RATING_COLORS[rating] || '#6b7280';
}

// ============================================
// STATISTICS
// ============================================

export interface RatingBreakdown {
  clean: number;
  needs_work: number;
  dirty: number;
  total: number;
}

export function getRatingBreakdown(responses: Record<string, ComponentResponse>): RatingBreakdown {
  const ratings = Object.values(responses)
    .map(r => r.rating)
    .filter((r): r is RatingValue => r !== null);

  return {
    clean: ratings.filter(r => r === 'clean').length,
    needs_work: ratings.filter(r => r === 'needs_work').length,
    dirty: ratings.filter(r => r === 'dirty').length,
    total: ratings.length,
  };
}
