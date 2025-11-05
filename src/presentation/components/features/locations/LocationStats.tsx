// ===================================
// 📁 src/presentation/components/features/locations/LocationStats.tsx
// ===================================
'use client';

import { Building, MapPin, Layers } from 'lucide-react';
import { Location } from '@/domain/entities/Location';
import styles from './LocationStats.module.css';

interface LocationStatsProps {
  locations: Location[];
}

export default function LocationStats({ locations }: LocationStatsProps) {
  const totalLocations = locations.length;
  const uniqueBuildings = new Set(locations.map((l) => l.building).filter(Boolean)).size;
  const uniqueFloors = new Set(locations.map((l) => l.floor).filter(Boolean)).size;

  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <MapPin size={24} />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>Total Lokasi</div>
          <div className={styles.statValue}>{totalLocations}</div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <Building size={24} />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>Gedung</div>
          <div className={styles.statValue}>{uniqueBuildings}</div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <Layers size={24} />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>Lantai</div>
          <div className={styles.statValue}>{uniqueFloors}</div>
        </div>
      </div>
    </div>
  );
}
