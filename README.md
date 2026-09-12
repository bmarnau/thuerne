# Thuerne - Website

[![Website-Funktionstest](https://github.com/bmarnau/thuerne/actions/workflows/website-tests.yml/badge.svg)](https://github.com/bmarnau/thuerne/actions/workflows/website-tests.yml)

Eine professionelle HTML-Website erstellt mit Dreamweaver.

**Aktuelle Version:** 1.1.0

**Aktueller Arbeitsstand:** Unreleased · Dokumentationsstand 12.09.2026

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
    ├── start-hinweis.js   # Startfenster: Veranstaltungen und Galeriebilder
    ├── galerie.js         # Galerie-Funktionalität
    └── service.js         # Service-Funktionalität
```

## 🖼️ Startfenster redaktionell pflegen

Die Inhalte des Startfensters stehen gesammelt am Anfang von
`js/start-hinweis.js`. Der technische Teil darunter muss für die redaktionelle
Arbeit nicht geändert werden.

### Startfenster ein- oder ausschalten

Ganz oben in `js/start-hinweis.js` steht der zentrale Schalter:

```js
const STARTBILD_AKTIV = true;
```

- `true`: Das Startfenster wird angezeigt.
- `false`: Das Startfenster bleibt vollständig ausgeschaltet.

Nur `true` oder `false` ändern. Bei `false` werden weder ein Veranstaltungsbild
noch ein zufälliges Galeriebild geladen.

### Neue Veranstaltung eintragen

1. Das neue Einladungsbild in `bilder/` ablegen.
2. In `START_VERANSTALTUNGEN` einen vorhandenen Block von `{` bis `}` kopieren.
3. `titel`, `beginn`, `bild`, `bildAlt`, `text`, `link` und `linkText` anpassen.
4. Das Beginndatum vollständig mit Uhrzeit und Zeitzone eintragen, zum Beispiel
   `2026-12-05T16:00:00+01:00`.
5. Die Änderung mit `npm test` prüfen.

Vor dem Beginn wird automatisch die zeitlich nächste Veranstaltung gezeigt.
Ab dem eingetragenen Beginn ist die Einladung ungültig und wird automatisch
durch ein Galeriebild ersetzt.

### Vollständigen Galeriebild-Pool pflegen

Die Ersatzbilder stehen nach Bereichen geordnet in `START_GALERIEGRUPPEN`.
Der Pool enthält alle aktuell 42 nummerierten Bilder der Galerie. Wird ein neues
Galeriebild ergänzt, muss sein exakter Dateiname zusätzlich in der passenden
Gruppe eingetragen werden. `npm test` vergleicht beide Bestände und meldet jede
Abweichung. Der Browser vermeidet beim nächsten Seitenstart das zuletzt gezeigte
Bild. Fehlerhafte Bilder werden automatisch übersprungen.

> **Wichtig für die Veröffentlichung:** Wird `js/start-hinweis.js` geändert,
> die Versionsnummer `?v=...` am zugehörigen Script in `index.html` ebenfalls
> aktualisieren. Dadurch erhalten Besucher nicht versehentlich eine alte
> zwischengespeicherte Einladung.

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

## 🛠️ Kompakte Wartungshilfe

Der unauffällige Drei-Punkte-Button unten rechts auf der Startseite öffnet eine
Kurzreferenz für Wartungsarbeiten. Sie enthält Projektorientierung, einen
kompakten Entwicklungsverlauf und den dokumentierten technischen Systemstand.

Die Anzeige ersetzt keine Quelldokumentation:

- `README.md` beschreibt Aufbau und Pflege.
- `CHANGELOG.md` bleibt die verbindliche Versionshistorie.
- `docs/entwicklung.html` enthält den ausführlichen Entwickler-Leitfaden.
- `cloudflare/README.md` dokumentiert Worker und D1.

Bei wesentlichen funktionalen Änderungen werden der Abschnitt `Unreleased` im
Changelog und – falls sich Architektur, Funktionen oder Version ändern – die
kompakte Wartungshilfe gemeinsam aktualisiert. Commit-Nummern werden erst
eingetragen, wenn sie tatsächlich vorhanden sind.

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

Die drei Arten von Versionsangaben sind bewusst getrennt:

- `package.json` ist die zentrale Quelle für die veröffentlichte
  **Projektversion**.
- `CHANGELOG.md` sammelt noch nicht veröffentlichte Änderungen unter
  **Unreleased**.
- `siteMetadata.cacheVersion` in `package.json` ist die gemeinsame
  **Cache-Kennung** aller lokalen CSS- und JavaScript-Einbindungen.
- Ein Datums- oder Fassungsstand in einer einzelnen Dokumentation bezeichnet
  nur dieses Dokument, nicht automatisch eine neue Projektversion.

Bei einem Release werden Projektversion, `package-lock.json`, README,
Wartungshilfe und Changelog gemeinsam aktualisiert. Die Cache-Kennung wird bei
jeder veröffentlichten Änderung an lokalen CSS- oder JavaScript-Dateien erneuert
und anschließend auf allen HTML-Seiten einheitlich verwendet.

Veröffentlichte Releases werden unter [GitHub Releases](https://github.com/bmarnau/thuerne/releases) aufgeführt.

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert. 
Siehe [LICENSE](LICENSE) Datei für weitere Details.

**Copyright © 2024-2026 Thuerne** - Alle Rechte vorbehalten.

## 👤 Kontakt

[Kontaktinformationen einfügen]

---

**Hinweis**: Stelle sicher, dass sensible Daten (API-Keys, Passwörter) in der `.env` Datei sind und nicht committed werden!
