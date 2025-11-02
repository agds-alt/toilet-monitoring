#!/bin/bash
# ============================================
# Supabase Database Restore Script
# ============================================
# This script restores a database backup
# Usage: ./restore-database.sh [backup_file]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="./backups/database"
BACKUP_FILE=$1

echo -e "${GREEN}🔄 Supabase Database Restore${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# If no backup file specified, list available backups
if [ -z "$BACKUP_FILE" ]; then
    echo -e "${YELLOW}📋 Available backups:${NC}"
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || {
        echo -e "${RED}❌ No backups found in $BACKUP_DIR${NC}"
        exit 1
    }
    echo ""
    echo -e "${YELLOW}Usage: $0 <backup_file>${NC}"
    echo "Example: $0 backup_20240101_120000.sql.gz"
    exit 0
fi

# Check if backup file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_DIR/$BACKUP_FILE${NC}"
    exit 1
fi

# Warning
echo -e "${RED}⚠️  WARNING: This will REPLACE your current database!${NC}"
echo -e "${YELLOW}Backup file: $BACKUP_FILE${NC}"
read -p "Are you sure you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

# Decompress backup
echo -e "${YELLOW}📦 Decompressing backup...${NC}"
TEMP_FILE="/tmp/restore_$(date +%s).sql"
gunzip -c "$BACKUP_DIR/$BACKUP_FILE" > "$TEMP_FILE"

# Restore database
echo -e "${YELLOW}🔄 Restoring database...${NC}"

if command -v supabase &> /dev/null; then
    # Use Supabase CLI
    supabase db reset
    psql "$DATABASE_URL" < "$TEMP_FILE" 2>/dev/null || {
        # Fallback to direct psql
        if [ -n "$DATABASE_URL" ]; then
            psql "$DATABASE_URL" < "$TEMP_FILE"
        else
            echo -e "${RED}❌ DATABASE_URL not set!${NC}"
            rm "$TEMP_FILE"
            exit 1
        fi
    }
else
    # Use pg_restore or psql
    if [ -n "$DATABASE_URL" ]; then
        psql "$DATABASE_URL" < "$TEMP_FILE"
    else
        echo -e "${RED}❌ DATABASE_URL not set!${NC}"
        rm "$TEMP_FILE"
        exit 1
    fi
fi

# Clean up temp file
rm "$TEMP_FILE"

echo -e "${GREEN}✅ Database restored successfully!${NC}"
echo -e "${YELLOW}⚠️  Remember to verify your data and application functionality${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
