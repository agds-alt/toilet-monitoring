// src/infrastructure/database/repositories/AssessmentRepository.ts
import { supabase } from '../supabase';
import { AssessmentSubmission, Assessments } from '../../../core/types/assessment.types';

export class AssessmentRepository {
  async createInspection(submission: AssessmentSubmission & { overallScore: number }): Promise<string> {
    const { data, error } = await supabase
      .from('inspections')
      .insert({
        user_id: submission.userId,
        location_id: submission.locationId,
        status: submission.status,
        assessments: submission.assessments,
        overall_comment: submission.overallComment,
        overall_score: submission.overallScore, // Optional: tambah kolom ini
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Database insertion error:', error);
      throw new Error(`Gagal menyimpan assessment: ${error.message}`);
    }

    return data.id;
  }

  async getInspectionHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch history: ${error.message}`);
    return data;
  }
}