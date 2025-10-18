// presentation/components/features/LocationForm/LocationForm.tsx
'use client';

import { useState } from 'react';
import { LocationFormData } from '@/core/entities/Location';

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => Promise<void>;
  initialData?: Partial<LocationFormData>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const SECTIONS = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'security', label: 'Security' }
];

const FLOORS = [
  { value: 0, label: 'Lobby' },
  { value: 1, label: 'Lantai 1' },
  { value: 2, label: 'Lantai 2' },
  { value: 3, label: 'Lantai 3' }
];

export default function LocationForm({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  onCancel 
}: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    floor: initialData?.floor || 0,
    section: initialData?.section || 'front'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      if (!isEditing) {
        // Reset form if not editing
        setFormData({
          name: '',
          code: '',
          floor: 0,
          section: 'front'
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'floor' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lokasi *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contoh: Lt. 1 - Toilet Depan Pria & Wanita"
        />
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Kode Lokasi *
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contoh: LT1-DEPAN"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
            Lantai
          </label>
          <select
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {FLOORS.map(floor => (
              <option key={floor.value} value={floor.value}>
                {floor.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
            Bagian
          </label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SECTIONS.map(section => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : isEditing ? 'Update Lokasi' : 'Tambah Lokasi'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}