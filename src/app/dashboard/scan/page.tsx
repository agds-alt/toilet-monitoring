'use client';

import { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/presentation/components/ui/Card/Card';
import { Button } from '@/presentation/components/ui/Button/Button';
import { getLocationByCode } from '@/lib/constants/locations';

// Lazy load QR Scanner - saves 12 KB (vs 381 KB before!)
const QRScannerV2 = lazy(() => 
  import('@/presentation/components/features/QRScanner/QRScannerV2')
    .then(module => ({ default: module.QRScannerV2 }))
);

const LocationSelector = lazy(() =>
  import('@/presentation/components/features/LocationSelector/LocationSelector')
    .then(module => ({ default: module.LocationSelector }))
);

export default function ScanPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'start' | 'scan' | 'manual'>('start');

  const handleQRScan = (code: string) => {
    console.log('QR Scanned:', code);
    const location = getLocationByCode(code);
    
    if (location) {
      router.push(`/inspect/${location.id}`);
    } else {
      alert('QR code tidak dikenali. Silakan pilih lokasi manual.');
      setMode('manual');
    }
  };

  const handleLocationSelect = (location: any) => {
    router.push(`/dashboard/inspect/${location.id}`);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Initial screen */}
      {mode === 'start' && (
        <Card variant="elevated" padding="lg" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧹</div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            Smart Toilet Check
          </h1>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            Pilih metode untuk memulai inspeksi
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setMode('scan')}
              icon="📷"
            >
              Scan QR Code
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setMode('manual')}
              icon="📍"
            >
              Pilih Lokasi Manual
            </Button>
          </div>
        </Card>
      )}

      {/* QR Scanner (lazy loaded) */}
      {mode === 'scan' && (
        <Suspense fallback={
          <Card variant="elevated" padding="lg" style={{ textAlign: 'center' }}>
            <div style={{ padding: '3rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px',
                border: '4px solid var(--color-gray-200)',
                borderTop: '4px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p>Loading scanner...</p>
            </div>
          </Card>
        }>
          <QRScannerV2
            onScan={handleQRScan}
            onManualSelect={() => setMode('manual')}
          />
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setMode('start')}
            style={{ marginTop: '1rem' }}
          >
            Kembali
          </Button>
        </Suspense>
      )}

      {/* Location Selector (lazy loaded) */}
      {mode === 'manual' && (
        <Suspense fallback={
          <Card variant="elevated" padding="lg">
            <p>Loading...</p>
          </Card>
        }>
          <LocationSelector
            onSelect={handleLocationSelect}
            onBack={() => setMode('start')}
          />
        </Suspense>
      )}
    </div>
  );
}

