// Value Object: LocationCode
export class LocationCode {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid location code format');
    }
  }

  static create(code: string): LocationCode {
    return new LocationCode(code);
  }

  static generate(prefix: string = 'TOILET'): LocationCode {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return new LocationCode(`${prefix}-${timestamp}-${random}`);
  }

  private isValid(code: string): boolean {
    // Format: TOILET-123456-ABC or custom format
    const pattern = /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/;
    return pattern.test(code) && code.length >= 8 && code.length <= 20;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: LocationCode): boolean {
    return this.value === other.value;
  }
}
