// src/app/layout.tsx
// FINAL CORRECT VERSION with Clean Arch

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/presentation/contexts/AuthContext'; // ← CORRECT!

export const metadata: Metadata = {
  title: 'Smart Toilet Monitoring',
  description: 'Sistem monitoring kebersihan toilet',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect to improve loading speed */}
        <link rel="preconnect" href="https://api.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
