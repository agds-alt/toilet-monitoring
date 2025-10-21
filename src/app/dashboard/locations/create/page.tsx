// ===================================
// 📁 src/app/dashboard/locations/create/page.tsx
// ===================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, QrCode, Plus, X } from 'lucide-react';
import { createLocationUseCase } from '@/lib/di';
import { LocationFormData } from '@/core/entities/Location';
import styles from './create.module.css';

const BUILDINGS = [
  { id: '1', name: 'Tower A - Apartment' },
  { id: '2', name: 'Main Building - Office' },
  { id: '3', name: 'West Wing - Hospital' },
  { id: '4', name: 'Shopping Plaza - Mall' },
];

export default function CreateLocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    code: '',
    floor: '',
    section: '',
    building: '',
    area: '',
    qr_code: '',
    description: '',
    is_active: true,
    coordinates: null,
    photo_url: undefined,
  });
  const [metadataFields, setMetadataFields] = useState<Array<{ key: string; value: string }>>([]);
  const [qrPreview, setQrPreview] = useState('');

  // Auto-generate code
  useEffect(() => {
    if (formData.floor && formData.section) {
      const suggested = `${formData.building?.substring(0, 3).toUpperCase() || 'LOC'}-${formData.floor}-${formData.section.toUpperCase()}`;
      if (!formData.code) {
        setFormData((prev) => ({ ...prev, code: suggested }));
      }
    }
  }, [formData.floor, formData.section, formData.building]);

  // Generate QR preview
  useEffect(() => {
    if (formData.code) {
      const qrData = `${window.location.origin}/scan/${formData.code}`;
      setFormData((prev) => ({ ...prev, qr_code: qrData }));
      setQrPreview(qrData);
    }
  }, [formData.code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Add metadata to description as JSON
      const metadata = metadataFields.reduce(
        (acc, field) => {
          if (field.key && field.value) {
            acc[field.key] = field.value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const locationData: LocationFormData = {
        ...formData,
        description:
          formData.description +
          (Object.keys(metadata).length > 0 ? `\nMetadata: ${JSON.stringify(metadata)}` : ''),
      };

      await createLocationUseCase.execute(locationData);

      alert('✅ Lokasi berhasil ditambahkan!');
      router.push('/dashboard/locations');
    } catch (error) {
      console.error('Failed to create location:', error);
      alert('❌ Gagal menambahkan lokasi');
    } finally {
      setLoading(false);
    }
  };

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };

  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...metadataFields];
    updated[index][field] = value;
    setMetadataFields(updated);
  };

  const removeMetadataField = (index: number) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>Tambah Lokasi Baru</h1>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informasi Dasar</h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Gedung *</label>
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  required
                  className={styles.input}
                >
                  <option value="">Pilih Gedung</option>
                  {BUILDINGS.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nama Lokasi *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Lt. 1 - Toilet Depan Pria"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Kode (Auto)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="AUTO-1-FRONT"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lantai *</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="1"
                  required
                  min="0"
                  max="100"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section</label>
                <select
                  value={formData.section || ''}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className={styles.input}
                >
                  <option value="">Pilih Section</option>
                  <option value="front">Front</option>
                  <option value="back">Back</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Area</label>
                <input
                  type="text"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Lobby, Corridor, dll"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Deskripsi</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi tambahan..."
                rows={3}
                className={styles.textarea}
              />
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Custom Metadata (Optional)</h2>
              <button type="button" onClick={addMetadataField} className={styles.btnAdd}>
                <Plus size={16} />
                Add Field
              </button>
            </div>

            {metadataFields.map((field, index) => (
              <div key={index} className={styles.metadataRow}>
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                  placeholder="Key (e.g., capacity)"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                  placeholder="Value (e.g., 10)"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeMetadataField(index)}
                  className={styles.btnRemove}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </section>

          {qrPreview && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <QrCode size={20} />
                QR Code Preview
              </h2>
              <div className={styles.qrPreview}>
                <code>{qrPreview}</code>
              </div>
            </section>
          )}

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              <Save size={18} />
              {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
            </button>
            <button type="button" onClick={() => router.back()} className={styles.btnCancel}>
              Batal
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
