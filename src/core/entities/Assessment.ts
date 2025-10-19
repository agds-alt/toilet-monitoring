// src/core/entities/Assessment.ts
export interface AssessmentValue {
  value: number;
  notes: string;
  timestamp: string;
}

export interface Assessments {
  [category: string]: AssessmentValue;
}

export class AssessmentEntity {
  constructor(
    public readonly category: string,
    public value: number,
    public notes: string = '',
    public timestamp: Date = new Date()
  ) {}

  static create(category: string, value: number, notes?: string): AssessmentEntity {
    return new AssessmentEntity(category, value, notes || '');
  }

  updateValue(newValue: number): void {
    this.value = newValue;
    this.timestamp = new Date();
  }

  updateNotes(newNotes: string): void {
    this.notes = newNotes;
  }

  toJSON(): AssessmentValue {
    return {
      value: this.value,
      notes: this.notes,
      timestamp: this.timestamp.toISOString()
    };
  }

  static fromJSON(category: string, data: AssessmentValue): AssessmentEntity {
    return new AssessmentEntity(
      category,
      data.value,
      data.notes,
      new Date(data.timestamp)
    );
  }
}