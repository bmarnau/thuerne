# Thuerne - Website

[![Website-Funktionstest](https://github.com/bmarnau/thuerne/actions/workflows/website-tests.yml/badge.svg)](https://github.com/bmarnau/thuerne/actions/workflows/website-tests.yml)

Eine professionelle HTML-Website erstellt mit Dreamweaver.

**Aktuelle Version:** 1.0.0

## 📁 Projektstruktur

```
thuerne/
├── index.html              # Startseite
├── bilder/                 # Bildmaterial
├── css/
│   ├── style.css          # Hauptstile
│   └── cookie.css         # Cookie-Banner Styles
├── docs/                  # Dokumentenseiten
│   ├── entwicklung.html   # 👨‍💻 Entwickler-Leitfaden (START HIER!)
│   ├── galerie.html       # Galerie
│   ├── service.html       # Services
│   ├── kontakt.html       # Kontakt
│   ├── kalender.html      # Kalender
│   ├── gesundheit.html    # Gesundheit
│   ├── datenschutz.html   # Datenschutzerklärung
│   └── impressum.html     # Impressum
├── favicon/               # Favicon-Dateien
├── fonts/                 # Custom-Fonts
├── images/                # Bilder und Icons
└── js/
    ├── script.js          # Hauptscript
    ├── galerie.js         # Galerie-Funktionalität
    └── service.js         # Service-Funktionalität
```

## 🚀 Erste Schritte

**👨‍💻 [Entwickler-Leitfaden](docs/entwicklung.html)** - Alle wichtigen Hinweise zur Entwicklung der Website

1. Repository klonen:
```bash
git clone https://github.com/bmarnau/thuerne.git
cd thuerne
```

2. Local mit Dreamweaver öffnen und bearbeiten

3. Änderungen commiten und pushen:
```bash
git add .
git commit -m "Beschreibung der Änderungen"
git push origin main
```

## ✅ Funktionstest

Nach dem Klonen oder Aktualisieren einmalig die Testabhängigkeiten installieren:

```bash
npm ci
```

Danach:

```bash
npm test
npm run test:live
```

- `npm test` prüft Dateien, Links, JavaScript, Bedienfunktionen und den
  Cloudflare Worker lokal.
- `npm run test:live` prüft die öffentlich erreichbare Webseite und API
  ausschließlich lesend.
- GitHub führt beide Prüfungen bei Pull Requests und Änderungen an `main`
  automatisch aus.
- Das zuletzt dokumentierte Ergebnis steht in [TESTBERICHT.md](TESTBERICHT.md).

## 🔄 Einfacher Dateiaustausch mit GitHub Desktop

GitHub ist der verbindliche Projektstand. Auf Windows:

1. In GitHub Desktop das Repository `bmarnau/thuerne` öffnen.
2. **Fetch origin** und anschließend bei Bedarf **Pull origin** wählen.
3. Die benötigten Dateien liegen danach im lokalen Projektordner.
4. Für Variomedia nur die im jeweiligen Commit genannten Dateien hochladen.

Dateizeitstempel dienen nicht zur Versionsprüfung. Maßgeblich sind der aktuelle
Branch und die Commit-Nummer in GitHub Desktop.

## 📝 Git-Workflow

### Neue Features / Bugfixes
```bash
# Neuen Branch erstellen
git checkout -b feature/beschreibung

# Änderungen commiten
git add .
git commit -m "Feature: kurze Beschreibung"

# Zu main mergen
git checkout main
git merge feature/beschreibung
```

## 📋 Wichtige Dateien

- `.gitignore` - Ignorierte Dateien (Dreamweaver-Temp-Dateien, etc.)
- `README.md` - Diese Datei

## ⚙️ Empfehlungen für GitHub

1. **Repository auf GitHub erstellen** unter deinem Account
2. **SSH-Keys einrichten** für sichere Verbindung
3. **Remote hinzufügen**:
```bash
git remote add origin https://github.com/bmarnau/thuerne.git
git branch -M main
git push -u origin main
```

4. **Branch-Protection** in GitHub-Settings aktivieren (optional)
5. **README & Dokumentation** regelmäßig aktualisieren

## 📦 Releases & Versionierung

Siehe [CHANGELOG.md](CHANGELOG.md) für die vollständige Versionshistorie.

Das Projekt folgt der [Semantischen Versionierung](https://semver.org/lang/de/) (SemVer).

Veröffentlichte Releases werden unter [GitHub Releases](https://github.com/bmarnau/thuerne/releases) aufgeführt.

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert. 
Siehe [LICENSE](LICENSE) Datei für weitere Details.

**Copyright © 2024-2026 Thuerne** - Alle Rechte vorbehalten.

## 👤 Kontakt

[Kontaktinformationen einfügen]

---

**Hinweis**: Stelle sicher, dass sensible Daten (API-Keys, Passwörter) in der `.env` Datei sind und nicht committed werden!
