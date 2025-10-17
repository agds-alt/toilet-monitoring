#!/bin/bash

# ===================================
# 🔍 ENHANCED CHECKER + BUILD TEST
# ===================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🚽 TOILET MONITORING - ENHANCED CHECKER 🔍           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# ===================================
# PHASE 1: FILE STRUCTURE CHECK
# ===================================
echo -e "${BOLD}${CYAN}PHASE 1: File Structure Check${NC}\n"

check_critical_files() {
    local critical_files=(
        "package.json"
        "next.config.js"
        "tsconfig.json"
        ".env.local"
        "src/app/layout.tsx"
        "src/middleware.ts"
    )
    
    local all_present=true
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✓${NC} $file"
        else
            echo -e "${RED}✗${NC} $file ${YELLOW}(CRITICAL - MISSING!)${NC}"
            all_present=false
        fi
    done
    
    if [ "$all_present" = true ]; then
        echo -e "\n${GREEN}✅ All critical files present${NC}\n"
        return 0
    else
        echo -e "\n${RED}❌ Missing critical files! Project won't work.${NC}\n"
        return 1
    fi
}

check_critical_files || exit 1

# ===================================
# PHASE 2: FOLDER STRUCTURE CHECK
# ===================================
echo -e "${BOLD}${CYAN}PHASE 2: Folder Structure Check${NC}\n"

check_folders() {
    local folders=(
        "src/app"
        "src/core/entities"
        "src/core/use-cases"
        "src/core/repositories"
        "src/core/types"
        "src/infrastructure/database"
        "src/infrastructure/storage"
        "src/infrastructure/auth"
        "src/presentation/components/ui"
        "src/presentation/components/features"
        "src/presentation/hooks"
        "src/presentation/styles"
        "src/lib/constants"
        "src/lib/utils"
        "src/types"
    )
    
    local all_present=true
    
    for folder in "${folders[@]}"; do
        if [ -d "$folder" ]; then
            file_count=$(find "$folder" -type f 2>/dev/null | wc -l | tr -d ' ')
            echo -e "${GREEN}✓${NC} $folder ${CYAN}($file_count files)${NC}"
        else
            echo -e "${RED}✗${NC} $folder ${YELLOW}(MISSING!)${NC}"
            all_present=false
        fi
    done
    
    if [ "$all_present" = true ]; then
        echo -e "\n${GREEN}✅ Folder structure correct${NC}\n"
        return 0
    else
        echo -e "\n${RED}❌ Missing folders!${NC}\n"
        return 1
    fi
}

check_folders

# ===================================
# PHASE 3: DEPENDENCY CHECK
# ===================================
echo -e "${BOLD}${CYAN}PHASE 3: Dependencies Check${NC}\n"

check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  node_modules not found${NC}"
        echo -e "${CYAN}Run: npm install${NC}\n"
        return 1
    fi
    
    local required_deps=(
        "next"
        "@supabase/supabase-js"
        "html5-qrcode"
        "typescript"
    )
    
    local all_present=true
    
    for dep in "${required_deps[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "${GREEN}✓${NC} $dep"
        else
            echo -e "${RED}✗${NC} $dep ${YELLOW}(NOT INSTALLED!)${NC}"
            all_present=false
        fi
    done
    
    if [ "$all_present" = true ]; then
        echo -e "\n${GREEN}✅ All dependencies installed${NC}\n"
        return 0
    else
        echo -e "\n${RED}❌ Missing dependencies!${NC}"
        echo -e "${CYAN}Run: npm install${NC}\n"
        return 1
    fi
}

check_dependencies

# ===================================
# PHASE 4: ENVIRONMENT CHECK
# ===================================
echo -e "${BOLD}${CYAN}PHASE 4: Environment Variables Check${NC}\n"

