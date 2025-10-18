#!/bin/bash

# ============================================
# 🚀 IMPROVED BUTTON IMPORT FIX SCRIPT
# Fix { Button } imports to default Button imports
# Handles various spacing and quotes
# ============================================

echo "🔥 Starting Improved Button Import Fix..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
fixed=0
skipped=0

# Find all .tsx and .ts files in src/
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  # Better grep to detect with spaces
  if grep -Eq "import[[:space:]]+\{[[:space:]]*Button[[:space:]]*\}[[:space:]]*from" "$file"; then
    # Backup original
    cp "$file" "$file.bak"
    
    # Replace: Handle spaces around { Button }
    # This targets only solo { Button }, not { A, Button }
    sed -i 's/import[[:space:]]*\([[:space:]]*{[[:space:]]*Button[[:space:]]*}[\[:space:]]*\)from/import Button from/g' "$file"
    
    echo -e "${GREEN}✓${NC} Fixed: $file"
    ((fixed++))
  elif grep -q "import.*Button.*from" "$file"; then
    echo -e "${YELLOW}⚠️${NC} Skipped (complex import): $file"
    ((skipped++))
  fi
done

echo ""
echo -e "${GREEN}✅ Fixed $fixed files${NC}"
echo -e "${YELLOW}⚠️ Skipped $skipped files (check manually for multiple imports in {}) ${NC}"
echo "Run 'npm run type-check' to verify."
echo "If issues persist, share output of: grep -r 'import.*Button.*from' src --include='*.tsx' --include='*.ts'"

# Optional: Clean backups if no issues
# find src -name "*.bak" -delete

### Cara Pakai (Sama seperti sebelumnya):
1. Simpan sebagai `fix-button-imports-improved.sh`.
2. Jalankan: `bash fix-button-imports-improved.sh`.
3. Ini sekarang skip file dengan import kompleks (misalnya { Other, Button }) dan beri tahu kamu.
4. Setelah run, cek type-check lagi.
5. Jika masih error, jalankan grep yang disarankan untuk lihat import yang tersisa dan fix manual.
