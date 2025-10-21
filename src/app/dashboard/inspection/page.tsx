// src/app/inspection/page.tsx
'use client';

import { InspectionForm } from '@/features/Inspection/InspectionForm';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function InspectionPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSuccess = (inspectionId: string) => {
    router.push(`/inspection/success?id=${inspectionId}`);
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <InspectionForm userId={user.id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
