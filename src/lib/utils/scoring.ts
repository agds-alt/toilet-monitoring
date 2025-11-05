// src/lib/utils/scoring.ts
// Scoring utilities for inspection results

export function calculateInspectionScore(inspection: any): number {
  // Simple stub implementation - calculate based on responses
  if (!inspection?.responses) return 0;

  const responses = Object.values(inspection.responses) as any[];
  if (responses.length === 0) return 0;

  const totalRating = responses.reduce((sum, response) => {
    return sum + (response.rating || 0);
  }, 0);

  return Math.round((totalRating / (responses.length * 5)) * 100);
}

export interface ScoreGrade {
  label: string;
  color: string;
  icon: string;
}

export function getScoreGrade(score: number): ScoreGrade {
  if (score >= 90) return { label: 'Excellent (A)', color: '#10b981', icon: '🏆' };
  if (score >= 80) return { label: 'Good (B)', color: '#3b82f6', icon: '⭐' };
  if (score >= 70) return { label: 'Fair (C)', color: '#f59e0b', icon: '👍' };
  if (score >= 60) return { label: 'Poor (D)', color: '#f97316', icon: '⚠️' };
  return { label: 'Fail (F)', color: '#ef4444', icon: '❌' };
}
