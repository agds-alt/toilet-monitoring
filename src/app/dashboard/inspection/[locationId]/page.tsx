// ===================================
// 📁 src/app/dashboard/inspect/[locationId]/page.tsx
// Inspection Form with Dual Mode
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Briefcase } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
import InspectionModeSelector from '@/features/Inspection/InspectionModeSelector';
import styles from './inspect.module.css';

export type InspectionMode = 'genz' | 'professional';

export default function InspectionPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.locationId as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<InspectionMode | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const locations = await getLocationsUseCase.execute();
        const found = locations.find((l) => l.id === locationId);
        setLocation(found || null);
      } catch (error) {
        console.error('Failed to load location:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [locationId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className={styles.notFound}>
        <h2>Location not found</h2>
        <button onClick={() => router.back()} className={styles.btn}>
          Go Back
        </button>
      </div>
    );
  }

  // Mode selection screen
  if (!mode) {
    return (
      <InspectionModeSelector
        location={location}
        onSelectMode={setMode}
        onBack={() => router.back()}
      />
    );
  }
}
