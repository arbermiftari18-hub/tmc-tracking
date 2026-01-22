# 🚀 Schnellstart-Anleitung

## Lokal starten (auf Ihrem Computer)

1. **Node.js installieren**
   - Windows/Mac: https://nodejs.org/ → LTS Version herunterladen
   - Installationsprogramm ausführen

2. **Terminal öffnen** in diesem Ordner

3. **Abhängigkeiten installieren:**
   ```
   npm install
   ```

4. **Server starten:**
   ```
   npm start
   ```

5. **Browser öffnen:**
   http://localhost:3000

6. **Anmelden als Admin:**
   - Benutzername: Admin
   - Passwort: Vllahia222199859846!

✅ **Fertig!** Die Anwendung läuft jetzt lokal.

---

## Im Internet verfügbar machen

### Option 1: Railway.app (EMPFOHLEN - Am einfachsten)

1. Gehen Sie zu https://railway.app
2. Klicken Sie auf "Start a New Project"
3. Wählen Sie "Deploy from GitHub"
4. Verbinden Sie Ihr GitHub-Repository
5. Railway deployt automatisch
6. Sie erhalten eine URL wie: `https://tmc-tracking.railway.app`

**Vorteile:**
- ✅ Kostenlos für kleine Projekte
- ✅ Automatische Updates
- ✅ SSL-Zertifikat inklusive
- ✅ Kein Server-Management nötig

### Option 2: Render.com (Auch gut)

1. Gehen Sie zu https://render.com
2. Erstellen Sie einen Account
3. "New Web Service" → GitHub verbinden
4. Projekt auswählen
5. Render deployt automatisch

**Kosten:** Kostenlos (mit Einschränkungen) oder ab $7/Monat

### Option 3: DigitalOcean (Für mehr Kontrolle)

**Kosten:** Ab 6€/Monat

1. Erstellen Sie einen Droplet auf https://digitalocean.com
2. Wählen Sie Ubuntu 22.04
3. SSH-Zugang einrichten
4. Dateien hochladen und Server starten

**Detaillierte Anleitung:** Siehe README.md

---

## 💡 Wichtige Hinweise

### Für lokale Nutzung (nur im Büro):
- ✅ Einfach `npm start` ausführen
- ✅ Alle Mitarbeiter im gleichen Netzwerk können zugreifen
- ✅ Keine Internetverbindung nötig (außer für Installation)
- ⚠️ Computer muss laufen, damit andere zugreifen können

### Für Internet-Zugriff (von überall):
- ✅ Mitarbeiter können von zu Hause arbeiten
- ✅ Daten sind zentral gespeichert
- ✅ Automatische Backups möglich
- ⚠️ Hosting-Kosten (meist kostenlos oder sehr günstig)

---

## 🔒 Nach dem Deployment

1. **Passwörter ändern!**
   - Die Standard-Passwörter sind unsicher
   - Admin-Bereich → Benutzer verwalten

2. **Backups einrichten**
   - Datei `tmc-tracking.db` regelmäßig sichern
   - Automatische Backups bei Hosting-Anbietern nutzen

3. **URL an Mitarbeiter weitergeben**
   - z.B. `https://tmc-tracking.railway.app`
   - Benutzernamen und Passwörter verteilen

---

## ❓ Häufige Probleme

**"Port 3000 already in use"**
- Lösung: Ändern Sie PORT in server.js oder stoppen Sie andere Programme auf Port 3000

**"Cannot find module"**
- Lösung: Führen Sie `npm install` erneut aus

**Server stoppt automatisch**
- Lösung: Verwenden Sie `pm2` für dauerhaften Betrieb (siehe README.md)

**Mitarbeiter können nicht zugreifen**
- Lokales Netzwerk: Prüfen Sie Firewall-Einstellungen
- Internet: Stellen Sie sicher, dass die Anwendung deployed ist

---

## 📞 Nächste Schritte

1. ✅ Lokal testen (npm start)
2. ✅ Mit allen Benutzern anmelden und testen
3. ✅ Deployment-Option wählen (Railway empfohlen)
4. ✅ URL an Mitarbeiter weitergeben
5. ✅ Backups einrichten

**Viel Erfolg mit Ihrem Tracking-System!** 🎯
