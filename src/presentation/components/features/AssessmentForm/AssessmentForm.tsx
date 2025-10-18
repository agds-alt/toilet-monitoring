// presentation/components/features/AssessmentForm/AssessmentForm.tsx
'use client';

import { useState } from 'react';
import styles from './AssessmentForm.module.css';

interface AssessmentFormProps {
  locationId: string;
  locationName: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

interface AssessmentData {
  locationId: string;
  locationName: string;
  items: AssessmentItem[];
  notes: string;
  timestamp: string;
}

interface AssessmentItem {
  id: string;
  question: string;
  score: number;
  comment: string;
}


export default function AssessmentForm({ 
  locationId, 
  locationName, 
  onComplete, 
  onCancel 
}: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    locationId,
    locationName,
    items: [
      {
        id: 'cleanliness',
        question: 'Kebersihan lantai dan dinding',
        score: 0,
        comment: ''
      },
      {
        id: 'equipment', 
        question: 'Kondisi perlengkapan toilet',
        score: 0,
        comment: ''
      },
      {
        id: 'supplies',
        question: 'Ketersediaan sabun dan tissue',
        score: 0,
        comment: ''
      },
      {
        id: 'plumbing',
        question: 'Fungsi flush dan keran air',
        score: 0,
        comment: ''
      },
      {
        id: 'ventilation',
        question: 'Ventilasi dan bau',
        score: 0,
        comment: ''
      }
    ],
    notes: '',
    timestamp: new Date().toISOString()
  });

  const [photos, setPhotos] = useState<string[]>([]);
const [showPhotoCapture, setShowPhotoCapture] = useState(false);

const handlePhotoCapture = (photoData: string) => {
  setPhotos(prev => [...prev, photoData]);
  setShowPhotoCapture(false);
};

  const handleScoreChange = (itemId: string, score: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, score } : item
      )
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, comment } : item
      )
    }));
  };

  const handleNotesChange = (notes: string) => {
    setFormData(prev => ({ ...prev, notes }));
  };

  // Di handleSubmit function - pastikan ini
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate all items have scores
  const hasUnscoredItems = formData.items.some(item => item.score === 0);
  if (hasUnscoredItems) {
    alert('Harap beri penilaian untuk semua item sebelum menyimpan.');
    return;
  }

  try {
    setIsSubmitting(true);

    // Calculate scores
    const totalScore = formData.items.reduce((sum, item) => sum + item.score, 0);
    const maxScore = formData.items.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    const submissionData = {
      ...formData,
      photos,
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      submittedAt: new Date().toISOString(),
      // Add these fields to match your existing data structure
      overall_comment: formData.notes,
      status: percentage >= 80 ? 'all_good' : percentage >= 60 ? 'need_maintenance' : 'need_cleaning'
    };

    console.log('📊 Submitting assessment with data:', submissionData);

    const response = await fetch('/api/inspections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.details || 'Failed to save inspection');
    }

    console.log('✅ Assessment saved successfully:', result);
    
    // Show success message with score
    const successMessage = `Inspeksi berhasil disimpan!
    
Skor: ${totalScore}/${maxScore} (${Math.round(percentage)}%)
Status: ${submissionData.status === 'all_good' ? 'Baik' : submissionData.status === 'need_maintenance' ? 'Perlu Perawatan' : 'Perlu Pembersihan'}

ID Inspeksi: ${result.data?.id || result.id}`;

    alert(successMessage);
    
    onComplete({
      ...submissionData,
      inspectionId: result.data?.id || result.id
    });
    
  } catch (error) {
    console.error('Error submitting assessment:', error);
    alert(`Gagal menyimpan inspeksi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsSubmitting(false);
  }
};
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const currentItem = formData.items[currentStep];

 return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / formData.items.length) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          Langkah {currentStep + 1} dari {formData.items.length}
        </div>
      </div>

      {/* Assessment Content */}
      <div className={styles.assessmentContent}>
        <div className={styles.questionSection}>
          <h3 className={styles.question}>{currentItem.question}</h3>
          
          {/* Score Section */}
          <div className={styles.scoreSection}>
            <label className={styles.scoreLabel}>Penilaian:</label>
            <div className={styles.scoreOptions}>
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`${styles.scoreButton} ${
                    currentItem.score === score ? styles.selected : ''
                  }`}
                  onClick={() => handleScoreChange(currentItem.id, score)}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className={styles.scoreLegend}>
              <span>1 (Buruk)</span>
              <span>5 (Sangat Baik)</span>
            </div>
          </div>

          {/* Comment Section */}
          <div className={styles.commentSection}>
            <label htmlFor={`comment-${currentItem.id}`} className={styles.commentLabel}>
              Komentar (opsional):
            </label>
            <textarea
              id={`comment-${currentItem.id}`}
              value={currentItem.comment}
              onChange={(e) => handleCommentChange(currentItem.id, e.target.value)}
              className={styles.commentInput}
              placeholder="Tambahkan catatan jika diperlukan..."
              rows={3}
            />
          </div>
        </div>

        {/* Navigation Buttons - POSISI DITUKAR & SPACING DIPERBAIKI */}
        <div className={styles.navigation}>
          {/* Button Sebelumnya di KIRI */}
          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={prevStep} 
              className={styles.navButtonSecondary}
              disabled={isSubmitting}
            >
              ← Sebelumnya
            </button>
          )}
          
          {currentStep < formData.items.length - 1 ? (
            /* Button Selanjutnya di KANAN */
            <button 
              type="button" 
              onClick={nextStep} 
              className={styles.navButtonPrimary}
              disabled={isSubmitting}
            >
              Selanjutnya →
            </button>
          ) : (
            /* Final Section - POSISI DITUKAR */
            <div className={styles.finalSection}>
              <div className={styles.notesSection}>
                <label htmlFor="notes" className={styles.notesLabel}>
                  Catatan Tambahan:
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className={styles.notesInput}
                  placeholder="Tambahkan catatan umum tentang inspeksi ini..."
                  rows={4}
                />
              </div>
              
              {/* Submit Section - POSISI DITUKAR */}
              <div className={styles.submitSection}>
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Inspeksi'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );


}

