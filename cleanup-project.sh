#!/bin/bash
# ============================================
# TOILET MONITORING - PROJECT CLEANUP SCRIPT
# Clean up duplicate files and organize structure
# ============================================

echo "🧹 TOILET MONITORING - PROJECT CLEANUP"
echo "======================================"
echo ""

# ============================================
# STEP 1: REMOVE DUPLICATE COMPONENTS
# ============================================
echo "📦 Step 1: Removing duplicate components..."

# Remove duplicate components (ada di /components dan /presentation/components)
rm -rf src/components/layout/
rm -rf src/components/ui/
# Keep src/components/inspection karena spesifik

echo "✅ Duplicate components removed"
echo ""

# ============================================
# STEP 2: CLEAN UP APP ROUTER
# ============================================
echo "📁 Step 2: Cleaning up app router..."

# Remove empty directories
find src/app -type d -empty -delete

# Create missing page.tsx files
touch src/app/register/page.tsx
touch src/app/settings/page.tsx
touch src/app/admin/calendar/page.tsx
touch src/app/inspection/success/page.tsx

echo "✅ App router cleaned"
echo ""

# ============================================
# STEP 3: REMOVE REDUNDANT FILES
# ============================================
echo "🗑️ Step 3: Removing redundant files..."

# Remove duplicate service files
rm -f src/services/supabase-auth-fix.tsx  # Should be in infrastructure/auth

# Remove duplicate types
# Keep only src/core/types/supabase.types.ts
rm -f src/types/supabase.types.ts
rm -f src/types/supabase.d.ts

echo "✅ Redundant files removed"
echo ""

# ============================================
# STEP 4: CREATE MISSING APP PAGES
# ============================================
echo "📝 Step 4: Creating missing app router pages..."

# Register page
cat > src/app/register/page.tsx << 'EOF'
'use client';
import SignupPage from '../../presentation/pages/SignupPage';
export default function Register() {
  return <SignupPage />;
}
EOF

# Settings page
cat > src/app/settings/page.tsx << 'EOF'
'use client';
import SettingsPage from '../../presentation/pages/SettingsPage';
export default function Settings() {
  return <SettingsPage />;
}
EOF

# Admin Calendar page
cat > src/app/admin/calendar/page.tsx << 'EOF'
'use client';
import AdminCalendarPage from '../../../presentation/pages/AdminCalendarPage';
export default function AdminCalendar() {
  return <AdminCalendarPage />;
}
EOF

# Inspection Success page
cat > src/app/inspection/success/page.tsx << 'EOF'
'use client';
import SuccessPage from '../../../presentation/pages/SuccessPage';
export default function InspectionSuccess() {
  return <SuccessPage />;
}
EOF

echo "✅ Missing pages created"
echo ""

# ============================================
# STEP 5: CREATE LOCATIONS PAGE
# ============================================
echo "🏢 Step 5: Creating locations management page..."

mkdir -p src/app/locations

cat > src/app/locations/page.tsx << 'EOF'
'use client';
import LocationPage from '../../presentation/pages/LocationPage';
export default function Locations() {
  return <LocationPage />;
}
EOF

echo "✅ Locations page created"
echo ""

# ============================================
# STEP 6: ORGANIZE STRUCTURE
# ============================================
echo "🏗️ Step 6: Final organization..."

# Move InspectionForm.tsx to proper location
if [ -f "src/app/inspection/InspectionForm.tsx" ]; then
  mv src/app/inspection/InspectionForm.tsx src/presentation/pages/InspectionFormPage.tsx
fi

# Create .gitkeep for empty but needed directories
touch src/application/interfaces/services/.gitkeep
touch src/domain/value-objects/.gitkeep

echo "✅ Structure organized"
echo ""

# ============================================
# SUMMARY
# ============================================
echo "======================================"
echo "✅ CLEANUP COMPLETED!"
echo ""
echo "📊 Summary of changes:"
echo "  - Removed duplicate component folders"
echo "  - Created missing page.tsx files"
echo "  - Removed redundant service files"
echo "  - Consolidated type definitions"
echo "  - Created locations management page"
echo ""
echo "🎯 Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Test all routes"
echo "  3. Commit changes"
echo "======================================"
