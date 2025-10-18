// ===================================
// FIX 2: src/app/error.tsx
// ===================================

// File ini sudah ada 'use client', tapi pastikan ada di line pertama

'use client';

import { useEffect } from 'react';
import Button from '@/presentation/components/ui/Button/Button';
import { Card } from '@/presentation/components/ui/Card/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      background: 'var(--color-gray-50)'
    }}>
      <Card variant="elevated" padding="lg" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Oops! Something went wrong
        </h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
