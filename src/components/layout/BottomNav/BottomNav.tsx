// presentation/components/layout/BottomNav/BottomNav.tsx - DEBUG VERSION
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '📊' },
  { href: '/dashboard/scan', label: 'Scan', icon: '📷' },
  { href: '/dashboard/inspection', label: 'Inspection', icon: '🔍' },
  { href: '/dashboard/history', label: 'History', icon: '📋' },
  { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
  { href: '/dashboard/locations', label: 'Lokasi', icon: '📍' },
];

export function BottomNav() {
  const pathname = usePathname();

  console.log('🔍 BottomNav pathname:', pathname);

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.5rem 0',
        background: 'white',
      }}
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.5rem',
              textDecoration: 'none',
              color: isActive ? 'black' : '#666',
              background: isActive ? '#f3f4f6' : 'transparent',
              borderRadius: '8px',
              minWidth: '60px',
            }}
          >
            <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
