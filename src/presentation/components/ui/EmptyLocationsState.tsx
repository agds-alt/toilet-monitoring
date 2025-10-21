// For when no locations exist
export function EmptyLocationsState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">🚽</div>
      <h3 className="text-lg font-medium text-gray-900">No locations yet</h3>
      <p className="text-gray-500 mt-2">Create your first location to get started</p>
    </div>
  );
}
