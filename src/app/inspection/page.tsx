// src/app/inspection/page.tsx
// ============================================
// MAIN INSPECTION PAGE - Complete Implementation
// ============================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InspectionForm } from '@/features/Inspection/InspectionForm';
import { QRScannerModal } from '@/features/Inspection/QRSCannerModal';
import styles from './inspection.module.css';

export default function InspectionPage() {
  const router = useRouter();
  const [qrScannerOpen, setQRScannerOpen] = useState(false);
  const [locationId, setLocationId] = useState<string | undefined>();
  const [locationName, setLocationName] = useState<string | undefined>();
  const [userId] = useState<string>('temp-user-id'); // TODO: Get from auth context

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

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <button
          onClick={handleCancel}
          className={styles.backButton}
          aria-label="Back"
        >
          ← Kembali
        </button>
        <h1 className={styles.pageTitle}>Inspection Form</h1>
        {locationName && (
          <div className={styles.locationBadge}>
            📍 {locationName}
          </div>
        )}
      </div>

      {/* Main Form */}
      <InspectionForm
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