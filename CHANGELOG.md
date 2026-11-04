# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

- Galerie: neuer Abschnitt „Adventsmarkt“ (`galerie-adventsmarkt-2026`,
  Nummernkreis `e6bild`); weitere Bilder `e6bild02` usw. werden automatisch gefunden.
- Galerie: Abschnitt „Wanderwege“ heißt jetzt „Wanderweg - Wääch jangs“ (ID und
  Nummernkreis `a6bild` unverändert, Alternativtext im Startbild-Pool angepasst).
- Galerie: `e2bild01`, `e3bild03`, `e3bild05` und `e3bild06` in den Abschnitt
  „Wanderweg - Wääch jangs“ verschoben (jetzt `a6bild06` bis `a6bild09`);
  Zuordnungsliste und Startbild-Pool angepasst.
- Galerie: `e3bild02` in den Abschnitt „Aktivitäten“ verschoben (jetzt `e4bild08`).
- Galerie: `a2bild03` aus „Astronomie“ nach „Noch nicht zugeordnet“ verschoben
  (jetzt `a5bild01`); eigene Gruppe im Startbild-Pool.
- Galerie: `e4bild06` aus „Aktivitäten“ als erstes Bild in den Abschnitt „Adventsmarkt“
  verschoben (jetzt `e6bild01`); eigene Gruppe im Startbild-Pool.
- Galerie: Zuordnungsliste nennt die Abschnitte jetzt wie ihre Überschriften
  („Italienischer Abend“ statt „Sommerfest“, „Aktivitäten“ statt „Dorffest“).
- Strukturtest prüft zusätzlich, dass jeder Bildnummernkreis nur einmal vorkommt
  und in der Zuordnungsliste der Galerie steht.
- Cache-Kennung auf `20261104-2` erhöht (geändertes `js/start-hinweis.js`).
- Cache-Kennung auf `20261104` erhöht, damit Browser das geänderte
  `js/start-hinweis.js` (Startbild-Gruppe Herbstwanderung) neu laden.
- `UPLOAD-WEBSERVER.md` mit aktueller Dateiliste, vollständiger Ordnerübersicht
  (einschließlich `js/` und `medien/`) und Liste nicht hochzuladender Dateien.
- `npm run test:live` läuft über `scripts/live-test.mjs` jetzt auch unter Windows.
- `CLAUDE.md` um Arbeitsweise (Feature-Branch, Pull Request), Veröffentlichung und
  Hilfsbefehle ergänzt und in `_config.yml` von GitHub Pages ausgeschlossen.
- `README.md`: Git-Workflow auf Feature-Branch und Pull Request umgestellt, Abschnitt
  zur Weiterentwicklung mit Claude Code ergänzt.
- `.gitignore` schließt lokale Claude-Code-Einstellungen, `.wrangler/` und `.env.*` aus.
- Die Herbstwanderung (27. September) erscheint auf Start- und Serviceseite als
  Rückblick mit Foto und verlinkt den Galerieabschnitt „Herbstwanderung 2026“; die
  Einladung wurde ersetzt.
- Die veraltete Vorschau (`preview/`, `preview.zip`) wurde entfernt.
- `_config.yml` schließt Pflege- und Entwicklungsdateien von GitHub Pages aus; die
  Wartungshilfe verlinkt Galeriepflege, Cloudflare-Betrieb und Changelog auf GitHub.
- Die Herbstwanderung am 27. September ersetzt den Italienischen Abend auf der
  Startseite und ist dort sowie auf der Serviceseite direkt mit dem Flyer verlinkt.
- Der vergangene September-Backtermin wurde von der Serviceseite entfernt.
- Die Beschriftung des Brotback-Padlets wird automatisch aus dem nächsten
  Backtermin der Serviceseite gebildet, bleibt bis zum Ende der Kalenderwoche
  beim gerade vergangenen Backtermin und ist beim Ein- und Ausblenden konsistent.
- Die zentrale Cache-Kennung wurde aktualisiert, damit Browser das geänderte
  Service-Skript zuverlässig neu laden.

### Changed
- Wechselndes Startbild wird auch auf flachen Bildschirmen vollständig und mit
  einem dezenten Rahmen dargestellt
- `bilder/dachs.mp4` ersetzt den Platzhalter als Film des Monats
- Film des Monats für eine breite Browserunterstützung von HEVC/MP2 auf
  H.264/AAC mit Weboptimierung umgewandelt
- Roboto und die verwendeten Font-Awesome-Markensymbole werden einschließlich
  ihrer Originallizenzen lokal bereitgestellt; externe Font-CDNs entfallen
- Wartungsmenü nennt Ablageorte und Originallizenzen der lokalen Schrift- und
  Symboldateien sowie das verbindliche H.264/AAC-Webformat für Filme
- Nicht für die Öffentlichkeit freigegebene Aufnahmen zur digitalen Arztpraxis
  und ihre Mini-Galerie vollständig entfernt

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
