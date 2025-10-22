// Page: InspectionPage (Toilet Checklist Form)
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/layout/BottomNav';
import { formatDate, formatTime } from '../lib/utils';
import styles from './InspectionPage.module.css';

interface InspectionField {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'text' | 'number';
  options?: string[];
  required: boolean;
  order: number;
}

interface InspectionTemplate {
  id: string;
  name: string;
  fields: InspectionField[];
  estimatedTime: number;
}

interface InspectionPageProps {
  locationId: string;
  locationName?: string;
  locationCode?: string;
}

const InspectionPage: React.FC<InspectionPageProps> = ({ 
  locationId, 
  locationName = 'Toilet',
  locationCode = 'TOILET-001'
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState<InspectionTemplate | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Mock template data
  const mockTemplate: InspectionTemplate = {
    id: 'template-1',
    name: 'Toilet Inspection Template',
    estimatedTime: 5,
    fields: [
      {
        id: 'cleanliness',
        name: 'Kebersihan Umum',
        type: 'radio',
        options: ['excellent', 'good', 'fair', 'poor', 'critical'],
        required: true,
        order: 1
      },
      {
        id: 'toilet_bowl',
        name: 'Kondisi Toilet Bowl',
        type: 'radio',
        options: ['excellent', 'good', 'fair', 'poor', 'critical'],
        required: true,
        order: 2
      },
      {
        id: 'sink',
        name: 'Kondisi Wastafel',
        type: 'radio',
        options: ['excellent', 'good', 'fair', 'poor', 'critical'],
        required: true,
        order: 3
      },
      {
        id: 'soap_dispenser',
        name: 'Sabun Tersedia',
        type: 'checkbox',
        required: true,
        order: 4
      },
      {
        id: 'paper_towel',
        name: 'Tissue Tersedia',
        type: 'checkbox',
        required: true,
        order: 5
      },
      {
        id: 'lighting',
        name: 'Pencahayaan',
        type: 'radio',
        options: ['excellent', 'good', 'fair', 'poor', 'critical'],
        required: true,
        order: 6
      }
    ]
  };

  useEffect(() => {
    setTemplate(mockTemplate);
  }, []);

  const getStatusOptions = () => [
    { value: 'excellent', label: 'Excellent', icon: '✅', color: 'text-green-600' },
    { value: 'good', label: 'Good', icon: '👍', color: 'text-blue-600' },
    { value: 'fair', label: 'Fair', icon: '⚠️', color: 'text-yellow-600' },
    { value: 'poor', label: 'Poor', icon: '❌', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', icon: '🚨', color: 'text-red-600' }
  ];

  const handleResponseChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const calculateOverallStatus = () => {
    const statusValues = Object.values(responses).filter(value => 
      ['excellent', 'good', 'fair', 'poor', 'critical'].includes(value)
    );
    
    if (statusValues.length === 0) return 'fair';
    
    const statusCounts = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0
    };
    
    statusValues.forEach(status => {
      statusCounts[status as keyof typeof statusCounts]++;
    });
    
    if (statusCounts.critical > 0) return 'critical';
    if (statusCounts.poor > 1) return 'poor';
    if (statusCounts.fair > 2) return 'fair';
    if (statusCounts.good > statusCounts.excellent) return 'good';
    return 'excellent';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would submit to the backend
      console.log('Submitting inspection:', {
        locationId,
        responses,
        notes,
        photos: photos.length,
        overallStatus: calculateOverallStatus()
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/dashboard?success=true');
    } catch (error) {
      console.error('Error submitting inspection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: InspectionField) => {
    switch (field.type) {
      case 'radio':
        return (
          <div key={field.id} className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {field.name}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.radioGroup}>
              {getStatusOptions().map(option => (
                <label key={option.value} className={styles.radioOption}>
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={responses[field.id] === option.value}
                    onChange={(e) => handleResponseChange(field.id, e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={`${styles.radioButton} ${
                    responses[field.id] === option.value ? styles.radioSelected : ''
                  }`}>
                    <span className={styles.radioIcon}>{option.icon}</span>
                    <span className={`${styles.radioLabel} ${option.color}`}>
                      {option.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={field.id} className={styles.fieldGroup}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={responses[field.id] || false}
                onChange={(e) => handleResponseChange(field.id, e.target.checked)}
                className={styles.checkboxInput}
              />
              <div className={`${styles.checkboxButton} ${
                responses[field.id] ? styles.checkboxSelected : ''
              }`}>
                <span className={styles.checkboxIcon}>
                  {responses[field.id] ? '✅' : '⬜'}
                </span>
                <span className={styles.checkboxLabel}>{field.name}</span>
              </div>
            </label>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!template) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Memuat template inspeksi...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Inspeksi Toilet</h1>
          <p className={styles.subtitle}>
            {locationName} - {locationCode}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Location Info */}
        <div className={styles.locationCard}>
          <div className={styles.locationInfo}>
            <h2 className={styles.locationName}>{locationName}</h2>
            <p className={styles.locationCode}>{locationCode}</p>
            <p className={styles.inspectionTime}>
              {formatDate(new Date())} - {formatTime(new Date())}
            </p>
          </div>
        </div>

        {/* Inspection Form */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Form Inspeksi</h3>
          
          <div className={styles.formFields}>
            {template.fields
              .sort((a, b) => a.order - b.order)
              .map(renderField)}
          </div>
        </div>

        {/* Photo Section */}
        <div className={styles.photoSection}>
          <h3 className={styles.sectionTitle}>Foto Dokumentasi</h3>
          
          <div className={styles.photoUpload}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoCapture}
              className={styles.photoInput}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className={styles.photoButton}>
              <Camera size={20} />
              Tambah Foto
            </label>
          </div>

          {photos.length > 0 && (
            <div className={styles.photoGrid}>
              {photos.map((photo, index) => (
                <div key={index} className={styles.photoItem}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                    className={styles.photoPreview}
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className={styles.removePhoto}
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className={styles.notesSection}>
          <h3 className={styles.sectionTitle}>Catatan Tambahan</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambahkan catatan atau komentar..."
            className={styles.notesInput}
            rows={4}
          />
        </div>

        {/* Overall Status */}
        <div className={styles.statusSection}>
          <h3 className={styles.sectionTitle}>Status Keseluruhan</h3>
          <div className={styles.statusDisplay}>
            <span className={styles.statusIcon}>
              {getStatusOptions().find(opt => opt.value === calculateOverallStatus())?.icon}
            </span>
            <span className={styles.statusLabel}>
              {getStatusOptions().find(opt => opt.value === calculateOverallStatus())?.label}
            </span>
          </div>
        </div>
      </main>

      {/* Submit Button */}
      <div className={styles.submitSection}>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={Object.keys(responses).length === 0}
        >
          <Save size={20} />
          {isSubmitting ? 'Menyimpan...' : 'Simpan Inspeksi'}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default InspectionPage;
