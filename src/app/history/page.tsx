'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { History, MapPin, Clock, Star, ArrowLeft } from 'lucide-react';
import { supabase } from '@/auth/supabase-auth';

export default function InspectionHistory() {
  const router = useRouter();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('inspection_records')
        .select(`
          *,
          location:locations(name)
        `)
        .eq('user_id', user.id)
        .order('inspection_date', { ascending: false })
        .limit(50);

      if (!error && data) {
        setInspections(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clean': return 'bg-green-100 text-green-800';
      case 'Needs Work': return 'bg-yellow-100 text-yellow-800';
      case 'Dirty': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span className="ml-2">Kembali</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Riwayat Inspeksi</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : inspections.length === 0 ? (
          <div className="text-center py-12">
            <History className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-500">Belum ada riwayat inspeksi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <MapPin size={16} />
                      {inspection.location?.name}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {new Date(inspection.inspection_date).toLocaleDateString('id-ID')} - {inspection.inspection_time}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inspection.overall_status)}`}>
                    {inspection.overall_status}
                  </span>
                </div>
                
                {inspection.notes && (
                  <p className="text-sm text-gray-600 italic">"{inspection.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}