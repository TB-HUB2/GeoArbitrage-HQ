#!/bin/bash
# ============================================================
# GeoArbitrage HQ — Backup Script
# Sichert n8n-Daten und PostgreSQL-Dump
#
# Einrichten als Cron (taeglich 03:00):
#   crontab -e
#   0 3 * * * /opt/geoarbitrage/backup.sh >> /opt/geoarbitrage/backup.log 2>&1
#
# Backup-Speicherort: /opt/geoarbitrage/backups/
# Retention: 7 Tage (aeltere werden automatisch geloescht)
# ============================================================
set -euo pipefail

BACKUP_DIR="/opt/geoarbitrage/backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_POSTGRES="geoarbitrage-postgres-1"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$DATE] Backup gestartet..."

# 1. PostgreSQL Dump (n8n-Datenbank)
echo "  [1/3] PostgreSQL Dump..."
docker exec "$CONTAINER_POSTGRES" pg_dump -U n8n n8n | gzip > "$BACKUP_DIR/n8n_db_${DATE}.sql.gz"
echo "  OK: n8n_db_${DATE}.sql.gz"

# 2. n8n Workflows exportieren
echo "  [2/3] n8n Workflows exportieren..."
docker exec geoarbitrage-n8n-1 n8n export:workflow --all --output=/tmp/workflows_backup.json 2>/dev/null
docker cp geoarbitrage-n8n-1:/tmp/workflows_backup.json "$BACKUP_DIR/workflows_${DATE}.json"
echo "  OK: workflows_${DATE}.json"

# 3. Alte Backups loeschen (> RETENTION_DAYS Tage)
echo "  [3/3] Alte Backups aufraeumen..."
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.json" -mtime +$RETENTION_DAYS -delete
echo "  OK: Backups aelter als $RETENTION_DAYS Tage entfernt"

echo "[$DATE] Backup abgeschlossen."
echo "  Speicherort: $BACKUP_DIR"
echo "  Dateien: n8n_db_${DATE}.sql.gz, workflows_${DATE}.json"
