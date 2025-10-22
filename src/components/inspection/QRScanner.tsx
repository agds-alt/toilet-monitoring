// src/components/inspection/QRScanner.tsx
// ============================================
// QR SCANNER COMPONENT - Livin Mandiri Style
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Flashlight, FlashlightOff, ScanLine } from 'lucide-react';
import jsQR from 'jsqr';

// In scanQRCode function:
const code = jsQR(imageData.data, imageData.width, imageData.height);

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera access with back camera preference
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Start scanning interval
      startScanning();
    } catch (err) {
      console.error('Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as any;

    if (capabilities.torch) {
      try {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any],
        });
        setFlashEnabled(!flashEnabled);
      } catch (err) {
        console.error('Flash error:', err);
      }
    }
  };

  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      scanQRCode();
    }, 500); // Scan every 500ms
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Use a QR code library here (e.g., jsQR)
    // For now, this is a placeholder
    try {
      // @ts-ignore - jsQR library
      if (typeof window !== 'undefined' && window.jsQR) {
        // @ts-ignore
        const code = window.jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log('QR Code detected:', code.data);
          stopCamera();
          onScanSuccess(code.data);
        }
      }
    } catch (err) {
      console.error('QR scan error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-white text-lg font-semibold">Scan QR Lokasi</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

        {/* Hidden canvas for QR detection */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Overlay - Livin Style */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Corner borders */}
          <div className="relative w-64 h-64">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />

            {/* Scanning line animation */}
            {isScanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white animate-scan">
                <ScanLine className="w-full h-full text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Instruction Text */}
        <div className="absolute bottom-32 left-0 right-0 text-center px-4">
          <p className="text-white text-lg font-medium mb-2">Arahkan kamera ke QR Code</p>
          <p className="text-white/80 text-sm">Pastikan QR Code berada di dalam frame</p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-4">
          {/* Flash Toggle */}
          <button
            onClick={toggleFlash}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {flashEnabled ? (
              <Flashlight className="w-6 h-6 text-yellow-400" />
            ) : (
              <FlashlightOff className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-4 right-4 p-4 bg-red-500 text-white rounded-lg shadow-lg">
          <p className="text-sm">{error}</p>
          <button onClick={startCamera} className="mt-2 text-sm underline">
            Coba lagi
          </button>
        </div>
      )}

      {/* CSS for scanning animation */}
      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }

        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
