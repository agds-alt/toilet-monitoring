// app/dashboard/inspect/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Location } from '@/core/entities/Location';

export default function InspectSelectionPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInspection = () => {
    if (!selectedLocation) {
      alert('Pilih lokasi terlebih dahulu');
      return;
    }
    router.push(`/dashboard/inspect/${selectedLocation}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Memuat lokasi...</div>
      </div>
    );
  }

  // Di app/dashboard/inspect/[locationId]/page.tsx - update handleAssessmentComplete
const handleAssessmentComplete = (assessmentData: any) => {
  console.log('✅ Assessment completed and saved:', assessmentData);
  
  // Show success message
  alert(`Inspeksi berhasil disimpan!\n\nSkor: ${assessmentData.totalScore}/${assessmentData.maxScore} (${assessmentData.percentage}%)`);
  
  setShowAssessment(false);
  
  
  router.push('/dashboard/history');
};


  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-black mb-2">Pilih Lokasi Inspeksi</h1>
        <p className="text-gray-600 mb-6">Pilih lokasi yang akan diinspeksi</p>

        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                selectedLocation === location.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
              onClick={() => setSelectedLocation(location.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className={`text-sm ${
                    selectedLocation === location.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {location.code} • Lantai {location.floor} • {location.section}
                  </p>
                </div>
                {selectedLocation === location.id && (
                  <div className="text-lg">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada lokasi tersedia</p>
            <button
              onClick={() => router.push('/dashboard/locations')}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Kelola Lokasi
            </button>
          </div>
        )}

        {locations.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleStartInspection}
              disabled={!selectedLocation}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              Mulai Inspeksi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}