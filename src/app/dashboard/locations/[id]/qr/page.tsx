// ===================================
// 📁 src/app/dashboard/locations/[id]/qr/page.tsx
// PAGE: Show QR for specific location
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
import QRCodeDisplay from '@/presentation/components/features/locations/QRCodeDisplay';
import styles from './qr.module.css';

export default function LocationQRPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;
  
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const locations = await getLocationsUseCase.execute();
        const found = locations.find(l => l.id === locationId);
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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!location) {
    return (
      <div className={styles.notFound}>
        <h2>Location not found</h2>
        <button onClick={() => router.back()}>Go Back</button>
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
        <h1 className={styles.title}>QR Code</h1>
      </header>

      <main className={styles.main}>
        <QRCodeDisplay
          locationId={location.id}
          locationCode={location.code || location.id}
          locationName={location.name}
          size={300}
        />

        <div className={styles.instructions}>
          <h3>Cara Menggunakan:</h3>
          <ol>
            <li>Download QR code dengan klik tombol "Download"</li>
            <li>Print dan tempel di lokasi toilet</li>
            <li>Cleaner scan QR untuk mulai inspeksi</li>
            <li>Atau bagikan URL langsung via WhatsApp/Email</li>
          </ol>
        </div>

        <div className={styles.printButton}>
          <button 
            onClick={() => window.print()}
            className={styles.btn}
          >
            🖨️ Print QR Code
          </button>
        </div>
      </main>
    </div>
  );
}
