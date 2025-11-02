// src/app/layout.tsx
// FINAL CORRECT VERSION with Clean Arch

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/presentation/contexts/AuthContext'; // ← CORRECT!
import { TRPCProvider } from '@/lib/trpc';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SkipNavigation, FocusVisible } from '@/components/accessibility';

export const metadata: Metadata = {
  title: 'Smart Toilet Monitoring',
  description: 'Sistem monitoring kebersihan toilet',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Toilet Monitor',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
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
        <SkipNavigation />
        <FocusVisible />
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
