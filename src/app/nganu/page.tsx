// ============================================
// 6. DASHBOARD HOME - src/app/dashboard/page.tsx
// ============================================

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Card } from '@/presentation/components/ui/Card/Card';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Card variant="elevated" padding="lg" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          👋 Halo, {user.fullName}!
        </h1>
        <p style={{ color: 'var(--color-gray-600)' }}>{user.role}</p>
      </Card>
      
<div style={{ display: 'grid', gap: '1rem' }}>  


        <Card
          variant="elevated"
          padding="lg"
          onClick={() => router.push('/dashboard/scan')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧹</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Mulai Inspeksi</h3>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
            Scan QR code atau pilih lokasi toilet
          </p>
        </Card>

        <Card
          variant="elevated"
          padding="lg"
          onClick={() => router.push('/dashboard/history')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Riwayat Inspeksi</h3>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
            Lihat laporan yang sudah dibuat
          </p>
        </Card>

        {user.canViewReports() && (
          <Card
            variant="elevated"
            padding="lg"
            onClick={() => router.push('/dashboard/reports')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Laporan</h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
              Lihat statistik dan analisis
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
