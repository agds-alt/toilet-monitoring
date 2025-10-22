'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, QrCode } from 'lucide-react';

export default function InspectionSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get('location');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Inspeksi Berhasil!
        </h1>
        
        <p className="text-gray-600 mb-2">
          Inspeksi untuk lokasi
        </p>
        
        <p className="text-lg font-semibold text-gray-800 mb-6">
          {location || 'Toilet'}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Data inspeksi telah tersimpan dan dapat dilihat di dashboard admin.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Home size={18} />
            Dashboard
          </button>
          
          <button
            onClick={() => router.push('/scan')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <QrCode size={18} />
            Scan Lagi
          </button>
        </div>
      </div>
    </div>
  );
}