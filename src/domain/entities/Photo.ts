// Domain Entity: Photo
export interface Photo {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  caption?: string;
  fieldReference?: string;
  locationId?: string;
  inspectionId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export class PhotoEntity implements Photo {
  constructor(
    public readonly id: string,
    public readonly fileUrl: string,
    public readonly fileName: string,
    public readonly fileSize: number,
    public readonly mimeType: string,
    public readonly caption: string | undefined,
    public readonly fieldReference: string | undefined,
    public readonly locationId: string | undefined,
    public readonly inspectionId: string | undefined,
    public readonly uploadedBy: string,
    public readonly uploadedAt: Date,
    public readonly isDeleted: boolean,
    public readonly deletedAt: Date | undefined,
    public readonly deletedBy: string | undefined
  ) {}

  static create(data: Omit<Photo, 'id' | 'uploadedAt' | 'isDeleted' | 'deletedAt' | 'deletedBy'>): PhotoEntity {
    return new PhotoEntity(
      crypto.randomUUID(),
      data.fileUrl,
      data.fileName,
      data.fileSize,
      data.mimeType,
      data.caption,
      data.fieldReference,
      data.locationId,
      data.inspectionId,
      data.uploadedBy,
      new Date(),
      false,
      undefined,
      undefined
    );
  }

  updateCaption(caption: string): PhotoEntity {
    return new PhotoEntity(
      this.id,
      this.fileUrl,
      this.fileName,
      this.fileSize,
      this.mimeType,
      caption,
      this.fieldReference,
      this.locationId,
      this.inspectionId,
      this.uploadedBy,
      this.uploadedAt,
      this.isDeleted,
      this.deletedAt,
      this.deletedBy
    );
  }

  delete(deletedBy: string): PhotoEntity {
    return new PhotoEntity(
      this.id,
      this.fileUrl,
      this.fileName,
      this.fileSize,
      this.mimeType,
      this.caption,
      this.fieldReference,
      this.locationId,
      this.inspectionId,
      this.uploadedBy,
      this.uploadedAt,
      true,
      new Date(),
      deletedBy
    );
  }

  getFileExtension(): string {
    return this.fileName.split('.').pop()?.toLowerCase() || '';
  }

  isImage(): boolean {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageTypes.includes(this.getFileExtension());
  }

  getFormattedFileSize(): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.fileSize === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
