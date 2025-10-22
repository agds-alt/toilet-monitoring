// src/components/inspection/PhotoUpload.tsx
// ============================================
// PHOTO UPLOAD COMPONENT
// ============================================

'use client';

import { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  photos: File[];
  onCapture: (files: File[]) => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onCapture, onRemove, maxPhotos = 20 }: PhotoUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // Generate preview URLs
  const generatePreviews = async (files: File[]) => {
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      alert(`Maksimal ${maxPhotos} foto`);
      return;
    }

    setProcessing(true);
    await generatePreviews(files);
    onCapture(files);
    setProcessing(false);

    // Reset input
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onRemove(index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">
          Foto Dokumentasi
          <span className="text-sm text-gray-500 ml-2">
            ({photos.length}/{maxPhotos})
          </span>
        </h3>
        {processing && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memproses...
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Buttons */}
      {photos.length < maxPhotos && (
        <div className="grid grid-cols-2 gap-2">
          {/* Camera */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={processing}
            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Kamera</span>
          </button>

          {/* Gallery */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={processing}
            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Galeri</span>
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Info */}
      <p className="text-xs text-gray-500 mt-2">
        💡 Foto akan otomatis diberi watermark (timestamp, lokasi, GPS)
      </p>
    </div>
  );
}
