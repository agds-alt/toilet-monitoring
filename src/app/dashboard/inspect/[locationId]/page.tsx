// ============================================
// FIX 2: src/app/dashboard/inspect/[locationId]/page.tsx
// Remove locationId prop from AssessmentForm
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useInspection } from '@/presentation/hooks/useInspection';
import AssessmentForm from '@/presentation/components/features/AssessmentForm/AssessmentForm';
import PhotoCapture from '@/presentation/components/features/PhotoCapture/PhotoCapture';
import { InspectionStatus } from '@/core/types/enums';
import { Assessments } from '@/core/types/interfaces';
import { getLocationById, isValidUUID } from '@/lib/constants/locations';
import styles from './page.module.css';

type Step = 'assessment' | 'photo' | 'complete';

interface GeoData {
  latitude: number;
  longitude: number;
}

interface InspectionData {
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoData?: string;
  geoData?: GeoData;
}

interface InspectPageProps {
  params: {
    locationId: string;
  };
}

export default function InspectPage({ params }: InspectPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createInspection, loading } = useInspection();
  
  const [step, setStep] = useState<Step>('assessment');
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const locationId = params.locationId;

  useEffect(() => {
    if (!isValidUUID(locationId)) {
      setLocationError('ID lokasi tidak valid');
      return;
    }

    const location = getLocationById(locationId);
    if (!location) {
      setLocationError('Lokasi tidak ditemukan');
    }
  }, [locationId]);

  if (locationError) {
    return (
      <div className={styles.errorContainer}>
        <h2>⚠️ Kesalahan</h2>
        <p>{locationError}</p>
        <button onClick={() => router.push('/dashboard/scan')}>
          Kembali ke Scan
        </button>
      </div>
    );
  }

  const location = getLocationById(locationId);
  if (!location) return null;

  const handleAssessmentComplete = (data: {
    status: InspectionStatus;
    assessments: Assessments;
    overallComment?: string;
  }) => {
    setInspectionData({
      status: data.status,
      assessments: data.assessments,
      overallComment: data.overallComment,
    });
    setStep('photo');
  };

  const handlePhotoCapture = async (data: {
    photoData: string;
    geoData?: GeoData;
  }) => {
    if (!user) {
      alert('Anda harus login');
      router.push('/login');
      return;
    }

    const finalData = { ...inspectionData!, ...data };

    try {
      await createInspection({
        userId: user.id,
        locationId: locationId,
        status: finalData.status,
        assessments: finalData.assessments,
        overallComment: finalData.overallComment,
        photoData: finalData.photoData,
        geoData: finalData.geoData,
      });

      setStep('complete');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      alert(`Gagal: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()}>← Kembali</button>
        <h1>{location.name}</h1>
      </div>

      {step === 'assessment' && (
        <AssessmentForm
          locationName={location.name}
          onSubmit={handleAssessmentComplete}
        />
      )}

      {step === 'photo' && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onSkip={() => handlePhotoCapture({ photoData: '' })}
        />
      )}

      {step === 'complete' && (
        <div className={styles.successBox}>
          <div>✅</div>
          <h2>Inspeksi Berhasil!</h2>
        </div>
      )}

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Menyimpan...</p>
        </div>
      )}
    </div>
  );
}
