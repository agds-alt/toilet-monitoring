// src/presentation/components/ui/Skeleton.tsx
export function LocationSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-lg">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}