// Repository Interface: IInspectionRepository
import { InspectionEntity } from '../../../domain/entities/Inspection';

export interface IInspectionRepository {
  findById(id: string): Promise<InspectionEntity | null>;
  findByLocationId(locationId: string): Promise<InspectionEntity[]>;
  findByUserId(userId: string): Promise<InspectionEntity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<InspectionEntity[]>;
  findByLocationAndDate(locationId: string, date: Date): Promise<InspectionEntity[]>;
  create(inspection: InspectionEntity): Promise<InspectionEntity>;
  update(inspection: InspectionEntity): Promise<InspectionEntity>;
  delete(id: string): Promise<void>;
  getInspectionStats(locationId?: string, startDate?: Date, endDate?: Date): Promise<{
    total: number;
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    critical: number;
  }>;
}
