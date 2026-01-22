#!/bin/bash

# TMC Sauerland - Automatisches Datenbank-Backup Script
# Dieses Script erstellt automatische Backups der SQLite Datenbank

# Konfiguration
DB_FILE="tmc-tracking.db"
BACKUP_DIR="backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/tmc-tracking_$DATE.db"

# Erstelle Backup-Verzeichnis falls nicht vorhanden
mkdir -p $BACKUP_DIR

# Prüfe ob Datenbank existiert
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Fehler: Datenbank $DB_FILE nicht gefunden!"
    exit 1
fi

# Erstelle Backup
echo "📦 Erstelle Backup..."
cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup erfolgreich erstellt: $BACKUP_FILE"
    
    # Zeige Größe
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Backup-Größe: $SIZE"
    
    # Lösche Backups älter als 30 Tage
    echo "🗑️  Lösche alte Backups (älter als 30 Tage)..."
    find $BACKUP_DIR -name "tmc-tracking_*.db" -type f -mtime +30 -delete
    
    # Zeige Anzahl der Backups
    BACKUP_COUNT=$(ls -1 $BACKUP_DIR/tmc-tracking_*.db 2>/dev/null | wc -l)
    echo "📁 Gesamt-Backups: $BACKUP_COUNT"
else
    echo "❌ Fehler beim Erstellen des Backups!"
    exit 1
fi

echo "✨ Backup-Vorgang abgeschlossen!"
