// ===================================
// FIX 3: src/app/not-found.tsx
// ===================================

// Tambahkan di baris pertama jika belum ada
'use client';

import { Card } from '@/presentation/components/ui/Card/Card';
import Button from '@/presentation/components/ui/Button/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--color-gray-50)',
      }}
    >
      <Card variant="elevated" padding="lg" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button variant="primary" fullWidth>
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}
