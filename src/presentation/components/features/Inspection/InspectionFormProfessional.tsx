// ===================================
// 📁 src/presentation/components/features/inspection/InspectionFormProfessional.tsx
// Professional Mode Form
// ===================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Send, CheckSquare } from 'lucide-react';
import { Location } from '@/core/entities/Location';
import { ASSESSMENT_ITEMS, AssessmentData } from '@/core/types/assessment.types';
import PhotoCapture from '@/features/PhotoCapture/PhotoCapture';
import styles from './InspectionFormProfessional.module.css';

interface Props {
  location: Location;
}

export default function InspectionFormProfessional({ location }: Props) {
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
        rawValue: value,
        normalizedValue: value,
        inputMode: 'checkbox',
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
  const completedCount = Object.keys(assessments).length;

  const handleSubmit = async () => {
    if (completedCount < ASSESSMENT_ITEMS.length) {
      alert('Please complete all assessments.');
      return;
    }

    if (!photo) {
      const confirm = window.confirm('No photo attached. Continue without photo?');
      if (!confirm) return;
    }

    try {
      setSubmitting(true);

      const inspectionData = {
        locationId: location.id,
        assessments,
        photo,
        geoData,
        comment,
        score,
        mode: 'professional',
      };

      console.log('Submitting:', inspectionData);

      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Inspection submitted successfully.');
      router.push('/dashboard/locations');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreGrade = () => {
    if (score >= 90) return { label: 'Excellent', color: '#10B981' };
    if (score >= 80) return { label: 'Good', color: '#3B82F6' };
    if (score >= 70) return { label: 'Fair', color: '#F59E0B' };
    if (score >= 60) return { label: 'Poor', color: '#EF4444' };
    return { label: 'Critical', color: '#DC2626' };
  };

  const grade = getScoreGrade();

  return (
    <div className={styles.container}>
      {/* Header Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Progress</div>
          <div className={styles.statValue}>
            {completedCount}/{ASSESSMENT_ITEMS.length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Score</div>
          <div className={styles.statValue} style={{ color: grade.color }}>
            {score}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Grade</div>
          <div className={styles.statValue} style={{ color: grade.color }}>
            {grade.label}
          </div>
        </div>
      </div>

      {/* Assessment Table */}
      <div className={styles.assessmentTable}>
        <div className={styles.tableHeader}>
          <div className={styles.colItem}>Item</div>
          <div className={styles.colRating}>Rating (1-5)</div>
          <div className={styles.colStatus}>Status</div>
        </div>

        {ASSESSMENT_ITEMS.map(item => {
          const value = assessments[item.key]?.normalizedValue;
          
          return (
            <div key={item.key} className={styles.tableRow}>
              <div className={styles.colItem}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
              </div>

              <div className={styles.colRating}>
                <div className={styles.ratingButtons}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => handleAssessment(item.key, v)}
                      className={`${styles.ratingBtn} ${value === v ? styles.active : ''}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.colStatus}>
                {value ? (
                  <span className={styles.statusBadge} data-status={value >= 4 ? 'good' : value >= 3 ? 'fair' : 'poor'}>
                    {value >= 4 ? '✓ Good' : value >= 3 ? '○ Fair' : '✗ Poor'}
                  </span>
                ) : (
                  <span className={styles.statusPending}>Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Camera size={18} />
          Photo Documentation
        </h3>
        
        {photo ? (
          <div className={styles.photoPreview}>
            <img src={photo} alt="Inspection" />
            <button onClick={() => setPhoto(null)} className={styles.btnRemove}>
              Remove
            </button>
          </div>
        ) : (
          <button onClick={() => setShowPhotoCapture(true)} className={styles.btnPhoto}>
            <Camera size={20} />
            Capture Photo
          </button>
        )}
      </div>

      {/* Comments */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional Comments</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter any additional observations or notes..."
          className={styles.textarea}
          rows={4}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || completedCount < ASSESSMENT_ITEMS.length}
        className={styles.submitBtn}
      >
        <Send size={18} />
        {submitting ? 'Submitting...' : 'Submit Inspection'}
      </button>

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