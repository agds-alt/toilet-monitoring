// src/app/login/layout.tsx
// FIXED - Simplified redirect logic

'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user exists and loading is complete
    if (!loading && user) {
      console.log('✅ Already logged in - Redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading spinner
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render login page if user exists
  if (user) {
    return null;
  }

  // Render login page
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {children}
    </div>
  );
}