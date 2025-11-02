# tRPC Integration Guide

## Overview

tRPC has been integrated into this project to provide:
- **End-to-end type safety** from client to server
- **Auto-completion** for all API calls
- **Runtime validation** with Zod schemas
- **Better developer experience** with automatic type inference

## Project Structure

```
src/
├── server/
│   ├── context.ts              # tRPC context with Supabase auth
│   └── routers/
│       ├── _app.ts            # Root router combining all routers
│       ├── inspection.router.ts
│       ├── location.router.ts
│       └── template.router.ts
├── lib/trpc/
│   ├── client.ts              # tRPC client configuration
│   ├── Provider.tsx           # React Query + tRPC provider
│   └── index.ts               # Exports
└── app/
    └── api/trpc/[trpc]/
        └── route.ts           # Next.js API handler
```

## Usage Examples

### 1. Query Data (GET operations)

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function InspectionList() {
  // Type-safe query with auto-completion
  const { data, isLoading, error } = trpc.inspection.list.useQuery({
    status: 'pass',
    limit: 10,
    offset: 0,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((inspection) => (
        <div key={inspection.id}>{inspection.id}</div>
      ))}
    </div>
  );
}
```

### 2. Mutation (POST/PUT/DELETE operations)

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function CreateInspectionForm() {
  const utils = trpc.useContext();

  const createInspection = trpc.inspection.create.useMutation({
    // Invalidate and refetch after mutation
    onSuccess: () => {
      utils.inspection.list.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createInspection.mutateAsync({
        template_id: 'uuid-here',
        location_id: 'uuid-here',
        user_id: 'uuid-here',
        overall_status: 'pass',
        photo_urls: [],
      });

      console.log('Created:', result.data);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={createInspection.isLoading}
      >
        {createInspection.isLoading ? 'Creating...' : 'Create Inspection'}
      </button>
    </form>
  );
}
```

### 3. Get Single Item by ID

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function InspectionDetail({ id }: { id: string }) {
  const { data, isLoading } = trpc.inspection.getById.useQuery({ id });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Inspection {data?.data.id}</h1>
      <p>Status: {data?.data.overall_status}</p>
    </div>
  );
}
```

### 4. Location Examples

```tsx
// List locations
const { data } = trpc.location.list.useQuery({
  floor: '1',
  section: 'A',
});

// Create location
const createLocation = trpc.location.create.useMutation();
await createLocation.mutateAsync({
  name: 'Toilet A',
  floor: '1',
  section: 'A',
  qr_code: 'QR123',
});

// Update location
const updateLocation = trpc.location.update.useMutation();
await updateLocation.mutateAsync({
  id: 'location-uuid',
  name: 'Updated Name',
});

// Delete location (soft delete)
const deleteLocation = trpc.location.delete.useMutation();
await deleteLocation.mutateAsync({ id: 'location-uuid' });
```

### 5. Template Examples

```tsx
// Get default template
const { data } = trpc.template.list.useQuery({ defaultOnly: true });

// List all active templates
const { data } = trpc.template.list.useQuery({
  includeInactive: false,
});

// Create template
const createTemplate = trpc.template.create.useMutation();
await createTemplate.mutateAsync({
  name: 'Daily Inspection',
  description: 'Standard daily inspection',
  questions: [
    { id: '1', text: 'Is the toilet clean?', type: 'boolean' },
  ],
  is_default: true,
});
```

## Server-Side Usage

For server components or API routes:

```tsx
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

export async function ServerComponent() {
  // Create a caller
  const context = await createContext({
    req: new Request('http://localhost:3000'),
    resHeaders: new Headers(),
  });

  const caller = appRouter.createCaller(context);

  // Call procedures directly
  const inspections = await caller.inspection.list({
    limit: 10,
    offset: 0,
  });

  return <div>{inspections.data.length} inspections</div>;
}
```

## Authentication

The tRPC context automatically includes:
- `ctx.supabase` - Authenticated Supabase client
- `ctx.user` - Current user (null if not authenticated)

### Protected Procedures

Use `protectedProcedure` instead of `publicProcedure` to require authentication:

```ts
export const myRouter = router({
  protectedAction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // ctx.user is guaranteed to be present
      const userId = ctx.user.id;
      // ... your logic
    }),
});
```

### Admin Procedures

Use `adminProcedure` to require admin role:

```ts
export const adminRouter = router({
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only admins can execute this
      // ...
    }),
});
```

## Error Handling

tRPC provides structured error handling:

```tsx
const mutation = trpc.inspection.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      // Handle auth error
      redirect('/login');
    } else if (error.data?.zodError) {
      // Handle validation error
      console.error('Validation failed:', error.data.zodError);
    } else {
      // Generic error
      console.error('Error:', error.message);
    }
  },
});
```

## React Query Integration

tRPC is built on React Query, so you get all React Query features:

```tsx
// Manual refetch
const { refetch } = trpc.inspection.list.useQuery({ limit: 10 });

// Invalidate cache
const utils = trpc.useContext();
utils.inspection.list.invalidate();

// Prefetch data
await utils.inspection.getById.prefetch({ id: 'uuid' });

// Optimistic updates
const updateMutation = trpc.inspection.verify.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.inspection.getById.cancel();

    // Snapshot previous value
    const previous = utils.inspection.getById.getData({ id: newData.id });

    // Optimistically update
    utils.inspection.getById.setData({ id: newData.id }, {
      ...previous!,
      verified_at: new Date().toISOString(),
    });

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.inspection.getById.setData(
      { id: newData.id },
      context?.previous
    );
  },
  onSettled: (data, error, variables) => {
    // Always refetch after error or success
    utils.inspection.getById.invalidate({ id: variables.id });
  },
});
```

## Adding New Procedures

1. **Create Zod Schema** for input validation
2. **Add procedure** to appropriate router
3. **Export router** from `_app.ts`
4. **Use in components** - types are automatically inferred!

Example:

```ts
// src/server/routers/inspection.router.ts
export const inspectionRouter = router({
  // ... existing procedures

  deleteInspection: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('inspection_records')
        .delete()
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      return { success: true, data };
    }),
});
```

Then use it:

```tsx
const deleteMutation = trpc.inspection.deleteInspection.useMutation();
await deleteMutation.mutateAsync({ id: 'uuid' });
```

## Benefits Over REST APIs

✅ **Type Safety**: Catch errors at compile time, not runtime
✅ **Auto-completion**: IDE knows all available procedures and their inputs
✅ **Validation**: Zod schemas validate input automatically
✅ **Less Boilerplate**: No need to write fetch calls or define types twice
✅ **Better DX**: Refactoring is safe - TypeScript will catch all breaking changes

## Migration from REST

You can gradually migrate from REST to tRPC:

1. Keep existing REST endpoints working
2. Create tRPC procedures for new features
3. Migrate existing components one by one
4. Remove old REST endpoints when no longer used

Both approaches can coexist during migration.
