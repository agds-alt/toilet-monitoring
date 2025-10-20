// TEMPORARY: Simple test component to verify real-time functionality
// src/app/dashboard/locations/test-page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getLocationsUseCase, subscribeToLocationsUseCase } from '@/lib/di';

export default function TestLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLocationsUseCase.execute();
        setLocations(data);
        setMessage(`Loaded ${data.length} locations`);
      } catch (error) {
        setMessage(`Error: ${error}`);
      }
    };

    loadData();

    // Test real-time subscription
    const unsubscribe = subscribeToLocationsUseCase.execute((payload) => {
      console.log('🔔 REAL-TIME TEST:', payload);
      setMessage(`Real-time event: ${payload.eventType}`);
      loadData(); // Refresh data
    });

    return () => {
      subscribeToLocationsUseCase.unsubscribe();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Real-time Locations Test</h1>
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <strong>Status:</strong> {message}
      </div>
      
      <div className="grid gap-2">
        {locations.map((location) => (
          <div key={location.id} className="p-3 border rounded">
            <strong>{location.name}</strong> ({location.code}) - Floor {location.floor}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open this page in two browser tabs</li>
          <li>Go to your main locations page in another tab</li>
          <li>Create/edit/delete locations there</li>
          <li>Watch for real-time updates here automatically</li>
        </ol>
      </div>
    </div>
  );
}