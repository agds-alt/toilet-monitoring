// ===================================
// 📁 src/presentation/components/features/inspection/InspectionModeSelector.tsx
// Mode Selection Component
// ===================================
'use client';

import { Sparkles, Briefcase, ArrowLeft } from 'lucide-react';
import { Location } from '@/core/entities/Location';
import { InspectionMode } from '@/app/dashboard/inspect/[locationId]/page';
import styles from './InspectionModeSelector.module.css';

interface Props {
  location: Location;
  onSelectMode: (mode: InspectionMode) => void;
  onBack: () => void;
}

export default function InspectionModeSelector({ location, onSelectMode, onBack }: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Back
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.locationInfo}>
          <div className={styles.locationIcon}>📍</div>
          <h2 className={styles.locationName}>{location.name}</h2>
          <div className={styles.locationMeta}>
            {location.code && <span className={styles.code}>{location.code}</span>}
            {location.building && <span>• {location.building}</span>}
            {location.floor && <span>• Lt. {location.floor}</span>}
          </div>
        </div>

        <div className={styles.modeTitle}>
          <h1>Choose Your Vibe! ✨</h1>
          <p>Pick an assessment style that matches your mood</p>
        </div>

        <div className={styles.modeCards}>
          <div 
            className={`${styles.modeCard} ${styles.genz}`}
            onClick={() => onSelectMode('genz')}
          >
            <div className={styles.modeIcon}>
              <Sparkles size={48} />
            </div>
            <h3 className={styles.modeName}>Gen Z Mode</h3>
            <p className={styles.modeDesc}>
              Fun, emoji, colorful vibes 😎
            </p>
            <div className={styles.modeFeatures}>
              <span>⭐ Stars & Emoji</span>
              <span>🎨 Colorful</span>
              <span>⚡ Quick & Fun</span>
            </div>
            <div className={styles.modeBadge}>RECOMMENDED</div>
          </div>

          <div 
            className={`${styles.modeCard} ${styles.professional}`}
            onClick={() => onSelectMode('professional')}
          >
            <div className={styles.modeIcon}>
              <Briefcase size={48} />
            </div>
            <h3 className={styles.modeName}>Professional Mode</h3>
            <p className={styles.modeDesc}>
              Clean, formal, corporate style 📊
            </p>
            <div className={styles.modeFeatures}>
              <span>📊 Numbers</span>
              <span>✓ Checkboxes</span>
              <span>📋 Formal</span>
            </div>
            <div className={styles.modeBadge}>BUSINESS</div>
          </div>
        </div>

        <div className={styles.hint}>
          💡 Don't worry, you can switch modes anytime!
        </div>
      </main>
    </div>
  );
}