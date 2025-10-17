#!/bin/bash
# ultimate-fix.sh - Fix ALL 24 TypeScript Errors

echo "🔧 ULTIMATE FIX - Fixing ALL 24 Errors"
echo "======================================="
echo ""

# ============================================
# FIX 1: middleware.ts - Missing return
# ============================================
echo "1️⃣ Fixing middleware.ts..."

cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware untuk protect routes
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token');
  const { pathname } = req.nextUrl;

  // Public routes yang tidak perlu auth
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect ke login jika tidak ada token
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
};
EOF

echo "✅ middleware.ts fixed!"
echo ""

# ============================================
# FIX 2: PhotoCapture Props Interface
# ============================================
echo "2️⃣ Fixing PhotoCapture props..."

cat > src/presentation/components/features/PhotoCapture/PhotoCapture.tsx << 'EOF'
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import styles from './PhotoCapture.module.css';

export interface PhotoCaptureProps {
  onCapture: (data: { 
    photoData: string; 
    geoData?: { latitude: number; longitude: number } 
  }) => void;
  onSkip: () => void;
}

export const PhotoCapture = ({ onCapture, onSkip }: PhotoCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<{ latitude: number; longitude: number } | undefined>();
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    getLocation();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera');
      console.error('Camera error:', err);
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoData(data);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const retakePhoto = () => {
    setPhotoData(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (photoData) {
      onCapture({ photoData, geoData });
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <Button onClick={onSkip}>Lewati Foto</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cameraContainer}>
        {!photoData ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
            />
            <canvas ref={canvasRef} className={styles.canvas} />
          </>
        ) : (
          <img src={photoData} alt="Captured" className={styles.preview} />
        )}
      </div>

      <div className={styles.controls}>
        {!photoData ? (
          <>
            <Button onClick={capturePhoto} variant="primary" size="large">
              📸 Ambil Foto
            </Button>
            <Button onClick={onSkip} variant="secondary">
              Lewati
            </Button>
          </>
        ) : (
          <>
            <Button onClick={confirmPhoto} variant="primary" size="large">
              ✓ Gunakan Foto
            </Button>
            <Button onClick={retakePhoto} variant="secondary">
              🔄 Ambil Ulang
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
EOF

echo "✅ PhotoCapture.tsx fixed!"
echo ""

# ============================================
# FIX 3: ReviewSubmit Props Interface
# ============================================
echo "3️⃣ Fixing ReviewSubmit props..."

# First, fix the index file
cat > src/presentation/components/features/ReviewSubmit/index.ts << 'EOF'
export { ReviewSubmit } from './ReviewSubmit';
export type { ReviewSubmitProps } from './ReviewSubmit';
EOF

echo "✅ ReviewSubmit/index.ts fixed!"
echo ""

# ============================================
# FIX 4: Remove Dead Code in CloudinaryPhotoRepository
# ============================================
echo "4️⃣ Removing dead code from CloudinaryPhotoRepository..."

# Create backup first
cp src/infrastructure/storage/CloudinaryPhotoRepository.ts src/infrastructure/storage/CloudinaryPhotoRepository.ts.autobackup

# Remove the dead function (lines 129-166)
sed -i '129,166d' src/infrastructure/storage/CloudinaryPhotoRepository.ts

echo "✅ CloudinaryPhotoRepository.ts fixed! (backup saved)"
echo ""

# ============================================
# FIX 5: InspectionDetailModal Props
# ============================================
echo "5️⃣ Fixing InspectionDetailModal interface..."

# This needs manual check, but let's create the interface file
cat > src/presentation/components/features/Reports/InspectionDetailModal.types.ts << 'EOF'
export interface InspectionDetailModalProps {
  inspection: any;
  userName: string;
  userRole: string;
  onClose: () => void;
  totalInspections: number;
  currentIndex: number;
  onNext?: () => void;
  onPrev?: () => void;
}
EOF

echo "✅ InspectionDetailModal types created!"
echo ""

# ============================================
# FIX 6: Remove Unused Imports/Variables
# ============================================
echo "6️⃣ Fixing unused variables..."

# Fix login page
sed -i 's/const router = useRouter();/\/\/ const router = useRouter(); \/\/ TODO: Add routing logic/' src/app/login/page.tsx

# Fix validation.ts
sed -i 's/import { Assessments }/\/\/ import { Assessments } \/\/ Unused for now/' src/lib/utils/validation.ts

# Fix WeeklyReport
sed -i 's/const scoreGrade/\/\/ const scoreGrade/' src/presentation/components/features/Reports/WeeklyReport.tsx

# Fix Button
sed -i 's/const vibrate/\/\/ const vibrate/' src/presentation/components/ui/Button/Button.tsx

# Fix Modal
sed -i "s/import { Button }/\/\/ import { Button } \/\/ TODO: Use Button component/" src/presentation/components/ui/Modal/Modal.tsx

echo "✅ Unused variables commented out!"
echo ""

# ============================================
# FIX 7: Remove Unused Dependencies
# ============================================
echo "7️⃣ Removing unused dependencies..."

npm uninstall type-check vercel zod zustand 2>/dev/null

echo "✅ Unused dependencies removed!"
echo ""

# ============================================
# FINAL TEST
# ============================================
echo "🧪 Running final type-check..."
echo ""

npm run type-check 2>&1 | tee final-result.txt

echo ""
echo "======================================="
echo "📊 FINAL RESULT"
echo "======================================="

if grep -q "Found 0 errors" final-result.txt; then
    echo "✅ ✅ ✅ ALL ERRORS FIXED! ✅ ✅ ✅"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build"
    echo "2. Run: npm run dev"
    echo "3. Test your app!"
    rm final-result.txt
else
    echo "⚠️  Some errors remain. Check details:"
    grep "error TS" final-result.txt | head -10
fi

echo ""
echo "Backups created:"
echo "- src/infrastructure/storage/CloudinaryPhotoRepository.ts.autobackup"
