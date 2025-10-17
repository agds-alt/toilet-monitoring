'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentForm } from '@/presentation/components/features/AssessmentForm';
import { PhotoCapture } from '@/presentation/components/features/PhotoCapture';
import { ReviewSubmit } from '@/presentation/components/features/ReviewSubmit';
import { useInspection } from '@/presentation/hooks/useInspection';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Button } from '@/presentation/components/ui/Button/Button';
// ✅ IMPORT LENGKAP DARI INTERFACES
import { 
  InspectionStatus, 
  Assessments, 
  GeoData 
} from '@/core/types/interfaces';
import styles from './page.module.css';

interface InspectPageProps {
  params: {
    locationId: string;
  };
}

type Step = 'assessment' | 'photo' | 'review';

interface InspectionData {
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoData?: string;
  geoData?: GeoData;
}

export default function InspectPage({ params }: InspectPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createInspection, loading, error } = useInspection();
  
  const [step, setStep] = useState<Step>('assessment');
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const [location, setLocation] = useState<{ id: string; name: string } | null>(null);

  const locationId = params.locationId;

  // Load location details - UPDATED WITH REAL UUIDs
  useEffect(() => {
    // Real UUID data from our database migration
    const realLocations: Record<string, { id: string; name: string }> = {
      '550e8400-e29b-41d4-a716-446655440001': { 
        id: '550e8400-e29b-41d4-a716-446655440001', 
        name: 'Toilet Lobby' 
      },
      '550e8400-e29b-41d4-a716-446655440002': { 
        id: '550e8400-e29b-41d4-a716-446655440002', 
        name: 'Toilet Lt 1 Depan' 
      },
      '550e8400-e29b-41d4-a716-446655440003': { 
        id: '550e8400-e29b-41d4-a716-446655440003', 
        name: 'Toilet Lt 1 Belakang' 
      },
      '550e8400-e29b-41d4-a716-446655440004': { 
        id: '550e8400-e29b-41d4-a716-446655440004', 
        name: 'Toilet Lt 2 Depan' 
      },
      '550e8400-e29b-41d4-a716-446655440005': { 
        id: '550e8400-e29b-41d4-a716-446655440005', 
        name: 'Toilet Lt 2 Belakang' 
      },
      '550e8400-e29b-41d4-a716-446655440006': { 
        id: '550e8400-e29b-41d4-a716-446655440006', 
        name: 'Toilet Lt 3 Depan' 
      },
      '550e8400-e29b-41d4-a716-446655440007': { 
        id: '550e8400-e29b-41d4-a716-446655440007', 
        name: 'Toilet Lt 3 Belakang' 
      },
      '550e8400-e29b-41d4-a716-446655440008': { 
        id: '550e8400-e29b-41d4-a716-446655440008', 
        name: 'Toilet Security' 
      },
    };

    const loc = realLocations[locationId];
    if (loc) {
      setLocation(loc);
    } else {
      console.error('❌ Location not found:', locationId);
      alert('Lokasi tidak ditemukan');
      router.push('/dashboard/scan');
    }
  }, [locationId, router]);

  // ... rest of the code remains the same
  const handleAssessmentComplete = (data: {
    status: InspectionStatus;
    assessments: Assessments;
    overallComment?: string;
  }) => {
    console.log('📝 Assessment complete:', data);
    
    setInspectionData({
      status: data.status,
      assessments: data.assessments,
      overallComment: data.overallComment,
    });

    setStep('photo');
  };

  const handlePhotoComplete = (data: {
    photoData: string;
    geoData?: GeoData;
  }) => {
    console.log('📸 Photo captured');
    
    setInspectionData(prev => ({
      ...prev!,
      photoData: data.photoData,
      geoData: data.geoData,
    }));

    setStep('review');
  };

  const handleSubmit = async () => {
    if (!user || !inspectionData || !location) {
      alert('Data tidak lengkap');
      return;
    }

    console.log('📝 ============================================');
    console.log('📝 SUBMITTING INSPECTION');
    console.log('📝 User:', user.email);
    console.log('📝 Location:', location.name);
    console.log('📝 Location ID (UUID):', location.id); // ✅ Now shows UUID
    console.log('📝 ============================================');

    try {
      await createInspection({
        userId: user.id,
        locationId: location.id, // ✅ Now using UUID
        status: inspectionData.status,
        assessments: inspectionData.assessments,
        overallComment: inspectionData.overallComment,
        photoData: inspectionData.photoData,
        geoData: inspectionData.geoData,
      });

      // Success!
      alert('✅ Inspeksi berhasil disimpan!');
      router.push('/dashboard');
    } catch (err) {
      console.error('❌ Submission error:', err);
    }
  };

  const handleBack = () => {
    if (step === 'photo') {
      setStep('assessment');
    } else if (step === 'review') {
      setStep('photo');
    } else {
      router.push('/dashboard/scan');
    }
  };

  if (!location) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Memuat lokasi...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleBack}
          disabled={loading}
        >
          ← Kembali
        </Button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Inspeksi Toilet</h1>
          <p className={styles.subtitle}>{location.name}</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progress}>
        <div className={`${styles.progressStep} ${step === 'assessment' ? styles.active : styles.completed}`}>
          <div className={styles.progressDot}>1</div>
          <span>Penilaian</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${step === 'photo' ? styles.active : step === 'review' ? styles.completed : ''}`}>
          <div className={styles.progressDot}>2</div>
          <span>Foto</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${step === 'review' ? styles.active : ''}`}>
          <div className={styles.progressDot}>3</div>
          <span>Review</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Step Content */}
      <div className={styles.content}>
        {step === 'assessment' && (
          <AssessmentForm
            locationName={location.name}
            onSubmit={handleAssessmentComplete}
          />
        )}

        {step === 'photo' && (
          <PhotoCapture
            onCapture={handlePhotoComplete}
            onSkip={() => {
              handlePhotoComplete({
                photoData: '', // No photo
                geoData: undefined
              });
            }}
          />
        )}

        {step === 'review' && inspectionData && (
          <ReviewSubmit
            locationName={location.name}
            status={inspectionData.status}
            assessments={inspectionData.assessments}
            overallComment={inspectionData.overallComment}
            photoPreview={inspectionData.photoData}
            geoData={inspectionData.geoData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}