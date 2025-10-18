// src/presentation/components/features/LocationSelector/LocationSelector.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import { Location } from '@/core/types/interfaces';
import { LOCATIONS, searchLocations } from '@/lib/constants/locations';
import styles from './LocationSelector.module.css';

interface LocationSelectorProps {
  onSelect: (location: Location) => void;
  onBack?: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelect,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(LOCATIONS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredLocations(searchLocations(query));
    } else {
      setFilteredLocations(LOCATIONS);
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h2 className={styles.title}>📍 Pilih Lokasi Toilet</h2>
        
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.locationList}>
          {filteredLocations.map((location) => (
            <Card
              key={location.id}
              variant="default"
              padding="md"
              onClick={() => onSelect(location)}
              className={styles.locationCard}
            >
              <div className={styles.locationInfo}>
                <h4 className={styles.locationName}>{location.name}</h4>
                {location.floor !== undefined && (
                  <span className={styles.locationMeta}>
                    Lantai {location.floor}
                  </span>
                )}
              </div>
              <div className={styles.locationArrow}>→</div>
            </Card>
          ))}

          {filteredLocations.length === 0 && (
            <div className={styles.noResults}>
              <p>Lokasi tidak ditemukan</p>
            </div>
          )}
        </div>

        {onBack && (
          <Button
            variant="secondary"
            fullWidth
            onClick={onBack}
          >
            Kembali ke Scanner
          </Button>
        )}
      </Card>
    </div>
  );
};