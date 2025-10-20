// ===================================
// 📁 src/presentation/components/features/inspection/InspectionFormGenZ.tsx
// Gen Z Mode Form
// ===================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Send, Star } from 'lucide-react';
import { Location } from '@/core/entities/Location';
import { ASSESSMENT_ITEMS, AssessmentData } from '@/core/types/assessment.types';
import PhotoCapture from '@/features/PhotoCapture/PhotoCapture';
import styles from './InspectionFormGenZ.module.css';

interface Props {
  location: Location;
}

const EMOJI_SCALE = [
  { emoji: '😡', value: 1, label: 'Sangat Buruk' },
  { emoji: '🙁', value: 2, label: 'Buruk' },
  { emoji: '😐', value: 3, label: 'Cukup' },
  { emoji: '😊', value: 4, label: 'Baik' },
  { emoji: '😍', value: 5, label: 'Sangat Baik' },
];

export default function InspectionFormGenZ({ location }: Props) {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentData>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<{lat: number, lng: number} | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

  const handleAssessment = (key: string, value: number) => {
    setAssessments(prev => ({
      ...prev,
      [key]: {
        rawValue: EMOJI_SCALE[value - 1].emoji,
        normalizedValue: value,
        inputMode: 'emoji',
      }
    }));
  };

  const calculateScore = () => {
    const values = Object.values(assessments);
    if (values.length === 0) return 0;
    
    const items = ASSESSMENT_ITEMS;
    let totalWeighted = 0;
    let totalWeight = 0;
    
    items.forEach(item => {
      const assessment = assessments[item.key];
      if (assessment) {
        totalWeighted += assessment.normalizedValue * item.weight;
        totalWeight += item.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((totalWeighted / (totalWeight * 5)) * 100) : 0;
  };

  const score = calculateScore();
  const progress = (Object.keys(assessments).length / ASSESSMENT_ITEMS.length) * 100;

  const handleSubmit = async () => {
    if (Object.keys(assessments).length < ASSESSMENT_ITEMS.length) {
      alert('⚠️ Please complete all assessments!');
      return;
    }

    if (!photo) {
      const confirm = window.confirm('📸 No photo taken. Continue without photo?');
      if (!confirm) return;
    }

    try {
      setSubmitting(true);

      // TODO: Submit to API
      const inspectionData = {
        locationId: location.id,
        assessments,
        photo,
        geoData,
        comment,
        score,
        mode: 'genz',
      };

      console.log('Submitting:', inspectionData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('✅ Inspection submitted successfully!');
      router.push('/dashboard/locations');
    } catch (error) {
      console.error('Submit error:', error);
      alert('❌ Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        <div className={styles.progressText}>
          {Object.keys(assessments).length} / {ASSESSMENT_ITEMS.length} completed
        </div>
      </div>

      {/* Score Display */}
      <div className={styles.scoreCard}>
        <div className={styles.scoreEmoji}>
          {score >= 90 ? '😍' : score >= 80 ? '😊' : score >= 70 ? '😐' : score >= 60 ? '🙁' : '😡'}
        </div>
        <div className={styles.scoreValue}>{score}</div>
        <div className={styles.scoreLabel}>Your Score</div>
        <div className={styles.scoreHint}>
          {score >= 90 ? 'Excellent! 🎉' : score >= 80 ? 'Great job! 👍' : score >= 70 ? 'Good effort 💪' : score >= 60 ? 'Keep trying! 🔥' : 'Needs work 📝'}
        </div>
      </div>

      {/* Assessment Items */}
      <div className={styles.assessmentList}>
        {ASSESSMENT_ITEMS.map(item => {
          const value = assessments[item.key]?.normalizedValue;
          
          return (
            <div key={item.key} className={styles.assessmentItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
                {value && (
                  <span className={styles.itemValue}>
                    {EMOJI_SCALE[value - 1].emoji} {value}/5
                  </span>
                )}
              </div>

              <div className={styles.emojiScale}>
                {EMOJI_SCALE.map(({ emoji, value: v, label }) => (
                  <button
                    key={v}
                    onClick={() => handleAssessment(item.key, v)}
                    className={`${styles.emojiBtn} ${value === v ? styles.active : ''}`}
                    title={label}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Section */}
      <div className={styles.photoSection}>
        <h3 className={styles.sectionTitle}>
          <Camera size={20} />
          Photo Evidence (Optional)
        </h3>
        
        {photo ? (
          <div className={styles.photoPreview}>
            <img src={photo} alt="Inspection" className={styles.photoImg} />
            <button 
              onClick={() => setPhoto(null)}
              className={styles.photoRemove}
            >
              ✕ Remove Photo
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowPhotoCapture(true)}
            className={styles.photoBtn}
          >
            <Camera size={24} />
            Take Photo
          </button>
        )}
      </div>

      {/* Comment */}
      <div className={styles.commentSection}>
        <h3 className={styles.sectionTitle}>Additional Notes (Optional)</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any additional comments...? 💬"
          className={styles.commentInput}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || Object.keys(assessments).length < ASSESSMENT_ITEMS.length}
        className={styles.submitBtn}
      >
        <Send size={20} />
        {submitting ? 'Submitting...' : 'Submit Inspection 🚀'}
      </button>

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <PhotoCapture
          onCapture={(photoData, geo) => {
            setPhoto(photoData);
            setGeoData(geo);
            setShowPhotoCapture(false);
          }}
          onClose={() => setShowPhotoCapture(false)}
        />
      )}
    </div>
  );
}

