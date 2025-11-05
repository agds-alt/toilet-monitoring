// src/app/inspection/[locationId]/page.tsx
// Inspection Form with Step-by-Step Wizard

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Clock,
  Save,
  Star,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase.client';

const supabase = createClient();

interface InspectionComponent {
  id: string;
  label: string;
  label_id: string;
  description: string;
  type: 'rating' | 'checkbox' | 'text';
  required: boolean;
  order: number;
  icon: string;
}

interface FormResponse {
  [key: string]: {
    rating?: number;
    notes?: string;
    hasIssue?: boolean;
  };
}

export default function InspectionForm() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.locationId as string;

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [components, setComponents] = useState<InspectionComponent[]>([]);
  const [responses, setResponses] = useState<FormResponse>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [startTime] = useState(new Date());

  // Fetch location and template
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get location
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .select('*')
          .eq('id', locationId)
          .single();

        if (locationError) throw locationError;
        setLocation(locationData);

        // Get default template
        const { data: templateData, error: templateError } = await supabase
          .from('inspection_templates')
          .select('*')
          .eq('is_default', true)
          .eq('is_active', true)
          .single();

        if (templateError) throw templateError;
        setTemplate(templateData);

        // Parse components from template
        if (templateData && (templateData as any).fields?.components) {
          setComponents((templateData as any).fields.components);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationId]);

  // Handle rating change
  const handleRating = (componentId: string, rating: number) => {
    setResponses(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        rating
      }
    }));
  };

  // Handle notes change
  const handleNotes = (componentId: string, notes: string) => {
    setResponses(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        notes
      }
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  // Calculate overall status
  const calculateOverallStatus = () => {
    const ratings = Object.values(responses)
      .map(r => r.rating)
      .filter(r => r !== undefined) as number[];
    
    if (ratings.length === 0) return 'Needs Work';
    
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    
    if (average >= 4) return 'Clean';
    if (average >= 2.5) return 'Needs Work';
    return 'Dirty';
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Calculate duration
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Upload photos to Supabase Storage
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `${locationId}_${Date.now()}_${photo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('inspection-photos')
          .upload(fileName, photo);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('inspection-photos')
            .getPublicUrl(fileName);
          photoUrls.push(publicUrl);
        }
      }

      // Create inspection record
      const inspectionData = {
        template_id: template.id,
        location_id: locationId,
        user_id: user.id,
        inspection_date: new Date().toISOString().split('T')[0],
        inspection_time: new Date().toTimeString().split(' ')[0],
        overall_status: calculateOverallStatus(),
        responses: responses,
        photo_urls: photoUrls,
        notes: notes || null,
        duration_seconds: duration,
        submitted_at: new Date().toISOString()
      };

      const { error: inspectionError } = await supabase
        .from('inspection_records')
        .insert(inspectionData);

      if (inspectionError) throw inspectionError;

      // Success - redirect to success page
      router.push(`/inspection/success?location=${location?.name}`);
    } catch (error) {
      console.error('Error submitting inspection:', error);
      alert('Gagal menyimpan inspeksi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Navigate steps
  const goToNext = () => {
    if (currentStep < components.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-green-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentComponent = components[currentStep];
  const currentResponse = responses[currentComponent?.id] || {};
  const progress = ((currentStep + 1) / components.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Kembali</span>
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-800">Inspeksi Toilet</h1>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <MapPin size={14} className="mr-1" />
                {location?.name}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Step {currentStep + 1} dari {components.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentComponent && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {/* Component Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{currentComponent.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentComponent.label_id || currentComponent.label}
              </h2>
              <p className="text-gray-600">{currentComponent.description}</p>
            </div>

            {/* Rating Component */}
            {currentComponent.type === 'rating' && (
              <div>
                <p className="text-center text-sm text-gray-600 mb-6">
                  Berikan penilaian kondisi:
                </p>
                <div className="flex justify-center gap-4 mb-8">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(currentComponent.id, rating)}
                      className={`transition-all transform hover:scale-110 ${
                        currentResponse.rating === rating ? 'scale-125' : ''
                      }`}
                    >
                      <Star
                        size={40}
                        className={`${
                          currentResponse.rating && currentResponse.rating >= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                
                {/* Rating Labels */}
                <div className="flex justify-between text-xs text-gray-500 px-4">
                  <span>Sangat Kotor</span>
                  <span>Bersih Sekali</span>
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={currentResponse.notes || ''}
                onChange={(e) => handleNotes(currentComponent.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                rows={3}
                placeholder="Tambahkan catatan jika ada masalah..."
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
            Sebelumnya
          </button>

          {currentStep === components.length - 1 ? (
            <button
              onClick={() => setCurrentStep(components.length)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Lanjut ke Review
              <CheckCircle size={20} />
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Selanjutnya
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </main>

      {/* Review & Submit (shown after all steps) */}
      {currentStep === components.length && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Review & Submit</h3>
            
            {/* Summary */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {components.map((comp) => {
                const response = responses[comp.id];
                return (
                  <div key={comp.id} className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">{comp.label_id}</span>
                    <div className="flex items-center gap-2">
                      {response?.rating && (
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < response.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                      {response?.notes && <AlertCircle size={14} className="text-blue-500" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Status Keseluruhan:</p>
              <p className="text-lg font-semibold text-gray-800">{calculateOverallStatus()}</p>
            </div>

            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Foto (Opsional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {photos.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{photos.length} foto dipilih</p>
              )}
            </div>

            {/* Final Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                rows={3}
                placeholder="Catatan umum untuk inspeksi ini..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(components.length - 1)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan Inspeksi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
