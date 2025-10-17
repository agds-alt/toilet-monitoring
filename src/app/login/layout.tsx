'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // CRITICAL: Only redirect once!
    if (!loading && user && !hasRedirected.current) {
      console.log('✅ Already logged in - Redirecting to dashboard');
      hasRedirected.current = true;
      router.replace('/dashboard'); // Use replace instead of push!
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

  // If user exists, don't render login page
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