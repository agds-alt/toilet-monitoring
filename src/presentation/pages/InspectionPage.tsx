// Page: InspectionPage (Toilet Checklist Form)
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Save, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/layout/BottomNav';
import { formatDate, formatTime } from '../lib/utils';
import { OPTIMIZED_INSPECTION_COMPONENTS, InspectionOptimizer } from '../../lib/inspection/optimized-components';
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
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Use optimized components
  const components = OPTIMIZED_INSPECTION_COMPONENTS;

  // No need for useEffect since we're using static components

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
    const inspectionResponses = Object.entries(responses).map(([componentId, value]) => ({
      componentId,
      value,
      notes: notes
    }));

    return InspectionOptimizer.calculateOverallScore(inspectionResponses);
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

  const renderComponent = (component: any) => {
    const currentValue = responses[component.id];
    const overallStatus = calculateOverallStatus();

    switch (component.type) {
      case 'rating':
        return (
          <div key={component.id} className={styles.componentGroup}>
            <label className={styles.componentLabel}>
              <span className={styles.componentIcon}>{component.icon}</span>
              {component.name}
              {component.required && <span className={styles.required}>*</span>}
            </label>
            <p className={styles.componentDescription}>{component.description}</p>
            <div className={styles.ratingGroup}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleResponseChange(component.id, rating)}
                  className={`${styles.ratingButton} ${
                    currentValue >= rating ? styles.ratingActive : ''
                  }`}
                >
                  <Star size={24} />
                </button>
              ))}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={component.id} className={styles.componentGroup}>
            <label className={styles.componentLabel}>
              <span className={styles.componentIcon}>{component.icon}</span>
              {component.name}
              {component.required && <span className={styles.required}>*</span>}
            </label>
            <p className={styles.componentDescription}>{component.description}</p>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="1"
                max="10"
                value={currentValue || 5}
                onChange={(e) => handleResponseChange(component.id, parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{currentValue || 5}/10</div>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={component.id} className={styles.componentGroup}>
            <label className={styles.componentLabel}>
              <span className={styles.componentIcon}>{component.icon}</span>
              {component.name}
              {component.required && <span className={styles.required}>*</span>}
            </label>
            <p className={styles.componentDescription}>{component.description}</p>
            <div className={styles.radioGroup}>
              {component.options?.map(option => (
                <label key={option} className={styles.radioOption}>
                  <input
                    type="radio"
                    name={component.id}
                    value={option}
                    checked={currentValue === option}
                    onChange={(e) => handleResponseChange(component.id, e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={`${styles.radioButton} ${
                    currentValue === option ? styles.radioSelected : ''
                  }`}>
                    <span className={styles.radioLabel}>{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={component.id} className={styles.componentGroup}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={currentValue || false}
                onChange={(e) => handleResponseChange(component.id, e.target.checked)}
                className={styles.checkboxInput}
              />
              <div className={`${styles.checkboxButton} ${
                currentValue ? styles.checkboxSelected : ''
              }`}>
                <span className={styles.componentIcon}>{component.icon}</span>
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxLabel}>{component.name}</span>
                  <p className={styles.componentDescription}>{component.description}</p>
                </div>
              </div>
            </label>
          </div>
        );

      case 'text':
        return (
          <div key={component.id} className={styles.componentGroup}>
            <label className={styles.componentLabel}>
              <span className={styles.componentIcon}>{component.icon}</span>
              {component.name}
              {component.required && <span className={styles.required}>*</span>}
            </label>
            <p className={styles.componentDescription}>{component.description}</p>
            <textarea
              value={currentValue || ''}
              onChange={(e) => handleResponseChange(component.id, e.target.value)}
              className={styles.textInput}
              placeholder="Masukkan catatan..."
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // No need for template check since we're using static components

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
            {components.map(renderComponent)}
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
              {calculateOverallStatus().icon}
            </span>
            <span className={styles.statusLabel}>
              {calculateOverallStatus().status.toUpperCase()}
            </span>
            <span className={styles.statusScore}>
              {Math.round(calculateOverallStatus().score)}%
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
