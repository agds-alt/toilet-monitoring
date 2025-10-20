// ===================================
// 📁 src/app/dashboard/locations/page.tsx
// UPDATED - Added Bulk Print button
// ===================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Plus, Search, Printer } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
import LocationCard from '@/presentation/components/features/locations/LocationCard';
import LocationStats from '@/presentation/components/features/locations/LocationStats';
import styles from './locations.module.css';

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('all');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocationsUseCase.execute();
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loc.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = filterBuilding === 'all' || loc.building === filterBuilding;
    return matchesSearch && matchesBuilding;
  });

  const buildings = Array.from(new Set(locations.map(l => l.building).filter(Boolean)));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <MapPin size={28} />
            <div>
              <h1 className={styles.title}>Location Management</h1>
              <p className={styles.subtitle}>Kelola lokasi toilet monitoring</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              onClick={() => router.push('/dashboard/locations/print-qr')}
              className={styles.btnSecondary}
            >
              <Printer size={18} />
              Bulk Print QR
            </button>
            <button 
              onClick={() => router.push('/dashboard/locations/create')}
              className={styles.btnPrimary}
            >
              <Plus size={18} />
              Tambah Lokasi
            </button>
            <button 
              onClick={() => router.push('/dashboard/locations/bulk')}
              className={styles.btnSecondary}
            >
              ⚡ Bulk Generate
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <LocationStats locations={locations} />

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Cari lokasi atau kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select 
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Semua Gedung</option>
            {buildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredLocations.length === 0 ? (
          <div className={styles.empty}>
            <MapPin size={48} />
            <p>Belum ada lokasi</p>
            <button 
              onClick={() => router.push('/dashboard/locations/create')}
              className={styles.btnPrimary}
            >
              Tambah Lokasi Pertama
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredLocations.map(location => (
              <LocationCard 
                key={location.id} 
                location={location}
                onRefresh={loadLocations}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}