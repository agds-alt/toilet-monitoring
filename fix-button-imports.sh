#!/bin/bash
============================================
🚀 BUTTON IMPORT FIX SCRIPT
Fix { Button } imports to default Button imports
============================================
echo "🔥 Starting Button Import Fix..."
echo ""
Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
Counter
fixed=0
Find all .tsx and .ts files in src/
find src -type f $ -name "*.tsx" -o -name "*.ts" $ | while read file; do
if grep -q "import { Button } from" "$file"; then
Backup original
cp "$file" "$file.bak"
Replace: Handle spaces around { Button }
sed -i 's/import[[:space:]]*{[[:space:]]Button[[:space:]]}[[:space:]]*from/import Button from/g' "$file"
echo -e "${GREEN}✓${NC} Fixed: $file"
((fixed++))
fi
done
echo ""
echo -e "${GREEN}✅ Fixed $fixed files${NC}"
echo "Run 'npm run type-check' to verify."
Optional: Clean backups if no issues
find src -name "*.bak" -delete
