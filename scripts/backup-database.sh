#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

echo "🔄 Creating database backup..."
supabase db dump --linked > $BACKUP_DIR/backup_$DATE.sql
echo "✅ Backup created: $BACKUP_DIR/backup_$DATE.sql"
