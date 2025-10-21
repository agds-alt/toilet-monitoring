#!/bin/bash
# ============================================
# CLEANUP OLD ASSESSMENT SYSTEM
# ============================================

echo "🧹 Cleaning up old assessment system..."
echo ""

# ============================================
# 1. COMMENT OUT OLD ASSESSMENT FILES
# ============================================

echo "📝 Commenting out old assessment use cases..."

# Comment out CreateInspection.ts (old version)
if [ -f "src/core/use-cases/CreateInspection.ts" ]; then
  mv src/core/use-cases/CreateInspection.ts src/core/use-cases/CreateInspection.ts.OLD
  echo "✅ Renamed CreateInspection.ts to .OLD (use inspection system instead)"
fi

# Comment out SubmitAssessmentUseCase.ts
if [ -f "src/core/use-cases/SubmitAssessmentUseCase.ts" ]; then
  mv src/core/use-cases/SubmitAssessmentUseCase.ts src/core/use-cases/SubmitAssessmentUseCase.ts.OLD
  echo "✅ Renamed SubmitAssessmentUseCase.ts to .OLD"
fi

# Comment out ValidateAssessment.ts
if [ -f "src/core/use-cases/ValidateAssessment.ts" ]; then
  mv src/core/use-cases/ValidateAssessment.ts src/core/use-cases/ValidateAssessment.ts.OLD
  echo "✅ Renamed ValidateAssessment.ts to .OLD"
fi

# Comment out GetInspectionHistory.ts (old version)
if [ -f "src/core/use-cases/GetInspectionHistory.ts" ]; then
  mv src/core/use-cases/GetInspectionHistory.ts src/core/use-cases/GetInspectionHistory.ts.OLD
  echo "✅ Renamed GetInspectionHistory.ts to .OLD"
fi

# Comment out AssessmentRepository
if [ -f "src/infrastructure/database/repositories/AssessmentRepository.ts" ]; then
  mv src/infrastructure/database/repositories/AssessmentRepository.ts src/infrastructure/database/repositories/AssessmentRepository.ts.OLD
  echo "✅ Renamed AssessmentRepository.ts to .OLD"
fi

# Comment out old InspectionRepository
if [ -f "src/infrastructure/database/repositories/InspectionRepository.ts" ]; then
  mv src/infrastructure/database/repositories/InspectionRepository.ts src/infrastructure/database/repositories/InspectionRepository.ts.OLD
  echo "✅ Renamed old InspectionRepository.ts to .OLD (use inspection.service.ts instead)"
fi

# Comment out SupabaseInspectionRepository (old version)
if [ -f "src/infrastructure/database/repositories/SupabaseInspectionRepository.ts" ]; then
  mv src/infrastructure/database/repositories/SupabaseInspectionRepository.ts src/infrastructure/database/repositories/SupabaseInspectionRepository.ts.OLD
  echo "✅ Renamed SupabaseInspectionRepository.ts to .OLD (use inspection.service.ts instead)"
fi

echo ""
echo "============================================"
echo "📊 OLD SYSTEM CLEANUP SUMMARY"
echo "============================================"
echo ""
echo "✅ Old files renamed to .OLD (not deleted, just disabled)"
echo "✅ New inspection system ready to use!"
echo ""
echo "🎯 USE THESE INSTEAD:"
echo "- src/core/types/inspection.types.ts"
echo "- src/lib/constants/inspection.constants.ts"
echo "- src/lib/utils/validation.utils.ts"
echo "- src/infrastructure/services/inspection.service.ts"
echo "- src/presentation/hooks/useInspection.ts"
echo ""
echo "📁 OLD FILES (can be deleted after verification):"
find . -name "*.OLD" 2>/dev/null || echo "None"
echo ""
echo "============================================"
echo "🎉 Cleanup completed!"
echo "============================================"
