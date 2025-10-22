// Domain Service: InspectionService
import { InspectionEntity, InspectionStatus, InspectionResponse } from '../entities/Inspection';

export interface InspectionTemplate {
  id: string;
  name: string;
  fields: InspectionField[];
  estimatedTime: number;
}

export interface InspectionField {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
  order: number;
}

export class InspectionService {
  static calculateOverallStatus(responses: InspectionResponse[]): InspectionStatus {
    if (responses.length === 0) return 'fair';

    const statusCounts = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0
    };

    responses.forEach(response => {
      if (typeof response.value === 'string') {
        const status = response.value as InspectionStatus;
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      }
    });

    // Priority: critical > poor > fair > good > excellent
    if (statusCounts.critical > 0) return 'critical';
    if (statusCounts.poor > 1) return 'poor';
    if (statusCounts.fair > 2) return 'fair';
    if (statusCounts.good > statusCounts.excellent) return 'good';
    return 'excellent';
  }

  static validateResponses(template: InspectionTemplate, responses: InspectionResponse[]): string[] {
    const errors: string[] = [];
    const requiredFields = template.fields.filter(field => field.required);
    
    requiredFields.forEach(field => {
      const response = responses.find(r => r.fieldId === field.id);
      if (!response || !response.value) {
        errors.push(`${field.name} is required`);
      }
    });

    responses.forEach(response => {
      const field = template.fields.find(f => f.id === response.fieldId);
      if (field) {
        if (field.type === 'radio' || field.type === 'select') {
          if (field.options && !field.options.includes(response.value as string)) {
            errors.push(`Invalid option for ${field.name}`);
          }
        }
      }
    });

    return errors;
  }

  static getStatusColor(status: InspectionStatus): string {
    const colors = {
      excellent: '#10B981', // green
      good: '#3B82F6',     // blue
      fair: '#F59E0B',     // yellow
      poor: '#EF4444',     // red
      critical: '#DC2626'  // dark red
    };
    return colors[status];
  }

  static getStatusLabel(status: InspectionStatus): string {
    const labels = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      critical: 'Critical'
    };
    return labels[status];
  }

  static getStatusIcon(status: InspectionStatus): string {
    const icons = {
      excellent: '✅',
      good: '👍',
      fair: '⚠️',
      poor: '❌',
      critical: '🚨'
    };
    return icons[status];
  }
}
