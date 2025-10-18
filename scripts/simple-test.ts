console.log('🧪 Testing basic TypeScript execution...');

// Test basic imports
import { getLocationById } from '../../lib/constants/locations';

console.log('✅ Basic import successful');

// Test location mapping
const location = getLocationById('550e8400-e29b-41d4-a716-446655440001');
console.log('📍 Location test:', location?.name || 'Not found');

console.log('✅ Simple test completed');
