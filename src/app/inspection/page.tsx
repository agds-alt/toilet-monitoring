// src/app/inspection/page.tsx
// ============================================
// MAIN INSPECTION PAGE - Updated for Refactored Form
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InspectionForm } from '@/presentation/components/features/Inspection/InspectionForm';
import { QRScannerModal } from '@/features/Inspection/QRSCannerModal';
import styles from './inspection.module.css';

export default function InspectionPage() {
  const router = useRouter();
  const [qrScannerOpen, setQRScannerOpen] = useState(false);
  const [locationId, setLocationId] = useState<string | undefined>();
  const [locationName, setLocationName] = useState<string | undefined>();
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [userId] = useState<string>('temp-user-id'); // TODO: Get from auth context
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // LOAD DEFAULT TEMPLATE
  // ============================================
  useEffect(() => {
    async function loadDefaultTemplate() {
      try {
        setIsLoading(true);
        setError(null);

        // Get default template
        const response = await fetch('/api/templates?default=true');

        if (!response.ok) {
          throw new Error('Failed to load default template');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error('No default template found');
        }

        setTemplateId(result.data.id);
        console.log('✅ Default template loaded:', result.data.name);
      } catch (err: any) {
        console.error('❌ Error loading template:', err);
        setError(err.message || 'Failed to load template');
      } finally {
        setIsLoading(false);
      }
    }

    loadDefaultTemplate();
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleLocationFound = (id: string, name: string) => {
    console.log('✅ Location selected:', name);
    setLocationId(id);
    setLocationName(name);
    setQRScannerOpen(false);
  };

  const handleSuccess = (inspectionId: string) => {
    console.log('✅ Inspection submitted:', inspectionId);
    router.push(`/inspection/success?id=${inspectionId}`);
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  const openQRScanner = () => {
    setQRScannerOpen(true);
  };

  // ============================================
  // RENDER - Loading State
  // ============================================

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Memuat template inspeksi...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - Error State
  // ============================================

  if (error || !templateId) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>❌</div>
          <h2 className={styles.errorTitle}>Gagal Memuat Form</h2>
          <p className={styles.errorMessage}>{error || 'Template inspeksi tidak ditemukan'}</p>
          <div className={styles.errorActions}>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
              ← Kembali ke Dashboard
            </button>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              🔄 Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - Main Form
  // ============================================

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <button onClick={handleCancel} className={styles.backButton} aria-label="Back">
          ← Kembali
        </button>
        <h1 className={styles.pageTitle}>Form Inspeksi Toilet</h1>
        {locationName && <div className={styles.locationBadge}>📍 {locationName}</div>}
      </div>

      {/* Main Form */}
      <InspectionForm
        templateId={templateId}
        locationId={locationId}
        userId={userId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onOpenQRScanner={openQRScanner}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQRScannerOpen(false)}
        onLocationFound={handleLocationFound}
      />
    </div>
  );
}
