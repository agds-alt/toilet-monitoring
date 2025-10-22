// src/presentation/components/features/LocationForm/LocationForm.tsx
import { useState, useEffect } from 'react';
import { Location, LocationFormData } from '@/core/entities/Location';
import { createLocationUseCase, updateLocationUseCase } from '@/lib/di';
import { Input } from '@/presentation/components/ui/Input';
import Button from '@/presentation/components/ui/Button';

interface LocationFormProps {
  location?: Location;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LocationForm({ location, onSuccess, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: location?.name || '',
    code: location?.code || '',
    floor: location?.floor || '0',
    section: location?.section || 'front',
    building: location?.building || '',
    description: location?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (location) {
        // Update existing location
        await updateLocationUseCase.execute(location.id, formData);
      } else {
        // Create new location
        await createLocationUseCase.execute(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LocationFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <Input
        label="Location Name *"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        required
        placeholder="e.g., Lobby - Toilet Pria & Wanita"
        disabled={loading}
      />

      <Input
        label="Location Code *"
        value={formData.code}
        onChange={(value) => handleChange('code', value)}
        required
        placeholder="e.g., LOBBY"
        helpText="Unique code for this location (will be converted to uppercase)"
        disabled={loading}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor *</label>
          <select
            value={formData.floor}
            onChange={(e) => handleChange('floor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={loading}
          >
            <option value="0">Ground Floor</option>
            <option value="1">1st Floor</option>
            <option value="2">2nd Floor</option>
            <option value="3">3rd Floor</option>
            <option value="4">4th Floor</option>
            <option value="5">5th Floor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
          <select
            value={formData.section}
            onChange={(e) => handleChange('section', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={loading}
          >
            <option value="front">Front</option>
            <option value="back">Back</option>
            <option value="left">Left Wing</option>
            <option value="right">Right Wing</option>
            <option value="security">Security Area</option>
            <option value="admin">Administration</option>
          </select>
        </div>
      </div>

      <Input
        label="Building (Optional)"
        value={formData.building || ''}
        onChange={(value) => handleChange('building', value)}
        placeholder="e.g., Main Building, Tower A"
        disabled={loading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Additional notes about this location..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {location ? 'Update Location' : 'Create Location'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
export default LocationForm;
