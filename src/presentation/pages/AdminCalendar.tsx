// src/app/admin/calendar/page.tsx
// Admin Dashboard with Calendar View

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  Star,
  Image,
  X,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase.client'
const supabase = createClient();

interface InspectionRecord {
  id: string;
  inspection_date: string;
  inspection_time: string;
  location: any;
  user: any;
  overall_status: 'Clean' | 'Needs Work' | 'Dirty';
  responses: any;
  photo_urls: string[];
  notes: string | null;
  duration_seconds: number | null;
}

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [monthInspections, setMonthInspections] = useState<{[key: string]: InspectionRecord[]}>({});

  // Get month and year
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Fetch inspections for current month
  useEffect(() => {
    fetchMonthInspections();
  }, [currentDate]);

  const fetchMonthInspections = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('inspection_records')
        .select(`
          *,
          location:locations(*),
          user:users(*)
        `)
        .gte('inspection_date', startDate.toISOString().split('T')[0])
        .lte('inspection_date', endDate.toISOString().split('T')[0])
        .order('inspection_date', { ascending: false });

      if (error) throw error;

      // Group by date
      const grouped: {[key: string]: InspectionRecord[]} = {};
      data?.forEach((inspection: any) => {
        const dateKey = inspection.inspection_date;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(inspection);
      });
      
      setMonthInspections(grouped);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    
    const dateKey = date.toISOString().split('T')[0];
    const dayInspections = monthInspections[dateKey] || [];
    setInspections(dayInspections);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clean':
        return 'text-green-600 bg-green-50';
      case 'Needs Work':
        return 'text-yellow-600 bg-yellow-50';
      case 'Dirty':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clean':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Needs Work':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'Dirty':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  // Calculate average rating
  const calculateAverageRating = (responses: any) => {
    const ratings = Object.values(responses)
      .map((r: any) => r.rating)
      .filter((r: any) => r !== undefined) as number[];
    
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  };

  // Get inspection count for date
  const getInspectionCountForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toISOString().split('T')[0];
    return monthInspections[dateKey]?.length || 0;
  };

  // Get inspection status summary for date
  const getStatusSummaryForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toISOString().split('T')[0];
    const dayInspections = monthInspections[dateKey] || [];
    
    const summary = {
      clean: 0,
      needsWork: 0,
      dirty: 0
    };
    
    dayInspections.forEach(inspection => {
      if (inspection.overall_status === 'Clean') summary.clean++;
      else if (inspection.overall_status === 'Needs Work') summary.needsWork++;
      else if (inspection.overall_status === 'Dirty') summary.dirty++;
    });
    
    return summary;
  };

  const days = getDaysInMonth();
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-green-600" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Kalender</h1>
                <p className="text-sm text-gray-600">Monitor hasil inspeksi harian</p>
              </div>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Hari Ini
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentMonth} {currentYear}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 border-b">
                {weekDays.map(day => (
                  <div key={day} className="py-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="p-4 border-r border-b" />;
                  }

                  const isToday = 
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  const isSelected = 
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    currentDate.getFullYear() === selectedDate.getFullYear();

                  const inspectionCount = getInspectionCountForDate(day);
                  const statusSummary = getStatusSummaryForDate(day);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        p-4 border-r border-b hover:bg-gray-50 transition relative
                        ${isToday ? 'bg-green-50' : ''}
                        ${isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''}
                      `}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-2">{day}</div>
                      
                      {inspectionCount > 0 && (
                        <>
                          <div className="text-xs text-gray-500 mb-1">
                            {inspectionCount} inspeksi
                          </div>
                          <div className="flex justify-center gap-1">
                            {statusSummary.clean > 0 && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                            {statusSummary.needsWork > 0 && (
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            )}
                            {statusSummary.dirty > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inspection List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedDate 
                ? `Inspeksi ${selectedDate.toLocaleDateString('id-ID', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}`
                : 'Pilih Tanggal'}
            </h3>

            {selectedDate && inspections.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="text-gray-400 mx-auto mb-3" size={48} />
                <p className="text-gray-500">Tidak ada inspeksi pada tanggal ini</p>
              </div>
            )}

            {inspections.length > 0 && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {inspections.map((inspection) => (
                  <button
                    key={inspection.id}
                    onClick={() => setSelectedInspection(inspection)}
                    className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-800">
                          {inspection.location?.name}
                        </span>
                      </div>
                      {getStatusIcon(inspection.overall_status)}
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {inspection.inspection_time}
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        {inspection.user?.full_name || inspection.user?.email}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inspection.overall_status)}`}>
                        {inspection.overall_status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Detail Inspeksi</h3>
              <button
                onClick={() => setSelectedInspection(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="font-medium">{selectedInspection.location?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedInspection.overall_status)}`}>
                    {selectedInspection.overall_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                  <p className="font-medium">
                    {new Date(selectedInspection.inspection_date).toLocaleDateString('id-ID')} - {selectedInspection.inspection_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inspector</p>
                  <p className="font-medium">{selectedInspection.user?.full_name || selectedInspection.user?.email}</p>
                </div>
              </div>

              {/* Ratings */}
              {selectedInspection.responses && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Penilaian Komponen</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedInspection.responses).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        {value.rating && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < value.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedInspection.notes && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Catatan</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedInspection.notes}
                  </p>
                </div>
              )}

              {/* Photos */}
              {selectedInspection.photo_urls && selectedInspection.photo_urls.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Foto Dokumentasi</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedInspection.photo_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90"
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
