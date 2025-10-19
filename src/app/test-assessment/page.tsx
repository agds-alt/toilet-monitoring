// src/app/test-assessment/page.tsx
'use client';

import { AssessmentForm } from '../../../presentation/components/features/AssessmentForm/AssessmentForm';

// Simple mock categories
const MOCK_CATEGORIES = [
  { id: 'cleanliness', name: 'Kebersihan', description: 'Tingkat kebersihan', weight: 3 },
  { id: 'supplies', name: 'Supplies', description: 'Ketersediaan bahan', weight: 2 },
  { id: 'functionality', name: 'Fungsionalitas', description: 'Kondisi peralatan', weight: 2 }
];

export default function TestAssessmentPage() {
  const handleSubmit = (data: any) => {
    console.log('📊 Assessment submitted:', data);
    alert(`✅ Assessment berhasil!\n\nCheck console untuk detail.`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh' 
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#1f2937', marginBottom: '8px' }}>🧪 Assessment Form Test</h1>
          <p style={{ color: '#6b7280', marginBottom: '0' }}>Testing minimal version without dependencies</p>
        </div>

        <AssessmentForm
          locationName="🚽 Lobby Toilet - Test Environment"
          categories={MOCK_CATEGORIES}
          onSubmit={handleSubmit}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
}
