'use client';

import { useEffect } from 'react';

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Reports page error:', error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>⚠️ Gagal memuat laporan</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Coba Lagi</button>
    </div>
  );
}