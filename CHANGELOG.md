# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

### Changed
- Wechselndes Startbild wird auch auf flachen Bildschirmen vollständig und mit
  einem dezenten Rahmen dargestellt
- `bilder/dachs.mp4` ersetzt den Platzhalter als Film des Monats
- Film des Monats für eine breite Browserunterstützung von HEVC/MP2 auf
  H.264/AAC mit Weboptimierung umgewandelt
- Drei beitragsbezogene Aufnahmen ergänzen den Gesundheitsartikel zur digitalen
  Arztpraxis als eigenständige Mini-Galerie mit Großansicht
- Roboto und die verwendeten Font-Awesome-Markensymbole werden einschließlich
  ihrer Originallizenzen lokal bereitgestellt; externe Font-CDNs entfallen
- Wartungsmenü nennt Ablageorte und Originallizenzen der lokalen Schrift- und
  Symboldateien sowie das verbindliche H.264/AAC-Webformat für Filme

## [1.1.0] - 2026-07-27

### Added
- Kompakte Wartungshilfe auf der Startseite mit Architekturübersicht,
  Entwicklungstagebuch und aktuellem Systemstand
- Tastaturbedienbare Reiter, Fokusführung und automatisierte Tests für das
  Wartungsmenü
- Einheitliche Cache-Versionierung für lokale CSS- und JavaScript-Dateien mit
  automatischer Konsistenzprüfung

### Changed
- Projektversion, Arbeitsstand, Dokumentationsstand und Cache-Kennung klar
  voneinander getrennt und zentral in `package.json` beschrieben
- Veraltete Versionsangaben im Entwicklerleitfaden synchronisiert
- Galerie-Konfiguration und Startbild-Pool mit dem vorhandenen Bildbestand
  abgeglichen
- Wartungszugang dezent in den Footer verschoben, Tagebuch um die belegbare
  Vorgeschichte ergänzt und Systemübersicht um Zustände sowie eine lesende
  Worker-/D1-Live-Prüfung erweitert
- Weiterführende Wartungsdokumente öffnen aus dem Panel in einem neuen Tab
- Tagebucheinträge verlinken vorhandene GitHub-Tags und Commit-Kennungen
- Systemstatus meldet offene, konfliktbehaftete oder noch unklare
  GitHub-Synchronisationsvorgänge
- Offene Wartungsaufgaben aus GitHub Issues werden nach Dringlichkeit geordnet
  im Systemstatus angezeigt
- Galeriereihenfolge kann nur auf erlaubten Live-Domains und erst nach
  erfolgreichem Laden einer aktiven D1-Reihenfolge gespeichert werden
- Systemstatus zeigt Anzahl und letzten Änderungszeitpunkt der aktiven
  D1-Galeriereihenfolge

## [1.1.0] - 2026-07-27

### Added
- MIT Lizenz hinzugefügt
- Versionierungssystem implementiert
- CHANGELOG.md erstellt
- Vollständige Cloudflare-Betriebsdokumentation
- Automatisierte Struktur-, UI-, Galerie- und Worker-Tests
- Lesender Live-Test für Webseite und Galerie-API
- GitHub-Actions-Statusprüfung bei Pull Requests und Änderungen an `main`
- Datumsabhängiges, responsives Startfenster für Veranstaltungseinladungen
- Zufällige Galerie-Ersatzanzeige mit Bildwechsel und Fehlerbehandlung
- Automatisierte Tests für Ablaufdatum, Bildwechsel, Bedienung und Darstellung
- Redaktioneller Ein-/Aus-Schalter für das Startfenster
- Automatischer Abgleich zwischen Startbild-Pool und Galerie-Dateibestand

### Changed
- README.md mit Lizenzinformation aktualisiert
- Galerie lädt den bekannten Bildbestand schneller und sucht neue Bilder in
  kleineren Hintergrundblöcken
- Dateiaustausch über GitHub und GitHub Desktop dokumentiert
- Redaktionelle Pflege des Startfensters in einer eigenen, kommentierten Datei
- Zufallsauswahl des Startfensters von 5 auf alle 42 Galeriebilder erweitert
- Datenschutzerklärung um Cloudflare Workers und Cloudflare D1 ergänzt

## [1.0.0] - 2026-07-08

### Added
- Initiales Release
- Projektstruktur etabliert
- Grundlegende Website mit folgenden Seiten:
  - Startseite (index.html)
  - Galerie (docs/galerie.html)
  - Services (docs/service.html)
  - Kontakt (docs/kontakt.html)
  - Kalender (docs/kalender.html)
  - Gesundheit (docs/gesundheit.html)
  - Datenschutzerklärung (docs/datenschutz.html)
  - Impressum (docs/impressum.html)
- CSS-Styling mit Style.css und Cookie-Banner
- JavaScript-Funktionalität für Galerie und Services
- Favicon und Custom-Fonts

### Fixed
- Initiale Bugs behoben

---

## Versionierungsrichtlinien

### Versionsformat: MAJOR.MINOR.PATCH (z.B. 1.2.3)

- **MAJOR**: Inkompatible API/Funktionalität Änderungen
- **MINOR**: Neue Funktionalität, abwärtskompatibel
- **PATCH**: Bugfixes und kleine Verbesserungen

### Release-Prozess

1. Version in `package.json` aktualisieren
2. CHANGELOG.md aktualisieren
3. Commit: `git commit -m "chore: Release v1.x.x"`
4. Git Tag erstellen: `git tag -a v1.x.x -m "Release version 1.x.x"`
5. Zu GitHub pushen: `git push origin main --tags`
