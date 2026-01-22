# TMC Sauerland - Ziel-Tracking System

Professionelles Ziel-Tracking-System für TMC Sauerland GmbH mit Node.js Backend und SQLite Datenbank.

## 🚀 Features

- ✅ **Sichere Authentifizierung** mit verschlüsselten Passwörtern
- ✅ **Zentrale Datenbank** (SQLite) - alle Daten auf dem Server gespeichert
- ✅ **Echtzeitstatistiken** für alle 4 Bereiche
- ✅ **Admin-Dashboard** zur Verwaltung aller Mitarbeiter
- ✅ **Automatische Backups** möglich
- ✅ **Von überall zugreifbar** (bei Deployment)

## 📋 Voraussetzungen

- Node.js (Version 16 oder höher)
- npm (kommt mit Node.js)

## 🔧 Installation

### Schritt 1: Node.js installieren

**Windows:**
1. Gehen Sie zu https://nodejs.org/
2. Laden Sie die LTS-Version herunter
3. Führen Sie das Installationsprogramm aus

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Schritt 2: Projekt einrichten

1. Entpacken Sie alle Dateien in einen Ordner (z.B. `tmc-tracking-server`)

2. Öffnen Sie ein Terminal/Kommandozeile in diesem Ordner

3. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

### Schritt 3: Server starten

```bash
npm start
```

Der Server läuft jetzt auf: **http://localhost:3000**

Öffnen Sie diese URL im Browser und Sie sehen die Anwendung!

## 👥 Standard-Benutzer

### Admin:
- **Benutzername:** Admin
- **Passwort:** Vllahia222199859846!

### Mitarbeiter:
- **Manja** - Passwort: Pia2026!
- **Michael** - Passwort: Mario2026!
- **Aaron** - Passwort: Peugeot2026!

## 💾 Datenbank

Die Daten werden in der Datei `tmc-tracking.db` gespeichert. Diese Datei enthält:
- Alle Benutzer
- Alle Ziele
- Alle Abschlüsse

**Wichtig:** Erstellen Sie regelmäßig Backups dieser Datei!

## 🌐 Deployment (Internet-Zugriff)

Um die Anwendung im Internet verfügbar zu machen, gibt es mehrere Optionen:

### Option 1: Heroku (Kostenlos/Günstig)

1. Erstellen Sie ein Konto auf https://heroku.com
2. Installieren Sie die Heroku CLI
3. Im Projektordner:
```bash
heroku login
heroku create tmc-sauerland-tracking
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Option 2: DigitalOcean (Empfohlen für Produktion)

1. Erstellen Sie einen Droplet (ab 6€/Monat)
2. Installieren Sie Node.js auf dem Server
3. Laden Sie die Dateien hoch
4. Starten Sie den Server mit PM2:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Option 3: Railway.app (Einfach & Modern)

1. Gehen Sie zu https://railway.app
2. Verbinden Sie Ihr GitHub-Repository
3. Railway deployt automatisch
4. Kostenlos für kleine Projekte

## 🔐 Sicherheit

Für den Produktiveinsatz sollten Sie:

1. **Passwörter ändern** - Die Standard-Passwörter sind nur für den Test
2. **HTTPS aktivieren** - Verwenden Sie einen SSL-Zertifikat
3. **Umgebungsvariablen** - Speichern Sie Secrets nicht im Code
4. **Firewall** - Nur notwendige Ports öffnen
5. **Backups** - Automatische tägliche Backups der Datenbank

## 📂 Dateistruktur

```
tmc-tracking-server/
├── server.js              # Haupt-Server-Datei
├── package.json           # Projekt-Konfiguration
├── tmc-tracking.db        # SQLite Datenbank (wird automatisch erstellt)
├── public/
│   └── index.html        # Frontend-Anwendung
└── README.md             # Diese Datei
```

## 🛠️ Entwicklung

Für Entwicklung mit automatischem Neustart bei Änderungen:

```bash
npm run dev
```

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Logs im Terminal
2. Stellen Sie sicher, dass Port 3000 nicht bereits verwendet wird
3. Prüfen Sie, ob Node.js korrekt installiert ist: `node --version`

## 🔄 Updates

Um neue Features zu erhalten:
1. Ersetzen Sie die Dateien
2. Führen Sie `npm install` aus
3. Starten Sie den Server neu

## 📊 Datenbank-Backup

**Manuelles Backup:**
```bash
cp tmc-tracking.db tmc-tracking-backup-$(date +%Y%m%d).db
```

**Automatisches Backup (Linux/Mac):**
Fügen Sie zu crontab hinzu:
```bash
0 2 * * * cp /pfad/zu/tmc-tracking.db /pfad/zu/backups/tmc-tracking-$(date +\%Y\%m\%d).db
```

## ⚡ Performance

Die Anwendung kann problemlos:
- 100+ gleichzeitige Benutzer verwalten
- 10.000+ Einträge speichern
- Auf günstiger Hardware laufen

## 📱 Mobile

Die Anwendung ist vollständig responsive und funktioniert auf:
- Desktop-Computern
- Tablets
- Smartphones

---

**Entwickelt für TMC Sauerland GmbH** 🎯
Version 1.0 - Januar 2025
