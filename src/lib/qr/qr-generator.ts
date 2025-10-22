// QR Code Generator for Toilet Locations
export interface LocationQRData {
  locationId: string;
  locationName: string;
  locationCode: string;
  building?: string;
  floor?: string;
}

export class QRCodeGenerator {
  static generateQRData(location: LocationQRData): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://toilet-checklist.com';
    return `${baseUrl}/scan/${location.locationCode}`;
  }

  static generateQRCode(location: LocationQRData): {
    data: string;
    url: string;
    displayName: string;
  } {
    const data = this.generateQRData(location);
    const url = data;
    const displayName = location.building && location.floor 
      ? `${location.locationName} - ${location.building} Lantai ${location.floor}`
      : location.locationName;

    return {
      data,
      url,
      displayName
    };
  }

  static generateBulkQRCodes(locations: LocationQRData[]): Array<{
    location: LocationQRData;
    qrData: string;
    url: string;
    displayName: string;
  }> {
    return locations.map(location => ({
      location,
      ...this.generateQRCode(location)
    }));
  }

  static validateLocationCode(code: string): boolean {
    // Format: TOILET-XXXXXX-XXX
    const pattern = /^TOILET-\d{6}-[A-Z]{3}$/;
    return pattern.test(code);
  }

  static generateLocationCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TOILET-${timestamp}-${random}`;
  }
}
