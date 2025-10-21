// ===================================
// UPDATED: Complete print-qr page.tsx
// ===================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Printer, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getLocationsUseCase } from '@/lib/di';
import { Location } from '@/core/entities/Location';
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

  // Inject print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        [data-print-hide] { display: none !important; }
        body { background: white !important; }
        .printArea { display: block !important; }
        .qrGrid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 40px !important;
          padding: 30px !important;
        }
        .qrPrintCard {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        svg {
          display: block !important;
          visibility: visible !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const filteredLocations = locations.filter((loc) => {
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
    setSelectedIds(new Set(filteredLocations.map((l) => l.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handlePrint = () => {
    // Force visibility before print
    const printArea = document.querySelector(`.${styles.printArea}`) as HTMLElement;
    if (printArea) {
      printArea.style.display = 'block';
      printArea.style.visibility = 'visible';
    }

    setTimeout(() => window.print(), 200);
  };

  const selectedLocations = locations.filter((loc) => selectedIds.has(loc.id));
  const buildings = Array.from(new Set(locations.map((l) => l.building).filter(Boolean)));
  const floors = Array.from(new Set(locations.map((l) => l.floor).filter(Boolean))).sort();

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
              {buildings.map((b) => (
                <option key={b} value={b || ""}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={filter.floor}
              onChange={(e) => setFilter({ ...filter, floor: e.target.value })}
              className={styles.select}
            >
              <option value="all">Semua Lantai</option>
              {floors.map((f) => (
                <option key={f} value={f || ""}>
                  Lantai {f}
                </option>
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
            <div className={styles.selectedCount}>{selectedIds.size} lokasi dipilih</div>
            <button
              onClick={handlePrint}
              disabled={selectedIds.size === 0}
              className={styles.btnPrint}
            >
              <Printer size={18} />
              Print QR Codes ({selectedIds.size})
            </button>
          </div>
        </div>
      </header>

      {/* Selection Grid - Hide on print */}
      <div className={styles.selectionGrid} data-print-hide>
        {filteredLocations.map((location) => (
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
            {selectedLocations.map((location) => (
              <div key={location.id} className={styles.qrPrintCard}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${location.code || location.id}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#1F2937"
                    style={{ margin: '0 auto', display: 'block' }}
                  />
                  <h3
                    style={{
                      marginTop: '20px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1F2937',
                    }}
                  >
                    {location.name}
                  </h3>
                  <div
                    style={{
                      marginTop: '12px',
                      background: '#F7F7F8',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#2563EB',
                      letterSpacing: '1px',
                    }}
                  >
                    {location.code || location.id.substring(0, 8)}
                  </div>
                  {location.building && (
                    <div
                      style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#6B7280',
                      }}
                    >
                      {location.building}
                    </div>
                  )}
                  {location.floor && (
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#6B7280',
                      }}
                    >
                      Lantai {location.floor}
                    </div>
                  )}
                </div>
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
            <li>Rekomendasi: 2 kolom per halaman</li>
            <li>Test scan QR sebelum ditempel di lokasi</li>
            <li>Laminating untuk ketahanan lebih lama</li>
          </ul>
        </div>
      )}
    </div>
  );
}
