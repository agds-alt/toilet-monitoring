'use client';

import { trpc } from '@/lib/trpc';

/**
 * Test page for tRPC implementation
 * Visit /test-trpc to see if tRPC is working
 */
export default function TestTRPCPage() {
  // Test query
  const { data: templates, isLoading, error } = trpc.template.list.useQuery({
    includeInactive: false,
  });

  // Test mutation
  const utils = trpc.useUtils();
  const createLocation = trpc.location.create.useMutation({
    onSuccess: () => {
      utils.location.list.invalidate();
      alert('Location created successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleTestMutation = () => {
    createLocation.mutate({
      name: 'Test Location from tRPC',
      floor: '1',
      section: 'Test',
      qr_code: `TEST-${Date.now()}`,
      description: 'Created via tRPC mutation',
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>tRPC Test Page</h1>

      <div style={{ marginTop: '2rem' }}>
        <h2>1. Query Test - List Templates</h2>
        {isLoading && <p>Loading templates...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {templates && (
          <div>
            <p>✅ Query working! Found {templates.count} templates</p>
            <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
              {JSON.stringify(templates, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>2. Mutation Test - Create Location</h2>
        <button
          onClick={handleTestMutation}
          disabled={createLocation.isPending}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {createLocation.isPending ? 'Creating...' : 'Test Create Location'}
        </button>
        {createLocation.isSuccess && (
          <p style={{ color: 'green' }}>✅ Mutation successful!</p>
        )}
        {createLocation.error && (
          <p style={{ color: 'red' }}>❌ Error: {createLocation.error.message}</p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>3. Type Safety Test</h2>
        <p>
          ✅ If you see TypeScript errors while editing this file, it means type safety is working!
        </p>
        <p>
          Try uncommenting the line below to see TypeScript catch the error:
        </p>
        <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
          {`// trpc.template.list.useQuery({ invalidProp: true }); // ❌ TypeScript error!`}
        </pre>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Documentation</h2>
        <p>
          See <code>src/lib/trpc/README.md</code> for complete usage guide
        </p>
        <p>
          See <code>src/lib/trpc/example-usage.tsx</code> for code examples
        </p>
      </div>
    </div>
  );
}