check_env() {
    if [ ! -f ".env.local" ]; then
        echo -e "${RED}✗${NC} .env.local ${YELLOW}(MISSING!)${NC}"
        echo -e "${YELLOW}⚠️  Create .env.local and add your credentials${NC}\n"
        return 1
    fi
    
    local required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    )
    
    local all_present=true
    
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.local 2>/dev/null; then
            value=$(grep "^$var=" .env.local | cut -d '=' -f 2-)
            if [ -n "$value" ] && [ "$value" != "your-" ] && [ "$value" != "https://xxxxx" ]; then
                echo -e "${GREEN}✓${NC} $var"
            else
                echo -e "${YELLOW}⚠${NC} $var ${YELLOW}(SET but might be placeholder)${NC}"
                all_present=false
            fi
        else
            echo -e "${RED}✗${NC} $var ${YELLOW}(NOT SET!)${NC}"
            all_present=false
        fi
    done
    
    if [ "$all_present" = true ]; then
        echo -e "\n${GREEN}✅ Environment variables configured${NC}\n"
        return 0
    else
        echo -e "\n${YELLOW}⚠️  Some environment variables need configuration${NC}\n"
        return 1
    fi
}

check_env

# ===================================
# PHASE 5: FILE COUNT BY CATEGORY
# ===================================
echo -e "${BOLD}${CYAN}PHASE 5: File Count by Category${NC}\n"

count_files() {
    echo -e "${BOLD}Category${NC}                    ${BOLD}Expected${NC}  ${BOLD}Found${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    declare -A categories=(
        ["Config Files"]="."
        ["App Core"]="src/app"
        ["Core Entities"]="src/core/entities"
        ["Core Use Cases"]="src/core/use-cases"
        ["Core Repositories"]="src/core/repositories"
        ["Infrastructure"]="src/infrastructure"
        ["UI Components"]="src/presentation/components/ui"
        ["Features"]="src/presentation/components/features"
        ["Hooks"]="src/presentation/hooks"
        ["Utils"]="src/lib"
        ["Types"]="src/types"
    )
    
    for category in "${!categories[@]}"; do
        path="${categories[$category]}"
        if [ -d "$path" ]; then
            count=$(find "$path" -maxdepth 3 -type f -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
            printf "%-30s %8s  ${GREEN}%s${NC}\n" "$category" "─" "$count"
        else
            printf "%-30s %8s  ${RED}%s${NC}\n" "$category" "─" "0"
        fi
    done
    echo ""
}

count_files

# ===================================
# PHASE 6: TYPESCRIPT CHECK
# ===================================
echo -e "${BOLD}${CYAN}PHASE 6: TypeScript Check${NC}\n"

if command -v npm &> /dev/null; then
    if [ -d "node_modules" ]; then
        echo -e "${CYAN}Running TypeScript type check...${NC}\n"
        npm run type-check 2>&1 | tail -n 20
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            echo -e "\n${GREEN}✅ TypeScript check passed${NC}\n"
        else
            echo -e "\n${RED}❌ TypeScript errors found${NC}\n"
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping - dependencies not installed${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  npm not found - skipping type check${NC}\n"
fi

# ===================================
# PHASE 7: BUILD TEST
# ===================================
echo -e "${BOLD}${CYAN}PHASE 7: Build Test (Optional)${NC}\n"

read -p "Do you want to run build test? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "node_modules" ]; then
        echo -e "${CYAN}Running build...${NC}\n"
        npm run build 2>&1 | tail -n 30
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            echo -e "\n${GREEN}✅ Build successful${NC}\n"
        else
            echo -e "\n${RED}❌ Build failed${NC}\n"
        fi
    else
        echo -e "${YELLOW}⚠️  Dependencies not installed${NC}\n"
    fi
else
    echo -e "${YELLOW}Skipping build test${NC}\n"
fi

# ===================================
# FINAL SUMMARY
# ===================================
echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    🎯 FINAL SUMMARY                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BOLD}Checklist:${NC}"
echo -e "  $([[ -f "package.json" ]] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}") Critical files present"
echo -e "  $([[ -d "src/core" ]] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}") Folder structure correct"
echo -e "  $([[ -d "node_modules" ]] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}") Dependencies installed"
echo -e "  $([[ -f ".env.local" ]] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}") Environment configured"
echo -e ""

echo -e "${BOLD}${GREEN}Next Steps:${NC}"
echo -e "  1. ${CYAN}./deep-check.sh${NC}        - Run detailed file check"
echo -e "  2. ${CYAN}npm install${NC}            - Install dependencies (if not done)"
echo -e "  3. ${CYAN}npm run dev${NC}            - Start development server"
echo -e ""

echo -e "${BOLD}${BLUE}Good luck with your project! 🚀${NC}\n"
