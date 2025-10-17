#!/bin/bash

# ============================================
# PRE-MIGRATION SAFETY CHECKER
# Run this BEFORE migration to check safety
# ============================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          🛡️  PRE-MIGRATION SAFETY CHECK                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

ERRORS=0
WARNINGS=0

# ============================================
# CHECK 1: Git Status
# ============================================
echo -e "${BOLD}CHECK 1: Git Status${NC}"

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git repository detected"
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠${NC}  Uncommitted changes detected!"
        echo -e "   ${YELLOW}RECOMMENDATION: Commit or stash changes first${NC}"
        WARNINGS=$((WARNINGS + 1))
        
        echo ""
        echo "Uncommitted files:"
        git status -s
        echo ""
    else
        echo -e "${GREEN}✓${NC} Working directory clean"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${GREEN}✓${NC} Current branch: ${CYAN}$CURRENT_BRANCH${NC}"
    
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
        echo -e "${YELLOW}⚠${NC}  Working on main/master branch"
        echo -e "   ${YELLOW}RECOMMENDATION: Create feature branch first${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} Not a git repository"
    echo -e "   ${RED}CRITICAL: Initialize git first!${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# CHECK 2: Current Auth Files
# ============================================
echo -e "${BOLD}CHECK 2: Current Auth Implementation${NC}"

AUTH_FILES_FOUND=0

if [ -f "src/presentation/hooks/useAuth.ts" ]; then
    echo -e "${GREEN}✓${NC} useAuth.ts exists"
    AUTH_FILES_FOUND=$((AUTH_FILES_FOUND + 1))
fi

if [ -f "src/presentation/contexts/AuthContext.tsx" ]; then
    echo -e "${GREEN}✓${NC} AuthContext.tsx exists"
    AUTH_FILES_FOUND=$((AUTH_FILES_FOUND + 1))
fi

if [ -f "src/presentation/contexts/AuthContex.tsx" ]; then
    echo -e "${YELLOW}⚠${NC}  AuthContex.tsx (typo) exists - will be fixed"
    AUTH_FILES_FOUND=$((AUTH_FILES_FOUND + 1))
fi

if [ $AUTH_FILES_FOUND -eq 0 ]; then
    echo -e "${RED}✗${NC} No auth files found!"
    echo -e "   ${RED}Migration might not work correctly${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# CHECK 3: Dependencies
# ============================================
echo -e "${BOLD}CHECK 3: Dependencies${NC}"

if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
    
    # Check critical dependencies
    if grep -q "@supabase/supabase-js" package.json; then
        echo -e "${GREEN}✓${NC} Supabase client installed"
    else
        echo -e "${RED}✗${NC} Supabase client NOT installed"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "next" package.json; then
        echo -e "${GREEN}✓${NC} Next.js installed"
    else
        echo -e "${RED}✗${NC} Next.js NOT installed"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} package.json NOT found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# CHECK 4: Current Build
# ============================================
echo -e "${BOLD}CHECK 4: Current Build Status${NC}"

if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} .next directory exists (app was built before)"
else
    echo -e "${YELLOW}⚠${NC}  No .next directory (app never built)"
    WARNINGS=$((WARNINGS + 1))
fi

echo -e "${BLUE}→${NC} Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Current code builds successfully"
else
    echo -e "${RED}✗${NC} Current code has build errors"
    echo -e "   ${RED}FIX BUILD ERRORS BEFORE MIGRATION!${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# CHECK 5: File Conflicts
# ============================================
echo -e "${BOLD}CHECK 5: Potential File Conflicts${NC}"

CONFLICTS=0

if [ -f "src/core/repositories/IAuthRepository.ts" ]; then
    echo -e "${YELLOW}⚠${NC}  IAuthRepository.ts already exists"
    CONFLICTS=$((CONFLICTS + 1))
fi

if [ -f "src/core/use-cases/GetCurrentUserUseCase.ts" ]; then
    echo -e "${YELLOW}⚠${NC}  GetCurrentUserUseCase.ts already exists"
    CONFLICTS=$((CONFLICTS + 1))
fi

if [ -f "src/infrastructure/auth/SupabaseAuthRepository.ts" ]; then
    echo -e "${YELLOW}⚠${NC}  SupabaseAuthRepository.ts already exists"
    CONFLICTS=$((CONFLICTS + 1))
fi

if [ $CONFLICTS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No file conflicts"
else
    echo -e "${YELLOW}⚠${NC}  $CONFLICTS files will be overwritten"
    echo -e "   ${YELLOW}Existing files will be backed up${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# CHECK 6: Directory Structure
# ============================================
echo -e "${BOLD}CHECK 6: Directory Structure${NC}"

REQUIRED_DIRS=(
    "src/core/entities"
    "src/core/repositories"
    "src/infrastructure/database"
    "src/presentation/hooks"
    "src/presentation/contexts"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir"
    else
        echo -e "${YELLOW}⚠${NC}  $dir (will be created)"
    fi
done

echo ""

# ============================================
# CHECK 7: Environment Variables
# ============================================
echo -e "${BOLD}CHECK 7: Environment Variables${NC}"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} SUPABASE_URL configured"
    else
        echo -e "${RED}✗${NC} SUPABASE_URL missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} SUPABASE_ANON_KEY configured"
    else
        echo -e "${RED}✗${NC} SUPABASE_ANON_KEY missing"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} .env.local NOT found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# CHECK 8: Disk Space
# ============================================
echo -e "${BOLD}CHECK 8: Disk Space${NC}"

AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✓${NC} Available space: $AVAILABLE_SPACE"

echo ""

# ============================================
# FINAL REPORT
# ============================================
echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    FINAL REPORT                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${BOLD}${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}Your project is ready for migration!${NC}\n"
    
    echo -e "${BOLD}Next Steps:${NC}"
    echo -e "1. Create feature branch: ${YELLOW}git checkout -b feature/clean-arch-auth${NC}"
    echo -e "2. Run migration: ${YELLOW}./auto-setup-clean-auth.sh${NC}"
    echo -e "3. Test thoroughly: ${YELLOW}npm run dev${NC}"
    echo -e "4. Build for production: ${YELLOW}npm run build${NC}"
    echo ""
    
    exit 0
elif [ $ERRORS -eq 0 ] && [ $WARNINGS -gt 0 ]; then
    echo -e "${BOLD}${YELLOW}⚠️  $WARNINGS WARNING(S) FOUND${NC}"
    echo -e "${YELLOW}Migration is safe but consider fixing warnings first${NC}\n"
    
    echo -e "${BOLD}Recommendations:${NC}"
    echo -e "1. Commit/stash uncommitted changes"
    echo -e "2. Create feature branch if on main/master"
    echo -e "3. Then proceed with migration"
    echo ""
    
    exit 0
else
    echo -e "${BOLD}${RED}❌ $ERRORS CRITICAL ERROR(S) FOUND!${NC}"
    echo -e "${RED}Fix errors before proceeding with migration!${NC}\n"
    
    echo -e "${BOLD}Action Required:${NC}"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "✓ Git OK"
    else
        echo -e "${RED}✗ Initialize git repository${NC}"
    fi
    
    if [ -f "package.json" ]; then
        echo -e "✓ package.json OK"
    else
        echo -e "${RED}✗ Create package.json${NC}"
    fi
    
    if [ -f ".env.local" ]; then
        echo -e "✓ .env.local OK"
    else
        echo -e "${RED}✗ Create .env.local with Supabase credentials${NC}"
    fi
    
    echo ""
    
    exit 1
fi
