// src/app/seed/page.tsx
// ============================================
// SEED PAGE - Fixed Error Handling
// ============================================

'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResponse('');

    try {
      console.log('🌱 Seeding templates...');
      console.log('URL:', window.location.origin + '/api/seed/templates');

      const response = await fetch('/api/seed/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get raw text first
      const text = await response.text();
      console.log('Raw response:', text);
      setRawResponse(text);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        
        // Check if it's HTML (404 page)
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error('API route not found. Did you create /api/seed/templates/route.ts?');
        }
        
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }

      if (data.success) {
        setResult(data);
        console.log('✅ Success:', data);
      } else {
        setError(data.error || 'Failed to seed');
        console.error('❌ Error:', data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🌱 Direct seeding via Supabase...');

      // Import supabase client dynamically
      const { supabase } = await import('@/infrastructure/database/supabase');
      const { DEFAULT_TOILET_COMPONENTS } = await import('@/lib/constants/inspection.constants');

      // Check existing
      const { data: existing } = await supabase
        .from('inspection_templates')
        .select('id, name')
        .eq('is_default', true)
        .single();

      if (existing) {
        setResult({
          success: true,
          message: 'Template already exists',
          data: existing,
        });
        return;
      }

      // Create template
      const { data: template, error: createError } = await supabase
        .from('inspection_templates')
        .insert({
          name: 'Standard Toilet Inspection',
          description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
          estimated_time: 10,
          is_active: true,
          is_default: true,
          fields: {
            components: DEFAULT_TOILET_COMPONENTS,
          },
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setResult({
        success: true,
        message: 'Template created successfully',
        data: template,
      });

      console.log('✅ Template created:', template);
    } catch (err: any) {
      setError(err.message || 'Direct seed failed');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Verifying templates...');

      const { supabase } = await import('@/infrastructure/database/supabase');

      const { data: templates, error: verifyError } = await supabase
        .from('inspection_templates')
        .select('id, name, is_active, is_default')
        .eq('is_active', true);

      if (verifyError) {
        throw verifyError;
      }

      setResult({
        success: true,
        count: templates?.length || 0,
        data: templates || [],
      });

      console.log('✅ Found templates:', templates);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌱</div>
          <h1 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: 700 }}>
            Database Seed
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Initialize inspection templates
          </p>
        </div>

        {/* Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <button
            onClick={handleSeed}
            disabled={loading}
            style={{
              padding: '16px 20px',
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '24px' }}>🚀</span>
            <span>Via API Route</span>
          </button>

          <button
            onClick={handleDirectSeed}
            disabled={loading}
            style={{
              padding: '16px 20px',
              background: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '24px' }}>⚡</span>
            <span>Direct Seed</span>
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'white',
            color: '#3b82f6',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Verify Templates</span>
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div style={{
            padding: '20px',
            background: result.success ? '#dcfce7' : '#dbeafe',
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <strong style={{ fontSize: '16px' }}>
                {result.message || 'Success'}
              </strong>
            </div>

            {result.count !== undefined && (
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#4b5563' }}>
                Found {result.count} template(s)
              </p>
            )}

            {result.data && (
              <pre style={{
                margin: 0,
                padding: '12px',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
                fontSize: '11px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '16px',
            background: '#fee2e2',
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>❌</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', marginBottom: '8px' }}>
                  Error
                </strong>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#991b1b' }}>
                  {error}
                </p>
                {rawResponse && (
                  <details style={{ fontSize: '11px', marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                      View Raw Response
                    </summary>
                    <pre style={{
                      margin: 0,
                      padding: '8px',
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '150px',
                    }}>
                      {rawResponse}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          padding: '16px',
          background: '#f3f4f6',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#4b5563',
          lineHeight: 1.6,
        }}>
          <strong style={{ display: 'block', marginBottom: '8px' }}>
            💡 Options:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Via API Route:</strong> Uses /api/seed/templates (need to create route.ts first)</li>
            <li><strong>Direct Seed:</strong> Bypasses API, seeds directly from browser ⚡ (RECOMMENDED)</li>
            <li><strong>Verify:</strong> Check if templates exist</li>
          </ul>
        </div>

        {/* Success Action */}
        {result && result.success && (result.count > 0 || result.data?.id) && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a
              href="/inspection"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              🎉 Go to Inspection →
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}