// app/dashboard/inspect/[locationId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Location } from '@/core/entities/Location';
import { AssessmentForm } from '@/presentation/components/features/AssessmentForm/AssessmentForm';
import styles from './page.module.css';

export default function InspectLocationPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.locationId as string;
  
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    if (locationId) {
      loadLocation();
    }
  }, [locationId]);

  const loadLocation = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔄 Loading location:', locationId);
      const response = await fetch(`/api/locations/${locationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Lokasi tidak ditemukan');
        }
        throw new Error(`Gagal memuat lokasi: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Location loaded:', data);
      setLocation(data);
      
    } catch (error) {
      console.error('❌ Error loading location:', error);
      setError(error instanceof Error ? error.message : 'Gagal memuat data lokasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInspection = () => {
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (assessmentData: any) => {
    console.log('✅ Assessment completed:', assessmentData);
    // TODO: Save assessment data to database
    alert('Inspeksi berhasil disimpan!');
    setShowAssessment(false);
    // Optional: Redirect to reports or history
    // router.push('/dashboard/history');
  };

  const handleAssessmentCancel = () => {
    setShowAssessment(false);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Memuat data lokasi...</div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Lokasi Tidak Ditemukan</h1>
          <p className={styles.errorMessage}>{error || 'Lokasi tidak tersedia'}</p>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => router.push('/dashboard/inspect')}
              className={styles.primaryButton}
            >
              Pilih Lokasi Lain
            </button>
            <button
              onClick={() => router.push('/dashboard/scan')}
              className={styles.secondaryButton}
            >
              Scan QR Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {showAssessment ? 'Form Inspeksi' : 'Inspeksi Lokasi'}
          </h1>
          <p className={styles.subtitle}>
            {showAssessment 
              ? `Isi form inspeksi untuk ${location.name}` 
              : 'Lokasi yang akan diinspeksi'
            }
          </p>
        </div>
        {!showAssessment && (
          <button
            onClick={() => router.push('/dashboard/inspect')}
            className={styles.backButton}
          >
            Ganti Lokasi
          </button>
        )}
      </div>

      {!showAssessment ? (
        <>
          {/* Location Info Card */}
          <div className={styles.locationCard}>
            <div className={styles.locationHeader}>
              <h2 className={styles.locationName}>{location.name}</h2>
              <span className={styles.locationCode}>{location.code}</span>
            </div>
            
            <div className={styles.locationDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Lantai:</span>
                <span className={styles.detailValue}>
                  {location.floor === 0 ? 'Lobby' : `Lantai ${location.floor}`}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Bagian:</span>
                <span className={styles.detailValue}>{location.section}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dibuat:</span>
                <span className={styles.detailValue}>
                  {new Date(location.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>

            <div className={styles.actionSection}>
              <button
                onClick={handleStartInspection}
                className={styles.inspectButton}
              >
                Mulai Inspeksi
              </button>
              
              <button
                onClick={() => router.push('/dashboard/inspect')}
                className={styles.cancelButton}
              >
                Pilih Lokasi Lain
              </button>
            </div>
          </div>

          {/* Quick Instructions */}
          <div className={styles.instructions}>
            <h3>Petunjuk Inspeksi:</h3>
            <ul>
              <li>Pastikan Anda berada di lokasi yang benar</li>
              <li>Siapkan alat bantu yang diperlukan</li>
              <li>Isi form dengan jujur dan teliti</li>
              <li>Ambil foto jika diperlukan</li>
            </ul>
          </div>
        </>
      ) : (
        /* Assessment Form Section */
        <div className={styles.assessmentSection}>
          <div className={styles.assessmentHeader}>
            <h2 className={styles.assessmentTitle}>
              Form Inspeksi - {location.name}
            </h2>
            <p className={styles.assessmentSubtitle}>
              Kode: {location.code} | {location.floor === 0 ? 'Lobby' : `Lantai ${location.floor}`} | {location.section}
            </p>
          </div>

          <AssessmentForm
            locationId={locationId}
            locationName={location.name}
            onComplete={handleAssessmentComplete}
            onCancel={handleAssessmentCancel}
          />
        </div>
      )}
    </div>
  );
}