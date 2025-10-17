// src/app/layout.tsx - UPDATE WITH PROVIDER
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/presentation/components/layout/AuthProvider';

export const metadata: Metadata = {
  title: 'Smart Toilet Monitoring - Proservice Indonesia',
  description: 'Real-time toilet cleanliness monitoring and reporting system',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
