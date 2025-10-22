// Domain Entity: Location (Toilet Location)
export interface Location {
  id: string;
  name: string;
  code: string;
  qrCode: string;
  building?: string;
  floor?: string;
  area?: string;
  section?: string;
  description?: string;
  photoUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LocationEntity implements Location {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly qrCode: string,
    public readonly building: string | undefined,
    public readonly floor: string | undefined,
    public readonly area: string | undefined,
    public readonly section: string | undefined,
    public readonly description: string | undefined,
    public readonly photoUrl: string | undefined,
    public readonly coordinates: { lat: number; lng: number } | undefined,
    public readonly isActive: boolean,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: Omit<Location, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>): LocationEntity {
    const now = new Date();
    const qrCode = `toilet-${data.code}-${Date.now()}`;
    
    return new LocationEntity(
      crypto.randomUUID(),
      data.name,
      data.code,
      qrCode,
      data.building,
      data.floor,
      data.area,
      data.section,
      data.description,
      data.photoUrl,
      data.coordinates,
      data.isActive,
      data.createdBy,
      now,
      now
    );
  }

  updateDetails(updates: Partial<Pick<Location, 'name' | 'building' | 'floor' | 'area' | 'section' | 'description' | 'photoUrl' | 'coordinates'>>): LocationEntity {
    return new LocationEntity(
      this.id,
      updates.name ?? this.name,
      this.code,
      this.qrCode,
      updates.building ?? this.building,
      updates.floor ?? this.floor,
      updates.area ?? this.area,
      updates.section ?? this.section,
      updates.description ?? this.description,
      updates.photoUrl ?? this.photoUrl,
      updates.coordinates ?? this.coordinates,
      this.isActive,
      this.createdBy,
      this.createdAt,
      new Date()
    );
  }

  deactivate(): LocationEntity {
    return new LocationEntity(
      this.id,
      this.name,
      this.code,
      this.qrCode,
      this.building,
      this.floor,
      this.area,
      this.section,
      this.description,
      this.photoUrl,
      this.coordinates,
      false,
      this.createdBy,
      this.createdAt,
      new Date()
    );
  }

  getDisplayName(): string {
    const parts = [this.name];
    if (this.building) parts.push(`Gedung ${this.building}`);
    if (this.floor) parts.push(`Lantai ${this.floor}`);
    return parts.join(' - ');
  }
}
