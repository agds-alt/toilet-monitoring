// src/app/layout.tsx - UPDATE WITH PROVIDER
import type { Metadata, Viewport } from 'next'
import './globals.css';
import { AuthProvider } from '@/presentation/components/layout/AuthProvider';

// src/app/dashboard/layout.tsx (atau page.tsx)


export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Toilet Monitoring Dashboard',
  // HAPUS viewport dan themeColor dari sini
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const themeColor = {
  light: '#ffffff',
  dark: '#000000',
  themeColor: '#000000',
}

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
