@echo off
REM TMC Sauerland - Automatisches Datenbank-Backup Script (Windows)

SET DB_FILE=tmc-tracking.db
SET BACKUP_DIR=backups
SET DATE_TIME=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
SET DATE_TIME=%DATE_TIME: =0%
SET BACKUP_FILE=%BACKUP_DIR%\tmc-tracking_%DATE_TIME%.db

echo.
echo ========================================
echo  TMC Sauerland - Datenbank Backup
echo ========================================
echo.

REM Erstelle Backup-Verzeichnis
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Pruefe ob Datenbank existiert
if not exist "%DB_FILE%" (
    echo [FEHLER] Datenbank %DB_FILE% nicht gefunden!
    pause
    exit /b 1
)

REM Erstelle Backup
echo [INFO] Erstelle Backup...
copy "%DB_FILE%" "%BACKUP_FILE%" >nul

if %ERRORLEVEL% EQU 0 (
    echo [OK] Backup erfolgreich erstellt!
    echo [INFO] Gespeichert als: %BACKUP_FILE%
    
    REM Loesche alte Backups (aelter als 30 Tage)
    echo [INFO] Loesche alte Backups...
    forfiles /P "%BACKUP_DIR%" /M tmc-tracking_*.db /D -30 /C "cmd /c del @path" 2>nul
    
    REM Zeige Anzahl der Backups
    for /f %%A in ('dir /b "%BACKUP_DIR%\tmc-tracking_*.db" 2^>nul ^| find /c /v ""') do set BACKUP_COUNT=%%A
    echo [INFO] Gesamt-Backups: %BACKUP_COUNT%
) else (
    echo [FEHLER] Backup konnte nicht erstellt werden!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Backup abgeschlossen!
echo ========================================
echo.
pause
