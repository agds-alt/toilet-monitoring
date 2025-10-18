// ===================================
// FIX 10: src/core/entities/Location.ts
// FIX imports
// REPLACE ENTIRE FILE
// ===================================

import { Location } from '@/core/types/interfaces';

export class LocationEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly floor?: number,
    public readonly section?: string
  ) {}

  static fromQRCode(qrCode: string, locations: Location[]): LocationEntity | null {
    const location = locations.find(
      (loc) => loc.code === qrCode || loc.name.toLowerCase().includes(qrCode.toLowerCase())
    );

    if (!location) return null;

    return new LocationEntity(
      location.id,
      location.name,
      location.code,
      location.floor,
      location.section
    );
  }

  getDisplayName(): string {
    if (this.floor) {
      return `${this.name} (Lt. ${this.floor})`;
    }
    return this.name;
  }

  generateQRCode(): string {
    return this.code;
  }
}
export interface LocationFormData {
  name: string;
  code: string;
  floor: number;
  section: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  floor: number;
  section: string;
  updated_at: string;
  created_at: string;
}