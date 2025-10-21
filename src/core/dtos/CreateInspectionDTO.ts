// src/core/dtos/CreateInspectionDTO.ts
// COMPLETE VERSION - Copy paste semua!

export interface CreateInspectionDTO {
  userId: string;
  locationId: string;
  status: 'all_good' | 'need_attention' | 'critical';
  assessments: {
    cleanliness: number;
    supplies: number;
    functionality: number;
    odor: number;
  };
  overallComment?: string;
  photoData?: {
    base64: string;
    metadata: {
      locationId: string;
      userId: string;
      timestamp: string;
      gps?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
      };
    };
  };
  geoData?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface InspectionData {
  id: string;
  user_id: string;
  location_id: string;
  status: string;
  assessments: any;
  overall_comment?: string;
  photo_url?: string;
  photo_metadata?: any;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export function mapToInspectionData(
  inspectionData: CreateInspectionDTO & {
    id: string;
    created_at: string;
    photoUrl?: string;
    photoMetadata?: any;
  }
): InspectionData {
  return {
    id: inspectionData.id,
    user_id: inspectionData.userId,
    location_id: inspectionData.locationId,
    status: inspectionData.status,
    assessments: inspectionData.assessments,
    overall_comment: inspectionData.overallComment,
    photo_url: inspectionData.photoUrl,
    photo_metadata: inspectionData.photoMetadata,
    latitude: inspectionData.geoData?.latitude,
    longitude: inspectionData.geoData?.longitude,
    created_at: inspectionData.created_at,
  };
}
