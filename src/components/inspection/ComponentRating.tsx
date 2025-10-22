// src/components/inspection/ComponentRating.tsx
// ============================================
// COMPONENT RATING - Rating Widget
// ============================================

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import type {
  InspectionComponent,
  ComponentResponse,
  RatingValue,
} from '@/core/types/inspection.types';
import { RATING_EMOJIS, RATING_LABELS } from '@/core/constants/inspection.constant';

interface ComponentRatingProps {
  component: InspectionComponent;
  response?: ComponentResponse;
  onRate: (rating: RatingValue) => void;
  onComment: (comment: string) => void;
}

export function ComponentRating({ component, response, onRate, onComment }: ComponentRatingProps) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(response?.comment || '');

  const ratings: RatingValue[] = ['clean', 'needs_work', 'dirty'];

  const handleCommentSave = () => {
    onComment(comment);
    setShowComment(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{component.icon || '✨'}</span>
          <div>
            <h3 className="font-semibold text-gray-800">
              {component.label_id || component.label}
              {component.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {component.description && (
              <p className="text-xs text-gray-500">{component.description}</p>
            )}
          </div>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComment(!showComment)}
          className={`p-2 rounded-lg transition-colors ${
            response?.comment || showComment
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {ratings.map((rating) => {
          const isSelected = response?.rating === rating;
          return (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? rating === 'clean'
                    ? 'bg-green-50 border-green-500'
                    : rating === 'needs_work'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">{RATING_EMOJIS[rating]}</div>
                <div
                  className={`text-xs font-medium ${
                    isSelected
                      ? rating === 'clean'
                        ? 'text-green-700'
                        : rating === 'needs_work'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      : 'text-gray-600'
                  }`}
                >
                  {RATING_LABELS[rating]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan untuk {component.label_id || component.label}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tambahkan catatan..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setComment(response?.comment || '');
                setShowComment(false);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              onClick={handleCommentSave}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* Show saved comment */}
      {!showComment && response?.comment && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 italic">{response.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
