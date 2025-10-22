// Layout Component: BottomNav (Mobile-first with QR scan in center)
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, QrCode, User, Settings } from 'lucide-react';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Home',
      isActive: pathname === '/dashboard'
    },
    {
      href: '/admin',
      icon: Calendar,
      label: 'Admin',
      isActive: pathname.startsWith('/admin')
    },
    {
      href: '/scan',
      icon: QrCode,
      label: 'Scan QR',
      isActive: pathname === '/scan',
      isCenter: true
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      isActive: pathname === '/profile'
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      isActive: pathname === '/settings'
    }
  ];

  return (
    <nav className={`${styles.bottomNav} ${className || ''}`}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCenter = item.isCenter;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isCenter ? styles.centerItem : ''} ${item.isActive ? styles.active : ''}`}
            >
              <div className={`${styles.iconContainer} ${isCenter ? styles.centerIcon : ''}`}>
                <Icon size={isCenter ? 28 : 20} />
              </div>
              <span className={`${styles.label} ${isCenter ? styles.centerLabel : ''}`}>
                {item.label}
              </span>
              {isCenter && <div className={styles.centerGlow} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;