#!/bin/bash

# ============================================
# 🧹 CLEANUP OLD AUTH FILES
# Remove unnecessary/duplicate auth files
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          🧹 CLEANUP OLD AUTH FILES                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# ============================================
# SAFETY: CREATE BACKUP FIRST
# ============================================
echo -e "${BOLD}${CYAN}STEP 1: Creating safety backup...${NC}\n"

BACKUP_DIR="cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# List of files to check and backup
CLEANUP_FILES=(
    "src/presentation/components/layout/AuthProvider.tsx"
    "src/presentation/contexts/AuthContex.tsx"
    "src/presentation/hooks/useAuth.ts.backup"
    "src/app/layout.tsx.backup"
)

for file in "${CLEANUP_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo -e "${GREEN}✓${NC} Backed up: $file"
    fi
done

echo -e "\n${GREEN}✅ Backup created: $BACKUP_DIR${NC}\n"

# ============================================
# STEP 2: ANALYZE CURRENT STATE
# ============================================
echo -e "${BOLD}${CYAN}STEP 2: Analyzing current files...${NC}\n"

echo -e "${BOLD}Current Auth Files:${NC}"

# Check what we have
if [ -f "src/presentation/hooks/useAuth.ts" ]; then
    echo -e "${GREEN}✓${NC} src/presentation/hooks/useAuth.ts ${CYAN}(KEEP - Main hook)${NC}"
fi

if [ -f "src/presentation/contexts/AuthContext.tsx" ]; then
    echo -e "${GREEN}✓${NC} src/presentation/contexts/AuthContext.tsx ${CYAN}(KEEP - Main context)${NC}"
fi

echo ""
echo -e "${BOLD}Files to DELETE:${NC}"

FILES_TO_DELETE=()

if [ -f "src/presentation/components/layout/AuthProvider.tsx" ]; then
    echo -e "${RED}✗${NC} src/presentation/components/layout/AuthProvider.tsx ${YELLOW}(Duplicate wrapper)${NC}"
    FILES_TO_DELETE+=("src/presentation/components/layout/AuthProvider.tsx")
fi

if [ -f "src/presentation/contexts/AuthContex.tsx" ]; then
    echo -e "${RED}✗${NC} src/presentation/contexts/AuthContex.tsx ${YELLOW}(Typo version)${NC}"
    FILES_TO_DELETE+=("src/presentation/contexts/AuthContex.tsx")
fi

if [ -f "src/presentation/hooks/useAuth.ts.backup" ]; then
    echo -e "${RED}✗${NC} src/presentation/hooks/useAuth.ts.backup ${YELLOW}(Old backup)${NC}"
    FILES_TO_DELETE+=("src/presentation/hooks/useAuth.ts.backup")
fi

if [ -f "src/app/layout.tsx.backup" ]; then
    echo -e "${RED}✗${NC} src/app/layout.tsx.backup ${YELLOW}(Old backup)${NC}"
    FILES_TO_DELETE+=("src/app/layout.tsx.backup")
fi

# Check for any .OLD files
OLD_FILES=$(find src/presentation -name "*.OLD.*" 2>/dev/null || true)
if [ ! -z "$OLD_FILES" ]; then
    echo "$OLD_FILES" | while read file; do
        echo -e "${RED}✗${NC} $file ${YELLOW}(Old backup)${NC}"
        FILES_TO_DELETE+=("$file")
    done
fi

