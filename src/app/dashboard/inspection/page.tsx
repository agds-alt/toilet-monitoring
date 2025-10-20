// src/app/dashboard/inspection/page.tsx
// ============================================
// INSPECTION PAGE - Dashboard Integration
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { InspectionForm } from '@/presentation/components/features/Inspection/InspectionForm';
import styles from './page.module.css';

export default function InspectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const locationId = searchParams.get('location_id');
  const templateId = searchParams.get('template_id');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleSuccess = (inspectionId: string) => {
    router.push(`/dashboard/inspection/success?id=${inspectionId}`);
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          onClick={() => router.push('/dashboard')}
          className={styles.breadcrumbLink}
        >
          Dashboard
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Inspeksi</span>
      </div>

      {/* Form */}
      <InspectionForm
        templateId={templateId || undefined}
        locationId={locationId || undefined}
        userId={user.id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}