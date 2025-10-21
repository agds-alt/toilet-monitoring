// src/presentation/components/features/LocationSelector/LocationSelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import { Location } from '../../../../core/types/interfaces';
import { LOCATIONS, searchLocations } from '../../../../lib/constants/locations';
import styles from './LocationSelector.module.css';

interface LocationSelectorProps {
  onSelect: (location: Location) => void;
  onBack?: () => void;
  selectedLocationId?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelect,
  onBack,
  selectedLocationId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(LOCATIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter locations when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredLocations(searchLocations(searchQuery));
    } else {
      setFilteredLocations(LOCATIONS);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = async (location: Location) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onSelect(location);
    } catch (error) {
      console.error('Error selecting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, location: Location) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLocationSelect(location);
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h2 className={styles.title}>📍 Pilih Lokasi Toilet</h2>

        {/* Search Input */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Cari lokasi (nama atau lantai)..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Cari lokasi toilet"
            disabled={isLoading}
          />
          {searchQuery && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
            >
              ×
            </button>
          )}
        </div>

        {/* Location List */}
        <div className={styles.locationList} role="listbox" aria-label="Daftar lokasi toilet">
          {filteredLocations.map((location) => (
            <Card
              key={location.id}
              variant={selectedLocationId === location.id ? 'selected' : 'default'}
              padding="md"
              onClick={() => handleLocationSelect(location)}
              onKeyDown={(e) => handleKeyPress(e, location)}
              className={styles.locationCard}
              role="option"
              aria-selected={selectedLocationId === location.id}
              tabIndex={0}
            >
              <div className={styles.locationInfo}>
                <h4 className={styles.locationName}>{location.name}</h4>
                <div className={styles.locationMeta}>
                  {location.floor !== undefined && (
                    <span className={styles.floor}>Lantai {location.floor}</span>
                  )}
                  {location.description && (
                    <span className={styles.description}>{location.description}</span>
                  )}
                </div>
              </div>
              <div className={styles.locationActions}>
                {isLoading && selectedLocationId === location.id ? (
                  <div className={styles.loadingSpinner} aria-label="Memuat...">
                    ⏳
                  </div>
                ) : (
                  <div className={styles.locationArrow} aria-hidden="true">
                    →
                  </div>
                )}
              </div>
            </Card>
          ))}

          {/* No Results State */}
          {filteredLocations.length === 0 && (
            <div className={styles.noResults}>
              <p>🚫 Lokasi tidak ditemukan</p>
              <p className={styles.noResultsHint}>
                Coba kata kunci lain seperti "lobby", "lantai 1", atau "security"
              </p>
              <Button
                variant="secondary"
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
              >
                Tampilkan Semua Lokasi
              </Button>
            </div>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <div className={styles.footer}>
            <Button variant="secondary" fullWidth onClick={onBack} disabled={isLoading}>
              ↩ Kembali ke Scanner
            </Button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingMessage}>Memproses...</div>
          </div>
        )}
      </Card>
    </div>
  );
};
