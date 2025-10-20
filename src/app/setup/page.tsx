// src/app/setup/page.tsx
// ============================================
// SETUP PAGE - One-click setup for inspection module
// ============================================

'use client';

import React, { useState } from 'react';
import styles from './setup.module.css';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Starting setup...');

      const response = await fetch('/api/seed/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Setup successful!', data);
        setResult(data);
      } else {
        throw new Error(data.error || 'Setup failed');
      }
    } catch (err: any) {
      console.error('❌ Setup error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simple fetch to check if template exists
      const response = await fetch('/api/templates');
      const data = await response.json();

      if (data.success && data.data?.length > 0) {
        setResult({
          success: true,
          message: 'Templates found!',
          data: {
            count: data.data.length,
            templates: data.data,
          },
        });
      } else {
        setError('No templates found. Please run setup first.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🚽 Inspection Module Setup</h1>
          <p className={styles.subtitle}>
            One-click setup untuk inspection module
          </p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Seed Template</h3>
              <p className={styles.stepDesc}>
                Create default inspection template dengan 11 komponen
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Verify</h3>
              <p className={styles.stepDesc}>
                Check apakah template berhasil dibuat
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Ready!</h3>
              <p className={styles.stepDesc}>
                Navigate ke /inspection dan mulai inspeksi
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            onClick={handleSetup}
            disabled={loading}
            className={styles.setupButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Run Setup</span>
              </>
            )}
          </button>

          <button
            onClick={handleVerify}
            disabled={loading}
            className={styles.verifyButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Verify Setup</span>
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={styles.result}>
            <div className={styles.resultSuccess}>
              <div className={styles.resultIcon}>✅</div>
              <div className={styles.resultContent}>
                <h3 className={styles.resultTitle}>{result.message}</h3>
                {result.data && (
                  <div className={styles.resultDetails}>
                    {result.data.id && (
                      <p>Template ID: <code>{result.data.id}</code></p>
                    )}
                    {result.data.name && (
                      <p>Template Name: <strong>{result.data.name}</strong></p>
                    )}
                    {result.data.count !== undefined && (
                      <p>Total Templates: <strong>{result.data.count}</strong></p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h4>🎯 Next Steps:</h4>
              <ol>
                <li>Navigate to <a href="/inspection">/inspection</a></li>
                <li>Test the inspection form</li>
                <li>Create your first inspection!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>❌</div>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Setup Failed</h3>
              <p className={styles.errorMessage}>{error}</p>
              <div className={styles.errorHelp}>
                <h4>🔧 Troubleshooting:</h4>
                <ul>
                  <li>Check Supabase connection</li>
                  <li>Verify .env variables</li>
                  <li>Check database schema</li>
                  <li>Check RLS policies</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className={styles.info}>
          <h4>ℹ️ Information</h4>
          <p>
            Setup ini akan membuat default inspection template dengan 11 komponen:
          </p>
          <div className={styles.components}>
            <span>🚽 Toilet Bowl</span>
            <span>🧹 Floor</span>
            <span>🧱 Wall</span>
            <span>🚰 Sink</span>
            <span>🧼 Soap</span>
            <span>🧻 Tissue</span>
            <span>🗑️ Trash Bin</span>
            <span>🚪 Door</span>
            <span>💨 Ventilation</span>
            <span>💡 Lighting</span>
            <span>👃 Smell</span>
          </div>
        </div>
      </div>
    </div>
  );
}