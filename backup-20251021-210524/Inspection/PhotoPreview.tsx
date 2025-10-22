// src/presentation/components/features/Inspection/PhotoPreview.tsx
'use client';

import React from 'react';

interface PhotoPreviewProps {
  url: string;
  onRemove?: (preview: string) => void;
}

export function PhotoPreview({ url, onRemove }: PhotoPreviewProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={url}
        alt="Preview"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
      {onRemove && (
        <button onClick={onRemove} style={{ position: 'absolute', top: 0, right: 0 }}>
          ×
        </button>
      )}
    </div>
  );
}

export default PhotoPreview;
