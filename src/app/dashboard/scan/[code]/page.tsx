
// ===================================
// 📁 src/app/scan/[code]/page.tsx
// ROUTE: Handle QR scan redirect
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Loader } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import styles from './scan.module.css';

export default function ScanCodePage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Memproses QR code...');

  useEffect(() => {
    const findLocation = async () => {
      try {
        console.log('🔍 Finding location with code:', code);
        setStatus('loading');
        setMessage('Mencari lokasi...');

        // Get all locations
        const locations = await getLocationsUseCase.execute();
        
        // Strategy 1: Find by code
        let location = locations.find(l => l.code === code);
        
        // Strategy 2: If not found, try as UUID
        if (!location) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(code)) {
            location = locations.find(l => l.id === code);
          }
        }

        if (location) {
          console.log('✅ Location found:', location.name);
          setStatus('success');
          setMessage(`Lokasi ditemukan: ${location.name}`);
          
          // Redirect to inspection page after 1 second
          setTimeout(() => {
            router.replace(`/dashboard/inspect/${location.id}`);
          }, 1000);
        } else {
          console.error('❌ Location not found');
          setStatus('error');
          setMessage('QR code tidak valid atau lokasi tidak ditemukan');
        }
      } catch (error) {
        console.error('❌ Error finding location:', error);
        setStatus('error');
        setMessage('Gagal memproses QR code');
      }
    };

    if (code) {
      findLocation();
    }
  }, [code, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <>
            <Loader className={styles.iconSpin} size={64} />
            <h2 className={styles.title}>Memproses QR Code</h2>
            <p className={styles.message}>{message}</p>
            <div className={styles.code}>
              <code>{code}</code>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.iconSuccess}>✅</div>
            <h2 className={styles.title}>Lokasi Ditemukan!</h2>
            <p className={styles.message}>{message}</p>
            <p className={styles.hint}>Redirecting to inspection...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.iconError}>❌</div>
            <h2 className={styles.title}>QR Code Tidak Valid</h2>
            <p className={styles.message}>{message}</p>
            <div className={styles.actions}>
              <button 
                onClick={() => router.push('/dashboard/scan')}
                className={styles.btnPrimary}
              >
                Scan Ulang
              </button>
              <button 
                onClick={() => router.push('/dashboard/locations')}
                className={styles.btnSecondary}
              >
                Pilih Manual
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}