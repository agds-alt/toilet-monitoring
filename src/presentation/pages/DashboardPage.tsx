// Dashboard Page - Simple & Mobile First
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QrCode, 
  Camera, 
  History, 
  Settings, 
  LogOut,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/presentation/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    todayInspections: 0,
    pendingInspections: 3,
    completedToday: 0
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleScanQR = () => {
    router.push('/scan');
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🚽</span>
              <h1 className="text-xl font-semibold text-gray-800">
                Toilet Monitoring
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Selamat Datang, {user?.email?.split('@')[0]}!
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(currentTime)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Inspeksi Hari Ini</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.todayInspections}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Menunggu Inspeksi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pendingInspections}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Selesai Hari Ini</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.completedToday}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            Mulai Inspeksi
          </h3>
          
          {/* Big Scan Button */}
          <button
            onClick={handleScanQR}
            className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <QrCode size={48} className="text-white" />
            </div>
            <span className="text-xl font-semibold mb-2">Scan QR Code</span>
            <span className="text-sm opacity-90">Tap untuk memulai scanning</span>
          </button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => router.push('/history')}
              className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <History className="text-gray-600" size={20} />
              <span className="text-gray-700 font-medium">Riwayat</span>
            </button>
            
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Settings className="text-gray-600" size={20} />
              <span className="text-gray-700 font-medium">Pengaturan</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Aktivitas Terakhir
          </h3>
          
          {stats.todayInspections === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-500">Belum ada inspeksi hari ini</p>
              <button
                onClick={handleScanQR}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Mulai Inspeksi Pertama →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Activity items would go here */}
              <p className="text-gray-500 text-sm">
                Menampilkan aktivitas terbaru...
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
        <div className="grid grid-cols-3 h-16">
          <button className="flex flex-col items-center justify-center gap-1 text-green-600">
            <QrCode size={20} />
            <span className="text-xs">Scan</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-gray-600">
            <History size={20} />
            <span className="text-xs">Riwayat</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-gray-600">
            <Settings size={20} />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
