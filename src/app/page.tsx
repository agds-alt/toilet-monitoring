// ===================================
// FIX #1: src/app/page.tsx
// Remove dead code, keep only redirect logic
// ===================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🏠 HomePage: User:', user ? '✅' : '❌', 'Loading:', loading);
    
    if (!loading) {
      if (user) {
        console.log('➡️ Redirecting to /dashboard');
        router.push('/dashboard');
      } else {
        console.log('➡️ Redirecting to /login');
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        <p>Checking authentication...</p>
      </div>
    </div>
  );
}