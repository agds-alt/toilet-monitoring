# tRPC Integration - Type-Safe API Layer

## ✅ What's Been Added

tRPC has been successfully integrated into this project to provide end-to-end type safety and eliminate API-related debugging issues.

## 📦 Dependencies Installed

- `@trpc/server` - tRPC server implementation
- `@trpc/client` - tRPC client for making requests
- `@trpc/react-query` - React hooks for tRPC
- `@trpc/next` - Next.js adapter
- `@tanstack/react-query@5` - React Query v5 (upgraded from v4)
- `superjson` - Serialization for complex types (Date, Map, Set, etc.)

## 🏗️ Project Structure

```
src/
├── server/
│   ├── context.ts                    # tRPC context with Supabase auth
│   └── routers/
│       ├── _app.ts                   # Root router
│       ├── inspection.router.ts      # Inspection procedures
│       ├── location.router.ts        # Location procedures
│       └── template.router.ts        # Template procedures
│
├── lib/trpc/
│   ├── client.ts                     # tRPC client configuration
│   ├── Provider.tsx                  # React provider
│   ├── index.ts                      # Exports
│   ├── README.md                     # Complete documentation
│   └── example-usage.tsx             # 10+ usage examples
│
├── app/
│   ├── layout.tsx                    # TRPCProvider integrated ✅
│   ├── api/trpc/[trpc]/route.ts     # API handler
│   └── test-trpc/page.tsx           # Test page
```

## 🚀 Quick Start

### 1. Using tRPC in Components

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function MyComponent() {
  // Query data
  const { data, isLoading } = trpc.inspection.list.useQuery({
    limit: 10,
    offset: 0,
  });

  // Mutate data
  const createInspection = trpc.inspection.create.useMutation();

  return <div>{/* Your UI */}</div>;
}
```

### 2. Available Routers

#### Inspection Router
- `inspection.list` - List inspections with filters & pagination
- `inspection.getById` - Get single inspection
- `inspection.create` - Create new inspection (protected)
- `inspection.verify` - Verify inspection (protected)

#### Location Router
- `location.list` - List locations with filters
- `location.getById` - Get single location
- `location.create` - Create location (protected)
- `location.update` - Update location (protected)
- `location.delete` - Soft delete location (protected)

#### Template Router
- `template.list` - List templates
- `template.getById` - Get single template
- `template.create` - Create template (protected)
- `template.update` - Update template (protected)
- `template.delete` - Soft delete template (protected)

### 3. Authentication

tRPC automatically handles authentication through Supabase:

```tsx
// Protected procedures require authentication
const result = await trpc.inspection.create.mutate({
  // ... data
});
// If not authenticated, will throw UNAUTHORIZED error
```

The context includes:
- `ctx.supabase` - Authenticated Supabase client
- `ctx.user` - Current user (or null)

## 📚 Documentation

- **Complete Guide**: `src/lib/trpc/README.md`
- **Code Examples**: `src/lib/trpc/example-usage.tsx`
- **Test Page**: Visit `/test-trpc` after running the dev server

## ✨ Key Benefits

### 1. End-to-End Type Safety
```tsx
// ✅ TypeScript knows all available procedures
trpc.inspection.list.useQuery({
  status: 'pass', // ✅ Autocomplete!
  limit: 10,
});

// ❌ TypeScript catches errors at compile time
trpc.inspection.list.useQuery({
  status: 'invalid', // ❌ Error: not assignable to type 'pass' | 'fail' | 'needs_attention'
});
```

### 2. Automatic Validation
All inputs are validated with Zod schemas:
```tsx
trpc.inspection.create.mutate({
  template_id: 'not-a-uuid', // ❌ Validation error: Invalid UUID format
});
```

### 3. Better Error Handling
```tsx
const mutation = trpc.inspection.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      // Handle auth error
    } else if (error.data?.zodError) {
      // Handle validation error
    }
  },
});
```

### 4. React Query Integration
Get all React Query features for free:
```tsx
// Automatic refetching
const { refetch } = trpc.inspection.list.useQuery({ limit: 10 });

// Cache invalidation
const utils = trpc.useUtils();
utils.inspection.list.invalidate();

// Optimistic updates
// ... (see examples)
```

## 🔄 Migration Strategy

You can migrate gradually:

1. ✅ tRPC is set up and ready to use
2. 📝 Old REST API routes in `src/app/api/*` still work
3. 🎯 Use tRPC for new features
4. 🔄 Migrate existing API calls one by one
5. 🗑️ Remove old API routes when no longer needed

## 🧪 Testing

Visit the test page to verify tRPC is working:

```bash
npm run dev
# Then visit: http://localhost:3000/test-trpc
```

## 🛠️ Adding New Procedures

1. Add Zod schema for validation
2. Add procedure to appropriate router
3. Use in components - types are automatic!

Example:
```ts
// src/server/routers/inspection.router.ts
export const inspectionRouter = router({
  deleteInspection: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Your logic here
    }),
});
```

Then use it:
```tsx
const deleteMutation = trpc.inspection.deleteInspection.useMutation();
await deleteMutation.mutateAsync({ id: 'uuid' });
```

## 🎯 Next Steps

1. ✅ Read the complete documentation: `src/lib/trpc/README.md`
2. ✅ Check out examples: `src/lib/trpc/example-usage.tsx`
3. ✅ Test the implementation: Visit `/test-trpc`
4. 🚀 Start using tRPC in your components
5. 🔄 Gradually migrate existing API calls

## 📝 Notes

- All authentication is handled automatically via Supabase
- Validation happens on both client and server
- TypeScript will catch breaking changes during refactoring
- React Query cache management is built-in
- No more manual fetch calls or type definitions needed!

## 🤝 Support

For questions or issues:
- Check the README: `src/lib/trpc/README.md`
- Check examples: `src/lib/trpc/example-usage.tsx`
- tRPC docs: https://trpc.io
- React Query docs: https://tanstack.com/query/latest

---

**Status**: ✅ Fully integrated and ready to use!
