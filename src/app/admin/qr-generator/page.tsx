// Next.js Page: QR Code Generator
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, Share2, Plus } from 'lucide-react';
import { Button } from '../../../presentation/components/ui/Button';
import { BottomNav } from '../../../presentation/components/layout/BottomNav';
import { QRCodeSVG } from 'qrcode.react';
import styles from './QRGeneratorPage.module.css';

interface Location {
  id: string;
  name: string;
  code: string;
  building?: string;
  floor?: string;
}

export default function QRGeneratorPage() {
  const router = useRouter();
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock locations data - Real toilet locations
  const mockLocations: Location[] = [
    { id: '1', name: 'Toilet Pria Lantai 1', code: 'TOILET-001', building: 'Gedung A', floor: '1' },
    { id: '2', name: 'Toilet Wanita Lantai 1', code: 'TOILET-002', building: 'Gedung A', floor: '1' },
    { id: '3', name: 'Toilet Pria Lantai 2', code: 'TOILET-003', building: 'Gedung A', floor: '2' },
    { id: '4', name: 'Toilet Wanita Lantai 2', code: 'TOILET-004', building: 'Gedung A', floor: '2' },
    { id: '5', name: 'Toilet Pria Lantai 3', code: 'TOILET-005', building: 'Gedung A', floor: '3' },
    { id: '6', name: 'Toilet Wanita Lantai 3', code: 'TOILET-006', building: 'Gedung A', floor: '3' },
    { id: '7', name: 'Toilet Pria Lantai 1', code: 'TOILET-007', building: 'Gedung B', floor: '1' },
    { id: '8', name: 'Toilet Wanita Lantai 1', code: 'TOILET-008', building: 'Gedung B', floor: '1' },
    { id: '9', name: 'Toilet Pria Lantai 2', code: 'TOILET-009', building: 'Gedung B', floor: '2' },
    { id: '10', name: 'Toilet Wanita Lantai 2', code: 'TOILET-010', building: 'Gedung B', floor: '2' }
  ];

  const toggleLocation = (location: Location) => {
    setSelectedLocations(prev => {
      const isSelected = prev.some(loc => loc.id === location.id);
      if (isSelected) {
        return prev.filter(loc => loc.id !== location.id);
      } else {
        return [...prev, location];
      }
    });
  };

  const selectAll = () => {
    setSelectedLocations(mockLocations);
  };

  const clearAll = () => {
    setSelectedLocations([]);
  };

  const generateQRCode = (location: Location) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/scan/${location.code}`;
  };

  const downloadQR = (location: Location) => {
    const svg = document.getElementById(`qr-${location.id}`);
    if (!svg) return;

    // Convert SVG to Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    canvas.width = 300;
    canvas.height = 400;

    img.onload = () => {
      if (!ctx) return;

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 50, 40, 200, 200);

      // Add text below QR
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(location.name, canvas.width / 2, 280);

      ctx.font = '14px Arial';
      ctx.fillText(`Kode: ${location.code}`, canvas.width / 2, 300);

      if (location.building) {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(location.building, canvas.width / 2, 320);
      }

      // Download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR_${location.code}.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printAll = () => {
    window.print();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>QR Code Generator</h1>
        <div className={styles.headerActions}>
          <Button onClick={printAll} variant="outline" size="sm">
            <Printer size={16} />
            Print All
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Location Selection */}
        <section className={styles.selectionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Pilih Lokasi</h2>
            <div className={styles.selectionActions}>
              <Button onClick={selectAll} variant="outline" size="sm">
                Pilih Semua
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                Hapus Semua
              </Button>
            </div>
          </div>

          <div className={styles.locationList}>
            {mockLocations.map((location) => {
              const isSelected = selectedLocations.some(loc => loc.id === location.id);
              
              return (
                <div
                  key={location.id}
                  onClick={() => toggleLocation(location)}
                  className={`${styles.locationItem} ${isSelected ? styles.selected : ''}`}
                >
                  <div className={styles.locationInfo}>
                    <h3 className={styles.locationName}>{location.name}</h3>
                    <p className={styles.locationCode}>{location.code}</p>
                    {location.building && (
                      <p className={styles.locationBuilding}>
                        {location.building} - Lantai {location.floor}
                      </p>
                    )}
                  </div>
                  <div className={styles.selectionIndicator}>
                    {isSelected ? '✓' : '○'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* QR Code Generation */}
        {selectedLocations.length > 0 && (
          <section className={styles.generationSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                QR Code ({selectedLocations.length} lokasi)
              </h2>
            </div>

            <div className={styles.qrGrid}>
              {selectedLocations.map((location) => (
                <div key={location.id} className={styles.qrCard}>
                  <div className={styles.qrCode}>
                    <QRCodeSVG
                      id={`qr-${location.id}`}
                      value={generateQRCode(location)}
                      size={200}
                      level="H"
                      includeMargin={true}
                      bgColor="#FFFFFF"
                      fgColor="#1F2937"
                    />
                  </div>
                  
                  <div className={styles.qrInfo}>
                    <h3 className={styles.qrTitle}>{location.name}</h3>
                    <p className={styles.qrCode}>{location.code}</p>
                    {location.building && (
                      <p className={styles.qrBuilding}>
                        {location.building} - Lantai {location.floor}
                      </p>
                    )}
                  </div>

                  <div className={styles.qrActions}>
                    <Button
                      onClick={() => downloadQR(location)}
                      variant="outline"
                      size="sm"
                      fullWidth
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {selectedLocations.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Plus size={48} />
            </div>
            <h3 className={styles.emptyTitle}>Pilih Lokasi</h3>
            <p className={styles.emptyDescription}>
              Pilih lokasi toilet untuk generate QR code
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
