// Type-safe wrapper for inspection service
import { inspectionService } from './inspection.service';
import { dbToInspectionRecord, dbToInspectionTemplate } from '@/lib/utils/type-helpers';

export const typedInspectionService = {
  async getInspectionById(id: string) {
    const result = await inspectionService.getInspectionById(id);
    return result ? dbToInspectionRecord(result) : null;
  },
  
  async getInspectionsByLocation(locationId: string, limit?: number) {
    const results = await inspectionService.getInspectionsByLocation(locationId, limit);
    return results.map(dbToInspectionRecord);
  },
  
  // ... add other methods as needed
};
