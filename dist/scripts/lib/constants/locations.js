"use strict";
// ============================================
// FIX 3: src/lib/constants/locations.ts
// Add UUID validation and better error handling
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationExists = exports.getLocationsByFloor = exports.searchLocations = exports.convertLegacyIdToUUID = exports.getLocationById = exports.getLocationByCode = exports.isValidUUID = exports.LOCATIONS = void 0;
exports.LOCATIONS = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Toilet Lobby',
        code: 'LOBBY',
        floor: 0,
        section: 'front'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Toilet Lt 1 Depan',
        code: 'LT1-DEPAN',
        floor: 1,
        section: 'front'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Toilet Lt 1 Belakang',
        code: 'LT1-BELAKANG',
        floor: 1,
        section: 'back'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Toilet Lt 2 Depan',
        code: 'LT2-DEPAN',
        floor: 2,
        section: 'front'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Toilet Lt 2 Belakang',
        code: 'LT2-BELAKANG',
        floor: 2,
        section: 'back'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Toilet Lt 3 Depan',
        code: 'LT3-DEPAN',
        floor: 3,
        section: 'front'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Toilet Lt 3 Belakang',
        code: 'LT3-BELAKANG',
        floor: 3,
        section: 'back'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Toilet Security',
        code: 'SECURITY',
        floor: 0,
        section: 'security'
    }
];
// ✅ Validate UUID format
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
// ✅ Get location by code (QR scan)
const getLocationByCode = (code) => {
    return exports.LOCATIONS.find(loc => loc.code === code);
};
exports.getLocationByCode = getLocationByCode;
// ✅ Get location by UUID
const getLocationById = (id) => {
    if (!(0, exports.isValidUUID)(id)) {
        console.warn('⚠️ Invalid UUID format:', id);
        return undefined;
    }
    return exports.LOCATIONS.find(loc => loc.id === id);
};
exports.getLocationById = getLocationById;
// ✅ Convert old numeric ID to UUID (for backwards compatibility)
const convertLegacyIdToUUID = (legacyId) => {
    const map = {
        '1': '550e8400-e29b-41d4-a716-446655440001',
        '2': '550e8400-e29b-41d4-a716-446655440002',
        '3': '550e8400-e29b-41d4-a716-446655440003',
        '4': '550e8400-e29b-41d4-a716-446655440004',
        '5': '550e8400-e29b-41d4-a716-446655440005',
        '6': '550e8400-e29b-41d4-a716-446655440006',
        '7': '550e8400-e29b-41d4-a716-446655440007',
        '8': '550e8400-e29b-41d4-a716-446655440008',
    };
    return map[String(legacyId)];
};
exports.convertLegacyIdToUUID = convertLegacyIdToUUID;
// ✅ Search locations
const searchLocations = (query) => {
    const lowerQuery = query.toLowerCase();
    return exports.LOCATIONS.filter(loc => loc.name.toLowerCase().includes(lowerQuery) ||
        loc.code.toLowerCase().includes(lowerQuery));
};
exports.searchLocations = searchLocations;
// ✅ Get locations by floor
const getLocationsByFloor = (floor) => {
    return exports.LOCATIONS.filter(loc => loc.floor === floor);
};
exports.getLocationsByFloor = getLocationsByFloor;
// ✅ Validate location exists
const locationExists = (id) => {
    return exports.LOCATIONS.some(loc => loc.id === id);
};
exports.locationExists = locationExists;
