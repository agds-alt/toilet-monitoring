#!/bin/bash
# ============================================
# Supabase Database Backup Script
# ============================================
# This script creates automated backups of your Supabase database
# Can be run manually or via cron/GitHub Actions

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups/database"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

echo -e "${GREEN}📦 Supabase Database Backup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if Supabase is running locally
if command -v supabase &> /dev/null; then
    echo -e "${YELLOW}🔍 Checking Supabase status...${NC}"

    # Try to get local database dump
    echo -e "${YELLOW}💾 Creating database dump...${NC}"
    supabase db dump -f "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Local Supabase not running, using remote...${NC}"

        # Use pg_dump with connection string
        if [ -n "$DATABASE_URL" ]; then
            pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"
        else
            echo -e "${RED}❌ DATABASE_URL not set!${NC}"
            exit 1
        fi
    }
else
    echo -e "${YELLOW}⚠️  Supabase CLI not installed${NC}"

    # Fallback to pg_dump
    if [ -n "$DATABASE_URL" ]; then
        pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"
    else
        echo -e "${RED}❌ DATABASE_URL not set!${NC}"
        exit 1
    fi
fi

# Compress backup
echo -e "${YELLOW}🗜️  Compressing backup...${NC}"
gzip "$BACKUP_DIR/$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get file size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}✅ Backup created successfully!${NC}"
echo "   File: $BACKUP_FILE"
echo "   Size: $BACKUP_SIZE"
echo "   Location: $BACKUP_DIR/$BACKUP_FILE"

# Clean up old backups
echo -e "${YELLOW}🧹 Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
echo -e "${GREEN}📊 Total backups: ${BACKUP_COUNT}${NC}"

# Create backup manifest
cat > "$BACKUP_DIR/latest_backup.json" <<EOF
{
  "timestamp": "$(date -Iseconds)",
  "filename": "$BACKUP_FILE",
  "size": "$BACKUP_SIZE",
  "retention_days": $RETENTION_DAYS,
  "total_backups": $BACKUP_COUNT
}
EOF

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
