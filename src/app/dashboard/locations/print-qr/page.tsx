// ===================================
// 📁 src/app/dashboard/locations/print-qr/page.tsx
// Bulk QR Print - Print multiple QR codes
// ===================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Printer, Download, Check } from 'lucide-react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
import QRCodeDisplay from '@/presentation/components/features/locations/QRCodeDisplay';
import styles from './print-qr.module.css';

export default function BulkQRPrintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    building: 'all',
    floor: 'all',
  });

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getLocationsUseCase.execute();
        setLocations(data);
        
        // Pre-select from URL params
        const ids = searchParams.get('ids');
        if (ids) {
          setSelectedIds(new Set(ids.split(',')));
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [searchParams]);

  const filteredLocations = locations.filter(loc => {
    const matchBuilding = filter.building === 'all' || loc.building === filter.building;
    const matchFloor = filter.floor === 'all' || loc.floor === filter.floor;
    return matchBuilding && matchFloor;
  });

  const toggleLocation = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredLocations.map(l => l.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const selectedLocations = locations.filter(loc => selectedIds.has(loc.id));

  const buildings = Array.from(new Set(locations.map(l => l.building).filter(Boolean)));
  const floors = Array.from(new Set(locations.map(l => l.floor).filter(Boolean))).sort();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header - Hide on print */}
      <header className={styles.header} data-print-hide>
        <div className={styles.headerTop}>
          <button onClick={() => router.back()} className={styles.btnBack}>
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1 className={styles.title}>Bulk QR Print</h1>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.filters}>
            <select 
              value={filter.building}
              onChange={(e) => setFilter({ ...filter, building: e.target.value })}
              className={styles.select}
            >
              <option value="all">Semua Gedung</option>
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select 
              value={filter.floor}
              onChange={(e) => setFilter({ ...filter, floor: e.target.value })}
              className={styles.select}
            >
              <option value="all">Semua Lantai</option>
              {floors.map(f => (
                <option key={f} value={f}>Lantai {f}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectionActions}>
            <button onClick={selectAll} className={styles.btnSecondary}>
              <Check size={16} />
              Pilih Semua ({filteredLocations.length})
            </button>
            <button onClick={deselectAll} className={styles.btnSecondary}>
              Deselect All
            </button>
          </div>

          <div className={styles.printActions}>
            <div className={styles.selectedCount}>
              {selectedIds.size} lokasi dipilih
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={selectedIds.size === 0}
              className={styles.btnPrint}
            >
              <Printer size={18} />
              Print QR Codes
            </button>
          </div>
        </div>
      </header>

      {/* Selection Grid - Hide on print */}
      <div className={styles.selectionGrid} data-print-hide>
        {filteredLocations.map(location => (
          <div 
            key={location.id}
            className={`${styles.selectionCard} ${selectedIds.has(location.id) ? styles.selected : ''}`}
            onClick={() => toggleLocation(location.id)}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(location.id)}
              onChange={() => {}}
              className={styles.checkbox}
            />
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>{location.name}</div>
              <div className={styles.cardMeta}>
                <span className={styles.code}>{location.code}</span>
                {location.building && <span>• {location.building}</span>}
                {location.floor && <span>• Lt. {location.floor}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print Preview - Show only on print */}
      <div className={styles.printArea}>
        {selectedLocations.length === 0 ? (
          <div className={styles.emptyState} data-print-hide>
            <p>Pilih lokasi untuk print QR code</p>
          </div>
        ) : (
          <div className={styles.qrGrid}>
            {selectedLocations.map(location => (
              <div key={location.id} className={styles.qrPrintCard}>
                <QRCodeDisplay
                  locationId={location.id}
                  locationCode={location.code || location.id}
                  locationName={location.name}
                  building={location.building || undefined}
                  floor={location.floor || undefined}
                  size={200}
                  showActions={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions - Hide on print */}
      {selectedIds.size > 0 && (
        <div className={styles.instructions} data-print-hide>
          <h3>💡 Tips Print QR Code:</h3>
          <ul>
            <li>Gunakan kertas A4 standar atau stiker label</li>
            <li>Setting print: Portrait, Fit to page</li>
            <li>Rekomendasi: 4-6 QR per halaman untuk ukuran optimal</li>
            <li>Test scan QR sebelum ditempel di lokasi</li>
            <li>Laminating untuk ketahanan lebih lama</li>
          </ul>
        </div>
      )}
    </div>
  );
}
