// ============================================
// FIX 1: src/app/dashboard/scan/page.tsx
// Add missing imports and fix props
// ============================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScannerV2 } from '@/presentation/components/features/QRScanner/QRScannerV2';
import Button from '@/presentation/components/ui/Button/Button';
import styles from './page.module.css';

const QR_TO_UUID_MAP: Record<string, string> = {
  'LOBBY': '550e8400-e29b-41d4-a716-446655440001',
  'LT1-DEPAN': '550e8400-e29b-41d4-a716-446655440002',
  'LT1-BELAKANG': '550e8400-e29b-41d4-a716-446655440003',
  'LT2-DEPAN': '550e8400-e29b-41d4-a716-446655440004',
  'LT2-BELAKANG': '550e8400-e29b-41d4-a716-446655440005',
  'LT3-DEPAN': '550e8400-e29b-41d4-a716-446655440006',
  'LT3-BELAKANG': '550e8400-e29b-41d4-a716-446655440007',
  'SECURITY': '550e8400-e29b-41d4-a716-446655440008',
  '1': '550e8400-e29b-41d4-a716-446655440001',
  '2': '550e8400-e29b-41d4-a716-446655440002',
  '3': '550e8400-e29b-41d4-a716-446655440003',
  '4': '550e8400-e29b-41d4-a716-446655440004',
  '5': '550e8400-e29b-41d4-a716-446655440005',
  '6': '550e8400-e29b-41d4-a716-446655440006',
  '7': '550e8400-e29b-41d4-a716-446655440007',
  '8': '550e8400-e29b-41d4-a716-446655440008',
};

export default function ScanPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (qrData: string) => {
    console.log('📱 QR Scanned:', qrData);
    const locationUUID = QR_TO_UUID_MAP[qrData];
    
    if (!locationUUID) {
      setError(`QR Code tidak valid: ${qrData}`);
      setScanning(false);
      return;
    }

    setScanning(false);
    router.push(`/dashboard/inspect/${locationUUID}`);
  };

  const handleManualSelect = () => {
    router.push('/dashboard/locations');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Scan QR Code</h1>
        <p>Arahkan kamera ke QR Code lokasi toilet</p>
      </div>

      {scanning && !error && (
        <QRScannerV2 
          onScan={handleScan}
          onManualSelect={handleManualSelect}
        />
      )}

      {error && (
        <div className={styles.errorBox}>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <Button onClick={() => { setError(null); setScanning(true); }}>
              Coba Lagi
            </Button>
            <Button onClick={handleManualSelect} variant="secondary">
              Pilih Manual
            </Button>
          </div>
        </div>
      )}

      <div className={styles.instructions}>
        <h3>Tips Scan QR:</h3>
        <ul>
          <li>Pastikan pencahayaan cukup</li>
          <li>Posisikan QR code di tengah frame</li>
          <li>Jaga jarak 10-30cm dari kamera</li>
        </ul>
      </div>
    </div>
  );
}

