// src/presentation/components/features/AssessmentForm/hooks/useAssessmentForm.ts
import { useState, useCallback } from 'react';
import { Assessments } from '../../../../../core/entities/Assessment';
import { AssessmentCategory } from '../../../../../core/types/assessment.types';

export interface UseAssessmentFormProps {
  categories: AssessmentCategory[];
  onSubmit: (data: { assessments: Assessments; overallComment?: string }) => void;
}

export const useAssessmentForm = ({ categories, onSubmit }: UseAssessmentFormProps) => {
  const [assessments, setAssessments] = useState<Assessments>({});
  const [overallComment, setOverallComment] = useState('');
  const [currentCategory, setCurrentCategory] = useState(0);

  const updateAssessment = useCallback((categoryId: string, value: number, notes: string = '') => {
    setAssessments(prev => ({
      ...prev,
      [categoryId]: {
        value,
        notes,
        timestamp: new Date().toISOString()
      }
    }));
  }, []);

  const nextCategory = useCallback(() => {
    setCurrentCategory(prev => Math.min(prev + 1, categories.length - 1));
  }, [categories.length]);

  const prevCategory = useCallback(() => {
    setCurrentCategory(prev => Math.max(prev - 1, 0));
  }, []);

  const submitForm = useCallback(() => {
    if (Object.keys(assessments).length === 0) {
      throw new Error('Harap isi minimal satu assessment');
    }
    
    onSubmit({ assessments, overallComment });
  }, [assessments, overallComment, onSubmit]);

  const getProgress = useCallback(() => {
    const completed = Object.keys(assessments).length;
    const total = categories.length;
    return { completed, total, percentage: (completed / total) * 100 };
  }, [assessments, categories.length]);

  return {
    assessments,
    overallComment,
    setOverallComment,
    currentCategory,
    updateAssessment,
    nextCategory,
    prevCategory,
    submitForm,
    getProgress,
    currentCategoryData: categories[currentCategory]
  };
};