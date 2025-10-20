// src/core/types/database.types.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          phone: string | null;
          profile_photo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      
      roles: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          level: 'super_admin' | 'admin' | 'user';
          description: string | null;
          color: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };

      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
      };

      locations: {
        Row: {
          id: string;
          name: string;
          area: string | null;
          floor: string | null;
          building: string | null;
          qr_code: string;
          description: string | null;
          photo_url: string | null;
          coordinates: { lat: number; lng: number } | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };

      inspection_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          estimated_time: number | null;
          is_active: boolean;
          is_default: boolean;
          fields: TemplateField[];
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };

      inspection_records: {
        Row: {
          id: string;
          template_id: string;
          location_id: string;
          user_id: string;
          inspection_date: string;
          inspection_time: string;
          overall_status: 'Clean' | 'Needs Work' | 'Dirty';
          responses: Record<string, any>;
          photo_urls: string[];
          notes: string | null;
          duration_seconds: number | null;
          submitted_at: string;
          verified_by: string | null;
          verified_at: string | null;
          verification_notes: string | null;
        };
      };

      photos: {
        Row: {
          id: string;
          inspection_id: string | null;
          location_id: string | null;
          file_url: string;
          file_name: string | null;
          file_size: number | null;
          mime_type: string | null;
          caption: string | null;
          field_reference: string | null;
          uploaded_by: string | null;
          uploaded_at: string;
          is_deleted: boolean;
          deleted_by: string | null;
          deleted_at: string | null;
        };
      };
    };
  };
}

export interface TemplateField {
  id: string;
  field_name: string;
  field_type: 'radio' | 'checkbox' | 'text' | 'rating' | 'photo' | 'datetime';
  label: string;
  options?: string[];
  max_photos?: number;
  required: boolean;
  order: number;
}