if [ ${#FILES_TO_DELETE[@]} -eq 0 ]; then
    echo -e "${GREEN}No files to delete! Already clean! ✨${NC}\n"
    exit 0
fi

echo ""

# ============================================
# STEP 3: CONFIRM DELETION
# ============================================
echo -e "${BOLD}${YELLOW}⚠️  WARNING: About to delete ${#FILES_TO_DELETE[@]} file(s)${NC}\n"

echo -e "${BOLD}Files will be deleted:${NC}"
for file in "${FILES_TO_DELETE[@]}"; do
    echo -e "  - $file"
done
echo ""

echo -e "${CYAN}Backup location: $BACKUP_DIR${NC}"
echo ""

read -p "$(echo -e ${YELLOW}Continue with deletion? [y/N]: ${NC})" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deletion cancelled.${NC}"
    echo -e "${GREEN}Backup preserved: $BACKUP_DIR${NC}\n"
    exit 0
fi

# ============================================
# STEP 4: DELETE FILES
# ============================================
echo ""
echo -e "${BOLD}${CYAN}STEP 3: Deleting old files...${NC}\n"

DELETED_COUNT=0
FAILED_COUNT=0

for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        if rm "$file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Deleted: $file"
            DELETED_COUNT=$((DELETED_COUNT + 1))
        else
            echo -e "${RED}✗${NC} Failed to delete: $file"
            FAILED_COUNT=$((FAILED_COUNT + 1))
        fi
    fi
done

echo ""

# ============================================
# STEP 5: VERIFY REMAINING FILES
# ============================================
echo -e "${BOLD}${CYAN}STEP 4: Verifying remaining auth files...${NC}\n"

REQUIRED_FILES=(
    "src/presentation/hooks/useAuth.ts"
    "src/presentation/contexts/AuthContext.tsx"
    "src/core/repositories/IAuthRepository.ts"
    "src/core/use-cases/GetCurrentUserUseCase.ts"
    "src/infrastructure/auth/SupabaseAuthRepository.ts"
)

MISSING=0

echo -e "${BOLD}Required Clean Arch files:${NC}"
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file ${YELLOW}(MISSING!)${NC}"
        MISSING=$((MISSING + 1))
    fi
done

echo ""

# ============================================
# STEP 6: CHECK IMPORTS
# ============================================
echo -e "${BOLD}${CYAN}STEP 5: Checking import statements...${NC}\n"

echo -e "${BOLD}Checking for old imports...${NC}"

BAD_IMPORTS=0

# Check for old AuthProvider import
if grep -r "from '@/presentation/components/layout/AuthProvider'" src/ 2>/dev/null | grep -v ".backup" | grep -v "$BACKUP_DIR"; then
    echo -e "${RED}✗${NC} Found old AuthProvider imports (needs update!)"
    BAD_IMPORTS=$((BAD_IMPORTS + 1))
else
    echo -e "${GREEN}✓${NC} No old AuthProvider imports"
fi

# Check for typo imports
if grep -r "from '@/presentation/contexts/AuthContex'" src/ 2>/dev/null | grep -v ".backup" | grep -v "$BACKUP_DIR"; then
    echo -e "${RED}✗${NC} Found typo AuthContex imports (needs update!)"
    BAD_IMPORTS=$((BAD_IMPORTS + 1))
else
    echo -e "${GREEN}✓${NC} No typo imports"
fi

echo ""

# ============================================
# FINAL REPORT
# ============================================
echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    CLEANUP REPORT                         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

if [ $FAILED_COUNT -eq 0 ] && [ $MISSING -eq 0 ] && [ $BAD_IMPORTS -eq 0 ]; then
    echo -e "${BOLD}${GREEN}✅ CLEANUP SUCCESSFUL!${NC}\n"
    
    echo -e "${GREEN}Summary:${NC}"
    echo -e "  • Files deleted: ${GREEN}$DELETED_COUNT${NC}"
    echo -e "  • Backup location: ${CYAN}$BACKUP_DIR${NC}"
    echo -e "  • All required files present: ${GREEN}✓${NC}"
    echo -e "  • No bad imports found: ${GREEN}✓${NC}"
    echo ""
    
    echo -e "${BOLD}Your Clean Architecture Auth is now clean! 🎉${NC}\n"
    
    echo -e "${BOLD}File Structure:${NC}"
    echo -e "${CYAN}Core Layer:${NC}"
    echo -e "  ✓ IAuthRepository.ts"
    echo -e "  ✓ GetCurrentUserUseCase.ts"
    echo ""
    echo -e "${CYAN}Infrastructure Layer:${NC}"
    echo -e "  ✓ SupabaseAuthRepository.ts"
    echo ""
    echo -e "${CYAN}Presentation Layer:${NC}"
    echo -e "  ✓ useAuth.ts (hook)"
    echo -e "  ✓ AuthContext.tsx (context)"
    echo ""
    
    echo -e "${BOLD}Next Steps:${NC}"
    echo -e "1. Run: ${YELLOW}npm run build${NC}"
    echo -e "2. Test: ${YELLOW}npm run dev${NC}"
    echo -e "3. If all OK, remove backup: ${YELLOW}rm -rf $BACKUP_DIR${NC}"
    echo ""
    
    exit 0
else
    echo -e "${BOLD}${YELLOW}⚠️  CLEANUP COMPLETED WITH WARNINGS${NC}\n"
    
    echo -e "${YELLOW}Summary:${NC}"
    echo -e "  • Files deleted: $DELETED_COUNT"
    if [ $FAILED_COUNT -gt 0 ]; then
        echo -e "  • Failed deletions: ${RED}$FAILED_COUNT${NC}"
    fi
    if [ $MISSING -gt 0 ]; then
        echo -e "  • Missing files: ${RED}$MISSING${NC}"
    fi
    if [ $BAD_IMPORTS -gt 0 ]; then
        echo -e "  • Bad imports found: ${RED}$BAD_IMPORTS${NC}"
    fi
    echo -e "  • Backup location: ${CYAN}$BACKUP_DIR${NC}"
    echo ""
    
    echo -e "${BOLD}Action Required:${NC}"
    if [ $MISSING -gt 0 ]; then
        echo -e "  ${RED}✗${NC} Create missing files (run clean arch setup)"
    fi
    if [ $BAD_IMPORTS -gt 0 ]; then
        echo -e "  ${RED}✗${NC} Update import statements in affected files"
        echo -e "     Change: ${RED}@/presentation/components/layout/AuthProvider${NC}"
        echo -e "     To:     ${GREEN}@/presentation/contexts/AuthContext${NC}"
    fi
    echo ""
    
    exit 1
fi
