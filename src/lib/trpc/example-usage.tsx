/**
 * Example Usage of tRPC in Components
 *
 * This file demonstrates various tRPC patterns.
 * Copy these examples into your components and modify as needed.
 */

'use client';

import { trpc } from '@/lib/trpc';
import { useState } from 'react';

// ============================================
// Example 1: Simple Query
// ============================================
export function InspectionListExample() {
  const { data, isLoading, error } = trpc.inspection.list.useQuery({
    limit: 10,
    offset: 0,
  });

  if (isLoading) return <div>Loading inspections...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Inspections ({data?.pagination.total})</h2>
      <ul>
        {data?.data.map((inspection) => (
          <li key={inspection.id}>
            {inspection.id} - {inspection.overall_status}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// Example 2: Query with Filters
// ============================================
export function FilteredInspectionsExample() {
  const [status, setStatus] = useState<'pass' | 'fail' | 'needs_attention'>(
    'pass'
  );

  const { data, refetch } = trpc.inspection.list.useQuery({
    status,
    limit: 20,
  });

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
        <option value="pass">Pass</option>
        <option value="fail">Fail</option>
        <option value="needs_attention">Needs Attention</option>
      </select>

      <button onClick={() => refetch()}>Refresh</button>

      <div>Found: {data?.pagination.total} inspections</div>
    </div>
  );
}

// ============================================
// Example 3: Create Mutation
// ============================================
export function CreateInspectionExample() {
  const utils = trpc.useContext();

  const createMutation = trpc.inspection.create.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      utils.inspection.list.invalidate();
      alert('Inspection created!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      location_id: '123e4567-e89b-12d3-a456-426614174001',
      user_id: '123e4567-e89b-12d3-a456-426614174002',
      overall_status: 'pass',
      photo_urls: [],
      notes: 'Test inspection',
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={createMutation.isPending}
    >
      {createMutation.isPending ? 'Creating...' : 'Create Inspection'}
    </button>
  );
}

// ============================================
// Example 4: Update Mutation
// ============================================
export function VerifyInspectionExample({ inspectionId }: { inspectionId: string }) {
  const utils = trpc.useContext();

  const verifyMutation = trpc.inspection.verify.useMutation({
    onSuccess: () => {
      // Invalidate specific query
      utils.inspection.getById.invalidate({ id: inspectionId });
      utils.inspection.list.invalidate();
    },
  });

  return (
    <button
      onClick={() =>
        verifyMutation.mutate({
          id: inspectionId,
          verification_notes: 'Verified by supervisor',
        })
      }
      disabled={verifyMutation.isPending}
    >
      {verifyMutation.isPending ? 'Verifying...' : 'Verify Inspection'}
    </button>
  );
}

// ============================================
// Example 5: Location Management
// ============================================
export function LocationManagementExample() {
  const utils = trpc.useContext();

  // Query locations
  const { data: locations } = trpc.location.list.useQuery({
    floor: '1',
  });

  // Create location mutation
  const createLocation = trpc.location.create.useMutation({
    onSuccess: () => {
      utils.location.list.invalidate();
    },
  });

  // Update location mutation
  const updateLocation = trpc.location.update.useMutation({
    onSuccess: () => {
      utils.location.list.invalidate();
    },
  });

  // Delete location mutation
  const deleteLocation = trpc.location.delete.useMutation({
    onSuccess: () => {
      utils.location.list.invalidate();
    },
  });

  return (
    <div>
      <h2>Locations</h2>

      {/* Create new location */}
      <button
        onClick={() =>
          createLocation.mutate({
            name: 'New Toilet',
            floor: '1',
            section: 'A',
            qr_code: 'QR001',
          })
        }
      >
        Create Location
      </button>

      {/* List locations */}
      <ul>
        {locations?.data.map((location) => (
          <li key={location.id}>
            {location.name} - {location.floor}/{location.section}
            <button
              onClick={() =>
                updateLocation.mutate({
                  id: location.id,
                  name: `${location.name} (Updated)`,
                })
              }
            >
              Update
            </button>
            <button onClick={() => deleteLocation.mutate({ id: location.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// Example 6: Template Selection
// ============================================
export function TemplateSelectionExample() {
  const { data: defaultTemplate } = trpc.template.list.useQuery({
    defaultOnly: true,
  });

  const { data: allTemplates } = trpc.template.list.useQuery({
    includeInactive: false,
  });

  return (
    <div>
      <h3>Default Template</h3>
      <pre>{JSON.stringify(defaultTemplate, null, 2)}</pre>

      <h3>All Templates</h3>
      <ul>
        {Array.isArray(allTemplates?.data) &&
          allTemplates?.data.map((template) => (
            <li key={template.id}>{template.name}</li>
          ))}
      </ul>
    </div>
  );
}

// ============================================
// Example 7: Error Handling
// ============================================
export function ErrorHandlingExample() {
  const mutation = trpc.inspection.create.useMutation({
    onError: (error) => {
      // Check error type
      if (error.data?.code === 'UNAUTHORIZED') {
        console.error('User not authenticated');
        // Redirect to login
      } else if ((error.data as any)?.zodError) {
        // Validation error
        console.error('Validation failed:', (error.data as any).zodError);
      } else {
        // Generic error
        console.error('Something went wrong:', error.message);
      }
    },
  });

  return <div>Check console for error handling examples</div>;
}

// ============================================
// Example 8: Optimistic Updates
// ============================================
export function OptimisticUpdateExample({ inspectionId }: { inspectionId: string }) {
  const utils = trpc.useContext();

  const verifyMutation = trpc.inspection.verify.useMutation({
    // Before mutation
    onMutate: async (newData: any) => {
      // Cancel outgoing refetches
      await utils.inspection.getById.cancel({ id: newData.id });

      // Snapshot current value
      const previousInspection = utils.inspection.getById.getData({
        id: newData.id,
      });

      // Optimistically update the UI
      if (previousInspection) {
        utils.inspection.getById.setData(
          { id: newData.id },
          {
            ...previousInspection.data,
            verified_at: new Date().toISOString(),
            verification_notes: newData.verification_notes,
          }
        );
      }

      // Return context with snapshot
      return { previousInspection };
    },

    // On error, rollback
    onError: (err, newData: any, context) => {
      if (context?.previousInspection) {
        utils.inspection.getById.setData(
          { id: newData.id },
          context.previousInspection
        );
      }
    },

    // Always refetch after success or error
    onSettled: (data, error, variables: any) => {
      utils.inspection.getById.invalidate({ id: variables.id });
    },
  });

  return (
    <button
      onClick={() =>
        verifyMutation.mutate({
          id: inspectionId,
          verification_notes: 'Optimistic update',
        })
      }
    >
      Verify (with Optimistic Update)
    </button>
  );
}

// ============================================
// Example 9: Dependent Queries
// ============================================
export function DependentQueriesExample({ locationId }: { locationId?: string }) {
  // First query - get location
  const { data: location } = trpc.location.getById.useQuery(
    { id: locationId! },
    {
      enabled: !!locationId, // Only run if locationId exists
    }
  );

  // Second query - depends on first query
  const { data: inspections } = trpc.inspection.list.useQuery(
    {
      location_id: location?.data.id,
      limit: 10,
    },
    {
      enabled: !!location?.data.id, // Only run if location is loaded
    }
  );

  return (
    <div>
      <h3>{location?.data.name}</h3>
      <p>Inspections: {inspections?.pagination.total}</p>
    </div>
  );
}

// ============================================
// Example 10: Pagination
// ============================================
export function PaginationExample() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading } = trpc.inspection.list.useQuery({
    limit,
    offset: page * limit,
  });

  const totalPages = data?.pagination.total
    ? Math.ceil(data.pagination.total / limit)
    : 0;

  return (
    <div>
      <div>
        Page {page + 1} of {totalPages}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.data.map((inspection) => (
            <li key={inspection.id}>{inspection.id}</li>
          ))}
        </ul>
      )}

      <div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button disabled={!data?.pagination.hasMore} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
