// ===================================
// 📁 src/app/dashboard/locations/bulk/page.tsx
// ===================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import { bulkCreateLocationsUseCase } from '@/lib/di';
import styles from './bulk.module.css';


const BUILDINGS = [
  { id: '1', name: 'Tower A - Apartment' },
  { id: '2', name: 'Main Building - Office' },
  { id: '3', name: 'West Wing - Hospital' },
  { id: '4', name: 'Shopping Plaza - Mall' },
];

export default function BulkGeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [config, setConfig] = useState({
    startFloor: 1,
    endFloor: 5,
    genders: ['male', 'female'] as string[],
    sections: ['front', 'back'] as string[],
  });
  const [preview, setPreview] = useState<Array<{name: string, code: string, floor: string, gender: string, section: string}>>([]);
  const [showPreview, setShowPreview] = useState(false);

  const generatePreview = () => {
    const locations = [];
    
    for (let floor = config.startFloor; floor <= config.endFloor; floor++) {
      config.genders.forEach(gender => {
        config.sections.forEach(section => {
          const genderPrefix = gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'D';
          const code = `${selectedBuilding.substring(0, 3).toUpperCase()}-${genderPrefix}${floor}-${section.toUpperCase()}`;
          const genderText = gender === 'male' ? 'Pria' : gender === 'female' ? 'Wanita' : 'Disabled';
          
          locations.push({
            name: `Lt. ${floor} - Toilet ${section.charAt(0).toUpperCase() + section.slice(1)} ${genderText}`,
            code,
            floor: floor.toString(),
            gender,
            section,
          });
        });
      });
    }
    
    setPreview(locations);
    setShowPreview(true);
  };

  const handleBulkGenerate = async () => {
    if (!selectedBuilding) {
      alert('Pilih gedung terlebih dahulu!');
      return;
    }

    if (config.genders.length === 0 || config.sections.length === 0) {
      alert('Pilih minimal 1 gender dan 1 section!');
      return;
    }

    try {
      setLoading(true);
      
      const result = await bulkCreateLocationsUseCase.execute({
        building: selectedBuilding,
        startFloor: config.startFloor,
        endFloor: config.endFloor,
        genders: config.genders,
        sections: config.sections,
      });

      if (result.length === 0) {
        alert('⚠️ Semua lokasi sudah ada! Tidak ada lokasi baru yang dibuat.');
      } else {
        alert(`✅ Berhasil generate ${result.length} lokasi baru!`);
      }
      
      router.push('/dashboard/locations');
    } catch (error: any) {
      console.error('Failed to bulk generate:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleGender = (gender: string) => {
    setConfig(prev => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender]
    }));
  };

  const toggleSection = (section: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section]
    }));
  };

  const totalCount = (config.endFloor - config.startFloor + 1) * config.genders.length * config.sections.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>
          <Zap size={24} />
          Bulk Location Generation
        </h1>
      </header>

      <main className={styles.main}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gedung *</label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className={styles.input}
            >
              <option value="">Pilih Gedung</option>
              {BUILDINGS.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lantai Awal</label>
              <input
                type="number"
                value={config.startFloor}
                onChange={(e) => setConfig({ ...config, startFloor: parseInt(e.target.value) || 1 })}
                min="0"
                max="100"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lantai Akhir</label>
              <input
                type="number"
                value={config.endFloor}
                onChange={(e) => setConfig({ ...config, endFloor: parseInt(e.target.value) || 5 })}
                min="0"
                max="100"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Gender Types</label>
            <div className={styles.checkboxGroup}>
              {['male', 'female', 'disabled'].map(gender => (
                <label key={gender} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={config.genders.includes(gender)}
                    onChange={() => toggleGender(gender)}
                  />
                  <span>{gender === 'male' ? '👨 Pria' : gender === 'female' ? '👩 Wanita' : '♿ Disabled'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Sections</label>
            <div className={styles.checkboxGroup}>
              {['front', 'back', 'left', 'right'].map(section => (
                <label key={section} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={config.sections.includes(section)}
                    onChange={() => toggleSection(section)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{section}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.totalCount}>
            <div className={styles.countLabel}>Total lokasi yang akan dibuat:</div>
            <div className={styles.countNumber}>{totalCount}</div>
            <div className={styles.countDetail}>
              {config.endFloor - config.startFloor + 1} lantai × {config.genders.length} gender × {config.sections.length} section
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={generatePreview}
              disabled={!selectedBuilding}
              className={styles.btnPreview}
            >
              👁️ Preview
            </button>
            <button
              type="button"
              onClick={handleBulkGenerate}
              disabled={loading || !selectedBuilding || preview.length === 0}
              className={styles.btnGenerate}
            >
              <Zap size={18} />
              {loading ? 'Generating...' : 'Generate Sekarang'}
            </button>
          </div>
        </div>

        {showPreview && preview.length > 0 && (
          <div className={styles.previewSection}>
            <h2 className={styles.previewTitle}>Preview ({preview.length} lokasi)</h2>
            <div className={styles.previewTable}>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Kode</th>
                    <th>Lantai</th>
                    <th>Gender</th>
                    <th>Section</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 20).map((loc, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{loc.name}</td>
                      <td><code>{loc.code}</code></td>
                      <td>{loc.floor}</td>
                      <td>{loc.gender}</td>
                      <td>{loc.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 20 && (
                <div className={styles.previewMore}>
                  ... dan {preview.length - 20} lokasi lainnya
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}