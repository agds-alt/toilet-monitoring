// ===================================
// 📁 src/presentation/components/features/locations/QRCodeDisplay.tsx
// Component untuk display & download QR
// ===================================
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Copy, Check, Printer } from 'lucide-react';
import { useState } from 'react';
import styles from './QRCodeDisplay.module.css';

interface QRCodeDisplayProps {
  locationId: string;
  locationCode: string;
  locationName: string;
  building?: string;
  floor?: string;
  size?: number;
  showActions?: boolean;
}

export default function QRCodeDisplay({ 
  locationId, 
  locationCode, 
  locationName,
  building = '',
  floor = '',
  size = 256,
  showActions = true
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // QR Data: URL with code (human-readable)
  const qrUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${locationCode}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${locationId}`);
    if (!svg) return;

    // Convert SVG to Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    canvas.width = size + 100; // Extra padding
    canvas.height = size + 180; // Extra for text
    
    img.onload = () => {
      if (!ctx) return;
      
      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 50, 40, size, size);
      
      // Add text below QR
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(locationName, canvas.width / 2, size + 80);
      
      ctx.font = '16px Arial';
      ctx.fillText(`Kode: ${locationCode}`, canvas.width / 2, size + 110);
      
      if (building) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(building, canvas.width / 2, size + 135);
      }
      
      // Download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR_${locationCode}.png`;
      link.href = pngUrl;
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: locationName,
          text: `QR Code untuk ${locationName}`,
          url: qrUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyUrl();
    }
  };

  const printQR = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.qrWrapper}>
        <QRCodeSVG
          id={`qr-${locationId}`}
          value={qrUrl}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#1F2937"
        />
      </div>

      <div className={styles.info}>
        <div className={styles.locationName}>{locationName}</div>
        <div className={styles.locationCode}>
          <code>{locationCode}</code>
        </div>
        {building && (
          <div className={styles.building}>{building}</div>
        )}
        {floor && (
          <div className={styles.floor}>Lantai {floor}</div>
        )}
        <div className={styles.qrUrl}>{qrUrl}</div>
      </div>

      {showActions && (
        <div className={styles.actions}>
          <button onClick={downloadQR} className={styles.btn}>
            <Download size={16} />
            Download PNG
          </button>
          <button onClick={printQR} className={styles.btn}>
            <Printer size={16} />
            Print
          </button>
          <button onClick={copyUrl} className={styles.btn}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button onClick={shareQR} className={styles.btn}>
            <Share2 size={16} />
            Share
          </button>
        </div>
      )}
    </div>
  );
}
