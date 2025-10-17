// src/core/use-cases/GetInspectionHistory.ts
import { InspectionEntity } from '@/core/entities/Inspection';
import { IInspectionRepository } from '@/core/repositories/IInspectionRepository';

export interface GetInspectionHistoryDTO {
  userId?: string;
  locationId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class GetInspectionHistoryUseCase {
  constructor(private inspectionRepository: IInspectionRepository) {}

  async execute(dto: GetInspectionHistoryDTO): Promise<InspectionEntity[]> {
    return this.inspectionRepository.findMany(dto);
  }

  async getStats(userId: string): Promise<{
    total: number;
    allGood: number;
    hasIssues: number;
    lastInspection?: Date;
  }> {
    const inspections = await this.inspectionRepository.findMany({ userId });

    return {
      total: inspections.length,
      allGood: inspections.filter(i => !i.hasIssues()).length,
      hasIssues: inspections.filter(i => i.hasIssues()).length,
      lastInspection: inspections[0]?.createdAt
    };
  }
}