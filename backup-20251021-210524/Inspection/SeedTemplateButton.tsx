// src/presentation/components/features/inspection/SeedTemplateButton.tsx
// ============================================
// SEED TEMPLATE BUTTON - Quick Fix UI
// ============================================

'use client';

import React, { useState } from 'react';

export function SeedTemplateButton({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🌱 Seeding default template...');

      const response = await fetch('/api/seed/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Template created successfully!');
        setSuccess(true);

        // Refresh page after 1 second
        setTimeout(() => {
          window.location.reload();
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to create template');
      }
    } catch (err: any) {
      console.error('❌ Seed error:', err);
      setError(err.message || 'Gagal membuat template');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          padding: '16px',
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: '#166534', fontWeight: 600 }}>
          ✅ Template berhasil dibuat! Memuat ulang...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚽</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
        Template Belum Tersedia
      </h3>
      <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
        Template inspeksi default belum dibuat. Klik tombol di bawah untuk membuat template dengan
        11 komponen standar.
      </p>

      <button
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Membuat Template...</span>
          </>
        ) : (
          <>
            <span>🌱</span>
            <span>Buat Template Default</span>
          </>
        )}
      </button>

      {error && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '13px',
          }}
        >
          ❌ {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
