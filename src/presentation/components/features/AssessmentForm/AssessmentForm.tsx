// src/presentation/components/features/AssessmentForm/AssessmentForm.tsx - MINIMAL
'use client';

import * as React from 'react';

interface AssessmentFormProps {
  locationName: string;
  categories: any[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  locationName, 
  categories, 
  onSubmit, 
  onCancel 
}) => {
  const [value, setValue] = React.useState(3);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    onSubmit({
      assessments: {
        test: { value, notes: comment, timestamp: new Date().toISOString() }
      },
      overallComment: comment
    });
  };

  return (
    <div style={{ 
      padding: '24px', 
      border: '2px solid #10b981',
      borderRadius: '12px',
      background: '#f0fdf4',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#065f46', marginBottom: '16px' }}>
        ✅ AssessmentForm - MINIMAL VERSION
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>📍 Location:</strong> {locationName}</p>
        <p><strong>📋 Categories:</strong> {categories?.length || 0} categories</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
          Test Rating: 
        </label>
        <select 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '100%' }}
        >
          <option value={1}>1 - Very Poor</option>
          <option value={2}>2 - Poor</option>
          <option value={3}>3 - Fair</option>
          <option value={4}>4 - Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
          Comments:
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comments..."
          rows={3}
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            borderRadius: '6px', 
            border: '1px solid #d1d5db',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleSubmit}
          style={{ 
            padding: '12px 24px', 
            background: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📊 Submit Assessment
        </button>
        <button 
          onClick={onCancel}
          style={{ 
            padding: '12px 24px', 
            background: '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ❌ Cancel
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: '#dbeafe', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#1e40af'
      }}>
        <strong>🎯 Status:</strong> Minimal version loaded successfully!
        <br/>
        <strong>🚀 Next:</strong> Add features incrementally
      </div>
    </div>
  );
};
