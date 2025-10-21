// ===================================
// 📁 src/presentation/components/features/locations/LocationCard.tsx
// UPDATED - Added QR button
// ===================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Copy, Trash2, Check, QrCode } from 'lucide-react';
import { Location } from '@/core/entities/Location';
import { deleteLocationUseCase } from '@/lib/di';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: Location;
  onRefresh: () => void;
}

export default function LocationCard({ location, onRefresh }: LocationCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyQRUrl = async () => {
    const qrUrl = `${window.location.origin}/scan/${location.code || location.id}`;
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewQR = () => {
    router.push(`/dashboard/locations/${location.id}/qr`);
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus lokasi "${location.name}"?`)) return;

    try {
      setDeleting(true);
      await deleteLocationUseCase.execute(location.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Gagal menghapus lokasi');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.buildingInfo}>
          <Building size={14} />
          <span>{location.building || 'No building'}</span>
        </div>
        <div className={styles.actions}>
          <button onClick={viewQR} className={styles.btnAction} title="View QR Code">
            <QrCode size={16} />
          </button>
          <button onClick={copyQRUrl} className={styles.btnAction} title="Copy QR URL">
            {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={styles.btnAction}
            title="Delete"
          >
            <Trash2 size={16} color="#EF4444" />
          </button>
        </div>
      </div>

      <h3 className={styles.cardTitle}>{location.name}</h3>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Kode:</span>
          <code className={styles.code}>{location.code || '-'}</code>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Lantai:</span>
          <span>{location.floor}</span>
        </div>
        {location.section && (
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Section:</span>
            <span>{location.section}</span>
          </div>
        )}
        {location.area && (
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Area:</span>
            <span>{location.area}</span>
          </div>
        )}
      </div>

      {location.qr_code && (
        <div className={styles.qrInfo}>
          <QrCode size={14} />
          <span>QR Code Available</span>
        </div>
      )}
    </div>
  );
}
