// app/dashboard/locations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/core/entities/Location';
import { LocationForm } from '@/presentation/components/features/LocationForm/LocationForm';
import { LocationFormData } from '@/core/entities/Location';
import styles from './page.module.css';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    console.log('🔄 Loading locations...');
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/locations');
      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Locations loaded:', data.length, 'items');
      
      setLocations(data);
    } catch (error) {
      console.error('❌ Load locations failed:', error);
      setError('Gagal memuat data lokasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLocation = async (data: LocationFormData) => {
    try {
      setError('');
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat lokasi');
      }

      await loadLocations();
      setShowForm(false);
      setEditingLocation(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (location: Location) => {
    console.log('✏️ Editing location:', location);
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ Deleting location:', id);
    
    if (!confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) return;

    try {
      setError('');
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus lokasi');
      }
      
      await loadLocations();
      console.log('✅ Location deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting location:', error);
      setError('Gagal menghapus lokasi. Silakan coba lagi.');
    }
  };

  // Test API connection
  const testApi = async () => {
    console.log('🧪 Testing API connection...');
    try {
      const response = await fetch('/api/locations');
      console.log('🧪 Test Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Test Data - First item:', data[0]);
      } else {
        console.error('🧪 Test Failed:', await response.text());
      }
    } catch (error) {
      console.error('🧪 Test Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Memuat data lokasi...</div>
          <button 
            onClick={testApi}
            className={styles.testButton}
          >
            Test API Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manajemen Lokasi</h1>
        <div className={styles.headerActions}>
          <button onClick={testApi} className={styles.testButton}>
            Test API
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={styles.addButton}
          >
            + Tambah Lokasi
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          ⚠️ {error}
          <button onClick={loadLocations} className={styles.retryButton}>
            Coba Lagi
          </button>
        </div>
      )}

      {showForm && (
        <div className={`${styles.formContainer} ${styles.fadeIn}`}>
          <h2 className={styles.formTitle}>
            {editingLocation ? '✏️ Edit Lokasi' : '📍 Tambah Lokasi Baru'}
          </h2>
          <LocationForm
            onSubmit={handleCreateLocation}
            initialData={editingLocation || undefined}
            isEditing={!!editingLocation}
            onCancel={() => {
              setShowForm(false);
              setEditingLocation(null);
            }}
          />
        </div>
      )}

      {locations.length > 0 ? (
        <div className={styles.locationsList}>
          <div className={styles.listHeader}>
            <span>Daftar Lokasi ({locations.length})</span>
          </div>
          <ul>
            {locations.map((location) => (
              <li key={location.id} className={`${styles.listItem} ${styles.slideIn}`}>
                <div className={styles.locationInfo}>
                  <div className={styles.locationName}>
                    <p className={styles.name}>{location.name}</p>
                    <span className={styles.codeBadge}>{location.code}</span>
                  </div>
                  <div className={styles.locationDetails}>
                    <span>🏢 {location.floor === 0 ? 'Lobby' : `Lantai ${location.floor}`}</span>
                    <span className={styles.detailSeparator}>•</span>
                    <span>📦 {location.section}</span>
                    <span className={styles.detailSeparator}>•</span>
                    <span>📅 {new Date(location.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleEdit(location)}
                    className={styles.editButton}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className={styles.deleteButton}
                    disabled={isLoading}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📍</div>
          <p className={styles.emptyText}>Belum ada lokasi yang ditambahkan</p>
          <button
            onClick={() => setShowForm(true)}
            className={styles.addButton}
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            + Tambah Lokasi Pertama
          </button>
        </div>
      )}
    </div>
  );
}