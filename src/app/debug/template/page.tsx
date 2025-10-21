// src/app/debug/template/page.tsx
// ============================================
// DEBUG TEMPLATE PAGE - Test template loading
// ============================================

'use client';

import { useEffect, useState } from 'react';

export default function DebugTemplatePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testTemplateLoading();
  }, []);

  const testTemplateLoading = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    try {
      // Test 1: Check API route
      console.log('🧪 Test 1: Checking /api/templates...');
      const apiResponse = await fetch('/api/templates');
      const apiData = await apiResponse.json();

      results.tests.push({
        name: 'API /api/templates',
        status: apiResponse.ok ? 'PASS' : 'FAIL',
        data: apiData,
        response_status: apiResponse.status,
        content_type: apiResponse.headers.get('content-type'),
      });

      // Test 2: Direct Supabase query (if imported)
      console.log('🧪 Test 2: Direct Supabase query...');
      try {
        const { supabase } = await import('@/infrastructure/database/supabase');
        const { data, error, count } = await supabase
          .from('inspection_templates')
          .select('*', { count: 'exact' });

        results.tests.push({
          name: 'Direct Supabase Query',
          status: error ? 'FAIL' : 'PASS',
          data: data,
          count: count,
          error: error?.message,
        });
      } catch (err: any) {
        results.tests.push({
          name: 'Direct Supabase Query',
          status: 'ERROR',
          error: err.message,
        });
      }

      // Test 3: Template Service
      console.log('🧪 Test 3: Template Service...');
      try {
        const { templateService } = await import('@/infrastructure/services/template.service');
        const defaultTemplate = await templateService.getDefaultTemplate();

        results.tests.push({
          name: 'Template Service - getDefaultTemplate()',
          status: defaultTemplate ? 'PASS' : 'FAIL',
          data: defaultTemplate
            ? {
                id: defaultTemplate.id,
                name: defaultTemplate.name,
                is_default: defaultTemplate.is_default,
                components_count: defaultTemplate.fields?.components?.length,
              }
            : null,
        });
      } catch (err: any) {
        results.tests.push({
          name: 'Template Service - getDefaultTemplate()',
          status: 'ERROR',
          error: err.message,
        });
      }

      setResult(results);
    } catch (error: any) {
      results.error = error.message;
      setResult(results);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace' }}>
        <h1>🧪 Testing Template Loading...</h1>
        <p>Please wait...</p>
      </div>
    );
  }

  const allPassed = result?.tests?.every((t: any) => t.status === 'PASS');

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 1200, margin: '0 auto' }}>
      <h1>🧪 Template Loading Debug</h1>

      <div
        style={{
          padding: 20,
          background: allPassed ? '#d1fae5' : '#fee2e2',
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h2>{allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}</h2>
        <p>Timestamp: {result.timestamp}</p>
      </div>

      {result.tests?.map((test: any, idx: number) => (
        <div
          key={idx}
          style={{
            padding: 20,
            background: test.status === 'PASS' ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${test.status === 'PASS' ? '#22c55e' : '#ef4444'}`,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <h3>
            {test.status === 'PASS' ? '✅' : '❌'} {test.name}
          </h3>

          <p>
            <strong>Status:</strong> {test.status}
          </p>

          {test.response_status && (
            <p>
              <strong>HTTP Status:</strong> {test.response_status}
            </p>
          )}

          {test.content_type && (
            <p>
              <strong>Content-Type:</strong> {test.content_type}
            </p>
          )}

          {test.count !== undefined && (
            <p>
              <strong>Count:</strong> {test.count}
            </p>
          )}

          {test.error && (
            <div
              style={{
                padding: 10,
                background: '#fee2e2',
                borderRadius: 4,
                marginTop: 10,
              }}
            >
              <strong>Error:</strong> {test.error}
            </div>
          )}

          {test.data && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Data</summary>
              <pre
                style={{
                  background: '#f8f9fa',
                  padding: 10,
                  borderRadius: 4,
                  overflow: 'auto',
                  fontSize: 11,
                }}
              >
                {JSON.stringify(test.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}

      <div style={{ marginTop: 40, padding: 20, background: '#f8f9fa', borderRadius: 8 }}>
        <h3>🔧 Quick Fixes</h3>

        {!allPassed && (
          <>
            <h4>If API route fails:</h4>
            <ol>
              <li>
                Check file exists: <code>src/app/api/templates/route.ts</code>
              </li>
              <li>Check Supabase connection</li>
              <li>Check RLS policies</li>
            </ol>

            <h4>If Template Service fails:</h4>
            <ol>
              <li>
                Clear cache: Delete <code>.next</code> folder
              </li>
              <li>Restart dev server</li>
              <li>Check template exists in DB</li>
            </ol>
          </>
        )}

        <button
          onClick={() => {
            setLoading(true);
            testTemplateLoading();
          }}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: 20,
          }}
        >
          🔄 Re-run Tests
        </button>
      </div>
    </div>
  );
}
