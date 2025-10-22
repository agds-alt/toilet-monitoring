// ===================================
// 📁 src/app/dashboard/inspect/[locationId]/page.tsx
// Inspection Page - Placeholder (temporary)
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Building, Layers, ClipboardCheck } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
import styles from './page.module.css';

export default function InspectionPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.locationId as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

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
        <p>Loading location...</p>
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>Inspection Form</h1>
      </header>

      <main className={styles.main}>
        {/* Location Info Card */}
        <div className={styles.locationCard}>
          <div className={styles.locationHeader}>
            <MapPin size={24} color="#2563EB" />
            <div className={styles.locationInfo}>
              <h2 className={styles.locationName}>{location.name}</h2>
              <div className={styles.locationMeta}>
                {location.building && (
                  <span className={styles.metaItem}>
                    <Building size={14} />
                    {location.building}
                  </span>
                )}
                {location.floor && (
                  <span className={styles.metaItem}>
                    <Layers size={14} />
                    Lantai {location.floor}
                  </span>
                )}
                {location.code && (
                  <span className={styles.metaItem}>
                    <code className={styles.code}>{location.code}</code>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>
            <ClipboardCheck size={80} />
          </div>
          <h2 className={styles.comingSoonTitle}>Inspection Form</h2>
          <p className={styles.comingSoonText}>
            Form assessment dengan 11 komponen penilaian kebersihan toilet akan segera tersedia di
            sini.
          </p>

          <div className={styles.features}>
            <h3>Fitur yang akan tersedia:</h3>
            <ul>
              <li>✅ Assessment 11 komponen (Aroma, Lantai, Wastafel, dll)</li>
              <li>✅ Photo capture dengan geolocation</li>
              <li>✅ Scoring system 1-100</li>
              <li>✅ Comments per komponen</li>
              <li>✅ Real-time validation</li>
              <li>✅ Offline support</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => router.push('/dashboard/locations')}
              className={styles.btnPrimary}
            >
              Kembali ke Location List
            </button>
            <button onClick={() => router.push('/dashboard/scan')} className={styles.btnSecondary}>
              Scan QR Lagi
            </button>
          </div>
        </div>

        {/* Debug Info (Remove in production) */}
        <div className={styles.debug}>
          <h4>🔍 Debug Info:</h4>
          <pre>{JSON.stringify(location, null, 2)}</pre>
        </div>
      </main>
    </div>
  );
}
