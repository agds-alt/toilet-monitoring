// ===================================
// 📁 src/app/dashboard/locations/[id]/qr/page.tsx
// Page untuk show QR specific location
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer } from 'lucide-react';
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
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading QR Code...</p>
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
      <header className={styles.header} data-print-hide>
        <button onClick={() => router.back()} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>QR Code Generator</h1>
        <div className={styles.headerActions}>
          <button onClick={() => window.print()} className={styles.btnPrimary}>
            <Printer size={18} />
            Print
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <QRCodeDisplay
          locationId={location.id}
          locationCode={location.code || location.id}
          locationName={location.name}
          building={location.building || undefined}
          floor={location.floor || undefined}
          size={280}
        />

        <div className={styles.instructions} data-print-hide>
          <h3>📋 Cara Menggunakan QR Code:</h3>
          <ol>
            <li>
              <strong>Download</strong> QR code dengan klik tombol "Download PNG"
            </li>
            <li>
              <strong>Print</strong> langsung dengan klik tombol "Print"
            </li>
            <li>
              <strong>Tempel</strong> QR code di pintu masuk toilet atau area yang mudah terlihat
            </li>
            <li>
              <strong>Scan</strong> - Cleaner tinggal scan untuk mulai inspeksi
            </li>
          </ol>

          <div className={styles.tips}>
            <h4>💡 Tips:</h4>
            <ul>
              <li>Print dengan ukuran minimal 10x10 cm agar mudah di-scan</li>
              <li>Gunakan kertas berkualitas atau laminating agar tahan lama</li>
              <li>Pasang di tempat yang terang dan tidak terhalang</li>
              <li>Test scan QR sebelum ditempel permanent</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}