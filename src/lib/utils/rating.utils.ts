// src/lib/utils/rating.utils.ts
// ============================================
// RATING CALCULATION UTILITIES
// ============================================

import {
  ComponentResponse,
  InspectionStatus,
  RatingValue,
} from '@/core/types/inspection.types';
import {
  STATUS_THRESHOLDS,
  RATING_EMOJI_MAP,
  RATING_LABEL_MAP,
} from '@/lib/constants/inspection.constants';

// ============================================
// CALCULATE OVERALL STATUS
// ============================================

export function calculateOverallStatus(
  responses: Record<string, ComponentResponse>
): InspectionStatus {
  const ratings = Object.values(responses)
    .map((r) => r.rating)
    .filter((r) => r !== undefined);

  if (ratings.length === 0) {
    return 'Poor';
  }

  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  if (average >= STATUS_THRESHOLDS.EXCELLENT) return 'Excellent';
  if (average >= STATUS_THRESHOLDS.GOOD) return 'Good';
  if (average >= STATUS_THRESHOLDS.FAIR) return 'Fair';
  if (average >= STATUS_THRESHOLDS.POOR) return 'Poor';
  return 'Critical';
}

// ============================================
// CALCULATE AVERAGE RATING
// ============================================

export function calculateAverageRating(
  responses: Record<string, ComponentResponse>
): number {
  const ratings = Object.values(responses)
    .map((r) => r.rating)
    .filter((r) => r !== undefined);

  if (ratings.length === 0) return 0;

  const sum = ratings.reduce((a, b) => a + b, 0);
  return Number((sum / ratings.length).toFixed(2));
}

// ============================================
// CALCULATE SCORE (1-100)
// ============================================

export function calculateScore(
  responses: Record<string, ComponentResponse>
): number {
  const average = calculateAverageRating(responses);
  // Convert 1-5 scale to 1-100
  return Math.round((average / 5) * 100);
}

// ============================================
// GET RATING EMOJI
// ============================================

export function getRatingEmoji(rating: RatingValue): string {
  return RATING_EMOJI_MAP[rating] || '😐';
}

// ============================================
// GET RATING LABEL
// ============================================

export function getRatingLabel(
  rating: RatingValue,
  lang: 'en' | 'id' = 'en'
): string {
  return RATING_LABEL_MAP[rating]?.[lang] || 'Unknown';
}

// ============================================
// GET STATUS COLOR
// ============================================

export function getStatusColor(status: InspectionStatus): {
  bg: string;
  text: string;
  badge: string;
} {
  const colors = {
    Excellent: { bg: '#10b981', text: '#ffffff', badge: 'bg-green-500' },
    Good: { bg: '#3b82f6', text: '#ffffff', badge: 'bg-blue-500' },
    Fair: { bg: '#f59e0b', text: '#ffffff', badge: 'bg-yellow-500' },
    Poor: { bg: '#ef4444', text: '#ffffff', badge: 'bg-red-500' },
    Critical: { bg: '#991b1b', text: '#ffffff', badge: 'bg-red-800' },
  };

  return colors[status] || colors.Fair;
}

// ============================================
// CHECK IF RATING IS COMPLETE
// ============================================

export function isRatingComplete(
  responses: Record<string, ComponentResponse>,
  requiredCount: number
): boolean {
  const ratedCount = Object.values(responses).filter(
    (r) => r.rating !== undefined
  ).length;
  return ratedCount >= requiredCount;
}

// ============================================
// GET COMPLETION PERCENTAGE
// ============================================

export function getCompletionPercentage(
  responses: Record<string, ComponentResponse>,
  totalComponents: number
): number {
  const ratedCount = Object.values(responses).filter(
    (r) => r.rating !== undefined
  ).length;
  return Math.round((ratedCount / totalComponents) * 100);
}

// ============================================
// FORMAT RATING FOR DISPLAY
// ============================================

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// ============================================
// GET RATING STATISTICS
// ============================================

export function getRatingStatistics(
  responses: Record<string, ComponentResponse>
): {
  average: number;
  score: number;
  status: InspectionStatus;
  total: number;
  rated: number;
  percentage: number;
  breakdown: Record<RatingValue, number>;
} {
  const ratings = Object.values(responses)
    .map((r) => r.rating)
    .filter((r) => r !== undefined) as RatingValue[];

  const breakdown: Record<RatingValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratings.forEach((rating) => {
    breakdown[rating] = (breakdown[rating] || 0) + 1;
  });

  return {
    average: calculateAverageRating(responses),
    score: calculateScore(responses),
    status: calculateOverallStatus(responses),
    total: Object.keys(responses).length,
    rated: ratings.length,
    percentage: getCompletionPercentage(responses, Object.keys(responses).length),
    breakdown,
  };
}