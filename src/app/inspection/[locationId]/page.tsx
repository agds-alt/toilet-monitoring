// Next.js Page: Inspection Form
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import InspectionPage from '@/presentation/pages/InspectionPage';

export default function Inspection() {
  const params = useParams();
  const locationId = params.locationId as string;

  // Mock location data - in real app this would be fetched from API
  const locationData = {
    locationId,
    locationName: 'Toilet Lantai 1',
    locationCode: 'TOILET-001'
  };

  return <InspectionPage {...locationData} />;
}
