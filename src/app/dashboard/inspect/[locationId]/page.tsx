// src/app/(dashboard)/inspect/[locationId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AssessmentForm } from '@/presentation/components/features/AssessmentForm/AssessmentForm';
import { PhotoCapture } from '@/presentation/components/features/PhotoCapture/PhotoCapture';
import { Button } from '@/presentation/components/ui/Button/Button';
import { Card } from '@/presentation/components/ui/Card/Card';
import { useAuth } from '@/presentation/contexts/AuthProvider';
import { useInspection } from '@/presentation/hooks/useInspection';
import { useGeolocation } from '@/presentation/hooks/useGeolocation';
import { getLocationById } from '@/lib/constants/locations';
import { InspectionStatus } from '@/core/types/enums';
import { Assessments } from '@/core/types/interfaces';

type Step = 'assessment' | 'photo' | 'submitting' | 'success';

export default function InspectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { createInspection, loading } = useInspection();
  const { geoData } = useGeolocation();

  const locationId = params.locationId as string;
  const location = getLocationById(locationId);

  const [step, setStep] = useState<Step>('assessment');
  const [assessmentData, setAssessmentData] = useState<{
    status: InspectionStatus;
    assessments: Assessments;
    overallComment?: string;
  } | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  if (!location) {
    return (
      <div className="container">
        <Card variant="elevated" padding="lg">
          <h2>Lokasi tidak ditemukan</h2>
          <Button onClick={() => router.push('/dashboard/scan')}>
            Kembali ke Scanner
          </Button>
        </Card>
                <Card variant="elevated" padding="lg">
          <h2>Lokasi tidak ditemukan</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Kembali ke Scanner
          </Button>
        </Card>
              
                <Card variant="elevated" padding="lg">
          <h2>Lokasi tidak ditemukan</h2>
          <Button onClick={() => router.push('/dashboard/history')}>
            Kembali ke Scanner
          </Button>
        </Card>
      </div>
    );
  }

  const handleAssessmentSubmit = (data: typeof assessmentData) => {
    setAssessmentData(data);
    setStep('photo');
  };

  const handlePhotoCapture = (data: string) => {
    setPhotoData(data);
    handleFinalSubmit(data);
  };

  const handleSkipPhoto = () => {
    handleFinalSubmit(null);
  };

// UPDATE handleFinalSubmit function:

const handleFinalSubmit = async (photo: string | null) => {
  if (!user || !assessmentData) return;

  console.log('📝 ============================================');
  console.log('📝 SUBMITTING INSPECTION');
  console.log('📝 User:', user.email);
  console.log('📝 Location:', location.name);
  console.log('📝 ============================================');

  setStep('submitting');

  try {
    await createInspection({
      userId: user.id,
      locationId: location.id,
      status: assessmentData.status,
      assessments: assessmentData.assessments,
      overallComment: assessmentData.overallComment,
      photoData: photo || undefined,
      geoData: geoData || undefined
    });

    console.log('✅ Submit successful!');
    setStep('success');
  } catch (error: any) {
    console.error('❌ Submit failed!');
    console.error('Error:', error);
    
    // Show detailed error to user
    const errorMsg = error.message || 'Unknown error';
    alert(
      `❌ GAGAL MENYIMPAN!\n\n` +
      `Error: ${errorMsg}\n\n` +
      `Cek console browser (F12) untuk detail lengkap.`
    );
    
    setStep('photo');
  }
};


  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {step === 'assessment' && (
        <AssessmentForm
          locationName={location.name}
          onSubmit={handleAssessmentSubmit}
        />
      )}

      {step === 'photo' && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onSkip={handleSkipPhoto}
        />
      )}

      {step === 'submitting' && (
        <Card variant="elevated" padding="lg" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Mengirim Laporan...</h2>
          <p style={{ color: 'var(--color-gray-600)', marginTop: '0.5rem' }}>
            {photoData ? 'Mengupload foto dan data...' : 'Menyimpan data...'}
          </p>
        </Card>
      )}

      {step === 'success' && (
        <Card variant="elevated" padding="lg" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Laporan Berhasil!</h2>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            Data sudah tersimpan di sistem
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push('/dashboard/scan')}
            >
              Lapor Toilet Lain
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push('/dashboard/history')}
            >
              Lihat Riwayat
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
