#!/bin/bash

echo "🔍 FINAL AUTH VERIFICATION"
echo "=========================="
echo ""

# 1. Check Context files
echo "1️⃣ Context Files:"
ls -lah src/presentation/contexts/
echo ""

# 2. Check if AuthProvider.tsx exists (should NOT exist)
if [ -f "src/presentation/contexts/AuthProvider.tsx" ]; then
    echo "❌ PROBLEM: AuthProvider.tsx still exists (duplicate)"
    echo "   Run: rm src/presentation/contexts/AuthProvider.tsx"
else
    echo "✅ Good: No duplicate AuthProvider.tsx"
fi
echo ""

# 3. Check all imports
echo "3️⃣ All Auth Imports:"
grep -rn "from '@/presentation/contexts/AuthContext'" src/ | wc -l
echo "   files importing AuthContext"
echo ""

# 4. Check if old hooks/useAuth.ts exists (should NOT exist for clean arch)
if [ -f "src/presentation/hooks/useAuth.ts" ]; then
    echo "⚠️  WARNING: hooks/useAuth.ts exists"
    echo "   For pure Clean Arch, this should be deleted"
    echo "   Run: rm src/presentation/hooks/useAuth.ts"
else
    echo "✅ Good: No separate useAuth.ts hook"
fi
echo ""

# 5. Try build
echo "5️⃣ Testing Build..."
npm run build

echo ""
echo "=========================="
echo "✅ Verification Complete!"
