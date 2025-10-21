// Helper to map DB location to LocationData
function dbToLocationData(dbLoc: any) {
  return {
    id: dbLoc.id,
    name: dbLoc.name,
    address: dbLoc.name, // Use name as address if not exists
    city: dbLoc.area,
    postal_code: dbLoc.code,
    floor: dbLoc.floor,
    building: dbLoc.building,
    qr_code: dbLoc.qr_code,
  };
}

// Use this in all location.service.ts returns
// Replace: return data as LocationData;
// With: return dbToLocationData(data);
