// Page: AdminPage (Calendar view for inspection results)
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/layout/BottomNav';
import { formatDate, formatTime, getRelativeTime } from '../lib/utils';
import styles from './AdminPage.module.css';

interface InspectionResult {
  id: string;
  locationName: string;
  locationCode: string;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  inspectionDate: Date;
  inspectionTime: string;
  inspector: string;
  photoCount: number;
  notes?: string;
}

interface AdminPageProps {
  inspections?: InspectionResult[];
}

const AdminPage: React.FC<AdminPageProps> = ({ inspections = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedInspection, setSelectedInspection] = useState<InspectionResult | null>(null);

  // Mock data for demonstration
  const mockInspections: InspectionResult[] = [
    {
      id: '1',
      locationName: 'Toilet Lantai 1',
      locationCode: 'TOILET-001',
      status: 'excellent',
      inspectionDate: new Date(),
      inspectionTime: '10:30',
      inspector: 'John Doe',
      photoCount: 3,
      notes: 'Kondisi bersih dan terawat dengan baik'
    },
    {
      id: '2',
      locationName: 'Toilet Lantai 2',
      locationCode: 'TOILET-002',
      status: 'good',
      inspectionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      inspectionTime: '14:15',
      inspector: 'Jane Smith',
      photoCount: 2,
      notes: 'Sedikit kotor di area wastafel'
    },
    {
      id: '3',
      locationName: 'Toilet Lantai 3',
      locationCode: 'TOILET-003',
      status: 'poor',
      inspectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      inspectionTime: '09:45',
      inspector: 'Bob Wilson',
      photoCount: 4,
      notes: 'Perlu perbaikan segera'
    }
  ];

  const [displayInspections, setDisplayInspections] = useState<InspectionResult[]>(mockInspections);

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      critical: 'Critical'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      excellent: '✅',
      good: '👍',
      fair: '⚠️',
      poor: '❌',
      critical: '🚨'
    };
    return icons[status as keyof typeof icons] || '❓';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const getInspectionsForDate = (date: Date) => {
    return displayInspections.filter(inspection => {
      const inspectionDate = new Date(inspection.inspectionDate);
      return inspectionDate.toDateString() === date.toDateString();
    });
  };

  const getInspectionsForSelectedDate = () => {
    return getInspectionsForDate(selectedDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode('list');
  };

  const handleViewInspection = (inspection: InspectionResult) => {
    setSelectedInspection(inspection);
  };

  const handleDownloadReport = (inspection: InspectionResult) => {
    // In a real implementation, this would generate and download a PDF report
    console.log('Downloading report for:', inspection.id);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('calendar')}
              className={`${styles.toggleButton} ${viewMode === 'calendar' ? styles.active : ''}`}
            >
              <Calendar size={16} />
              Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
            >
              <Eye size={16} />
              Daftar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {viewMode === 'calendar' ? (
          <div className={styles.calendarView}>
            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
              <button
                onClick={() => navigateMonth('prev')}
                className={styles.navButton}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className={styles.monthTitle}>
                {selectedDate.toLocaleDateString('id-ID', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className={styles.navButton}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className={styles.calendarGrid}>
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - 6);
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const inspections = getInspectionsForDate(date);

                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(date)}
                    className={`${styles.calendarDay} ${
                      isCurrentMonth ? styles.currentMonth : styles.otherMonth
                    } ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  >
                    <span className={styles.dayNumber}>{date.getDate()}</span>
                    {inspections.length > 0 && (
                      <div className={styles.inspectionIndicators}>
                        {inspections.slice(0, 3).map((inspection, idx) => (
                          <div
                            key={idx}
                            className={`${styles.indicator} ${getStatusColor(inspection.status)}`}
                            title={`${inspection.locationName} - ${getStatusLabel(inspection.status)}`}
                          />
                        ))}
                        {inspections.length > 3 && (
                          <div className={styles.moreIndicator}>
                            +{inspections.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.listView}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>
                Hasil Inspeksi - {formatDate(selectedDate)}
              </h2>
              <span className={styles.resultCount}>
                {getInspectionsForSelectedDate().length} hasil
              </span>
            </div>

            <div className={styles.inspectionList}>
              {getInspectionsForSelectedDate().length === 0 ? (
                <div className={styles.emptyState}>
                  <Calendar size={48} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>Tidak ada inspeksi</h3>
                  <p className={styles.emptyDescription}>
                    Tidak ada hasil inspeksi untuk tanggal ini
                  </p>
                </div>
              ) : (
                getInspectionsForSelectedDate().map((inspection) => (
                  <div key={inspection.id} className={styles.inspectionCard}>
                    <div className={styles.inspectionHeader}>
                      <div className={styles.inspectionInfo}>
                        <h3 className={styles.locationName}>{inspection.locationName}</h3>
                        <p className={styles.locationCode}>{inspection.locationCode}</p>
                      </div>
                      <div className={`${styles.statusBadge} ${getStatusColor(inspection.status)}`}>
                        <span className={styles.statusIcon}>
                          {getStatusIcon(inspection.status)}
                        </span>
                        <span className={styles.statusLabel}>
                          {getStatusLabel(inspection.status)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.inspectionDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Inspektor:</span>
                        <span className={styles.detailValue}>{inspection.inspector}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Waktu:</span>
                        <span className={styles.detailValue}>{inspection.inspectionTime}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Foto:</span>
                        <span className={styles.detailValue}>{inspection.photoCount} foto</span>
                      </div>
                    </div>

                    {inspection.notes && (
                      <div className={styles.inspectionNotes}>
                        <p className={styles.notesText}>{inspection.notes}</p>
                      </div>
                    )}

                    <div className={styles.inspectionActions}>
                      <Button
                        onClick={() => handleViewInspection(inspection)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye size={16} />
                        Lihat Detail
                      </Button>
                      <Button
                        onClick={() => handleDownloadReport(inspection)}
                        variant="secondary"
                        size="sm"
                      >
                        <Download size={16} />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default AdminPage;
