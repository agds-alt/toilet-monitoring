// src/lib/utils/type-helpers.ts
// ============================================
// TYPE CASTING HELPERS - Fix Json Type Issues
// ============================================

import type { Json } from '@/core/types/supabase.types';
import {
  InspectionComponent,
  ComponentResponse,
  InspectionTemplate,
  InspectionRecord,
} from '@/core/types/inspection.types';

// ============================================
// JSON TO TYPED OBJECT CONVERTERS
// ============================================

/**
 * Safely cast Json to InspectionComponent[]
 */
export function jsonToComponents(json: Json): InspectionComponent[] {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return [];
  }

  const obj = json as { components?: any[] };
  return (obj.components || []) as InspectionComponent[];
}

/**
 * Safely cast InspectionComponent[] to Json
 */
export function componentsToJson(components: InspectionComponent[]): Json {
  return { components } as unknown as Json;
}

/**
 * Safely cast Json to ComponentResponse Record
 */
export function jsonToResponses(json: Json): Record<string, ComponentResponse> {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return {};
  }

  return json as unknown as Record<string, ComponentResponse>;
}

/**
 * Safely cast ComponentResponse Record to Json
 */
export function responsesToJson(responses: Record<string, ComponentResponse>): Json {
  return responses as unknown as Json;
}

/**
 * Safely parse template fields from Json
 */
export function parseTemplateFields(json: Json): { components: InspectionComponent[] } {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { components: [] };
  }

  const obj = json as { components?: any[] };
  return {
    components: (obj.components || []) as InspectionComponent[],
  };
}

/**
 * Cast DB template to InspectionTemplate
 */
export function dbToInspectionTemplate(dbTemplate: any): InspectionTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description,
    estimatedTime: dbTemplate.estimated_time || 0, // camelCase - required
    estimated_time: dbTemplate.estimated_time,     // snake_case - optional
    is_active: dbTemplate.is_active,
    is_default: dbTemplate.is_default,
    fields: parseTemplateFields(dbTemplate.fields),
    created_by: dbTemplate.created_by,
    created_at: dbTemplate.created_at,
    updated_at: dbTemplate.updated_at,
  };
}

/**
 * Cast DB inspection to InspectionRecord
 */
export function dbToInspectionRecord(dbInspection: any): InspectionRecord {
  return {
    id: dbInspection.id,
    template_id: dbInspection.template_id,
    location_id: dbInspection.location_id,
    user_id: dbInspection.user_id,
    inspection_date: dbInspection.inspection_date,
    inspection_time: dbInspection.inspection_time,
    overall_status: dbInspection.overall_status,
    responses: jsonToResponses(dbInspection.responses),
    photo_urls: dbInspection.photo_urls || [],
    notes: dbInspection.notes,
    duration_seconds: dbInspection.duration_seconds,
    submitted_at: dbInspection.submitted_at,
    verified_by: dbInspection.verified_by,
    verified_at: dbInspection.verified_at,
    verification_notes: dbInspection.verification_notes,
  };
}

/**
 * Get components count from Json fields
 */
export function getComponentsCount(fields: Json): number {
  const parsed = parseTemplateFields(fields);
  return parsed.components.length;
}

/**
 * Check if Json fields has components
 */
export function hasComponents(fields: Json): boolean {
  return getComponentsCount(fields) > 0;
}

/**
 * Safe Json access
 */
export function safeJsonAccess<T>(json: Json, defaultValue: T): T {
  if (!json) return defaultValue;
  return json as unknown as T;
}
