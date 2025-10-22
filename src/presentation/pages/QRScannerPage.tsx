// src/app/scan/page.tsx
// QR Code Scanner Page

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  X, 
  FlashlightOff, 
  FlashlightOn,
  MapPin,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { supabase } from '@/auth/supabase-auth';

export default function QRScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [processingQR, setProcessingQR] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startScanning();
    
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setScanning(true);

      const html5QrCode = new Html5Qrcode('reader');
      setScanner(html5QrCode);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanError
      );
    } catch (err: any) {
      console.error('Scanner error:', err);
      setError(err.message || 'Tidak dapat mengakses kamera');
      setScanning(false);
    }
  };

  const onScanSuccess = async (decodedText: string, decodedResult: any) => {
    if (processingQR) return; // Prevent multiple scans
    
    console.log('QR Code detected:', decodedText);
    setProcessingQR(true);

    try {
      // Parse QR code - expecting format: toilet-monitoring:location:{locationId}
      let locationId = '';
      
      if (decodedText.startsWith('toilet-monitoring:location:')) {
        locationId = decodedText.replace('toilet-monitoring:location:', '');
      } else if (decodedText.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Direct UUID
        locationId = decodedText;
      } else {
        // Try to find location by QR code
        const { data, error } = await supabase
          .from('locations')
          .select('id')
          .eq('qr_code', decodedText)
          .single();
        
        if (data) {
          locationId = data.id;
        } else {
          throw new Error('QR Code tidak valid');
        }
      }

      if (!locationId) {
        throw new Error('Lokasi tidak ditemukan');
      }

      // Verify location exists
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .single();

      if (locationError || !location) {
        throw new Error('Lokasi tidak ditemukan dalam database');
      }

      // Stop scanner
      if (scanner) {
        await scanner.stop();
      }

      // Navigate to inspection form
      router.push(`/inspection/${locationId}`);
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'QR Code tidak valid');
      setProcessingQR(false);
      
      // Resume scanning after error
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const onScanError = (errorMessage: string) => {
    // Ignore frequent scan errors
    if (errorMessage.includes('NotFoundException')) {
      return;
    }
    console.log('Scan error:', errorMessage);
  };

  const toggleFlash = async () => {
    if (scanner) {
      const capabilities = scanner.getRunningTrackCameraCapabilities();
      if (capabilities.torchFeature) {
        try {
          if (flashOn) {
            await scanner.applyVideoConstraints({
              torch: false,
              advanced: [{ torch: false }]
            });
          } else {
            await scanner.applyVideoConstraints({
              torch: true,
              advanced: [{ torch: true }]
            });
          }
          setFlashOn(!flashOn);
        } catch (err) {
          console.error('Flash toggle error:', err);
        }
      }
    }
  };

  const handleManualEntry = () => {
    if (scanner) {
      scanner.stop().catch(console.error);
    }
    router.push('/locations');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-gray-900 to-transparent">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white/20 backdrop-blur rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Scan QR Code</h1>
          <button
            onClick={toggleFlash}
            className="p-2 bg-white/20 backdrop-blur rounded-lg"
          >
            {flashOn ? <FlashlightOn size={24} /> : <FlashlightOff size={24} />}
          </button>
        </div>
      </header>

      {/* Scanner Area */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-md mx-auto px-4">
          {/* Scanner */}
          <div id="reader" className="rounded-2xl overflow-hidden"></div>
          
          {/* Overlay Instructions */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative">
              {/* Corner borders */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
              
              <div className="w-64 h-64"></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <p className="text-white/80">Arahkan kamera ke QR Code toilet</p>
            <p className="text-sm text-white/60 mt-2">Pastikan QR Code berada di dalam kotak</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute top-20 left-4 right-4 bg-red-500/90 backdrop-blur rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Processing Overlay */}
          {processingQR && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                <p className="text-lg font-medium">Memproses QR Code...</p>
                <p className="text-sm text-white/60 mt-2">Mengecek lokasi toilet</p>
              </div>
            </div>
          )}

          {/* Manual Entry Button */}
          <button
            onClick={handleManualEntry}
            className="w-full mt-8 py-3 px-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg flex items-center justify-center gap-2"
          >
            <MapPin size={20} />
            Pilih Lokasi Manual
          </button>
        </div>
      </div>
    </div>
  );
}
