// ===================================
// 📁 src/app/scan/[code]/page.tsx
// ROUTE: Parse QR code and redirect
// ===================================
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getLocationsUseCase } from '@/lib/di';

export default function ScanCodePage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;

  useEffect(() => {
    const findLocation = async () => {
      try {
        // Strategy 1: Find by code
        const locations = await getLocationsUseCase.execute();
        const location = locations.find(l => l.code === code);

        if (location) {
          // Redirect to inspection page
          router.replace(`/dashboard/inspect/${location.id}`);
        } else {
          // Strategy 2: Try parse as UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(code)) {
            router.replace(`/dashboard/inspect/${code}`);
          } else {
            // Invalid code
            alert('QR code tidak valid atau lokasi tidak ditemukan');
            router.replace('/dashboard/locations');
          }
        }
      } catch (error) {
        console.error('Error finding location:', error);
        alert('Gagal memproses QR code');
        router.replace('/dashboard/locations');
      }
    };

    if (code) {
      findLocation();
    }
  }, [code, router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: '#F7F7F8'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#6B7280' }}>
          Memproses QR code...
        </p>
      </div>
    </div>
  );
}
