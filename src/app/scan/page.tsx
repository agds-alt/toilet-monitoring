// Next.js Page: Scan QR
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ScanPage from '../../presentation/pages/ScanPage';

export default function Scan() {
  const router = useRouter();

  const handleLocationFound = (locationId: string) => {
    // Navigate to inspection page with location ID
    router.push(`/inspection/${locationId}`);
  };

  return <ScanPage onLocationFound={handleLocationFound} />;
}
