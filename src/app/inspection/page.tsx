// src/app/inspection/page.tsx
// ============================================
// INSPECTION PAGE - Standalone Quick Access
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { InspectionForm } from '@/components/features/Inspection/InspectionForm';
import styles from './page.module.css';

export default function StandaloneInspectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const locationId = searchParams.get('location_id');
  const templateId = searchParams.get('template_id');

  // Redirect to dashboard if not logged in
  useEffect(() => {
    if (!loading && !user) {
      // Save intended destination
      const params = new URLSearchParams();
      if (locationId) params.set('location_id', locationId);
      if (templateId) params.set('template_id', templateId);
      
      const returnUrl = params.toString() 
        ? `/inspection?${params.toString()}`
        : '/inspection';
      
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, loading, router, locationId, templateId]);

  const handleSuccess = (inspectionId: string) => {
    router.push(`/inspection/success?id=${inspectionId}`);
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
      {/* Minimal Header */}
      <header className={styles.header}>
        <button
          onClick={() => router.push('/dashboard')}
          className={styles.backButton}
          aria-label="Kembali"
        >
          ← Kembali
        </button>
        <h1 className={styles.title}>Quick Inspection</h1>
      </header>

      {/* Form */}
      <div className={styles.content}>
        <InspectionForm
          templateId={templateId || undefined}
          locationId={locationId || undefined}
          userId={user.id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}