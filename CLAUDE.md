# Thürne-Website – Hinweise für Claude

Statische Vereins-Website (HTML/CSS/JS, ohne Build-Schritt). Sprache der Inhalte,
Commits und Dokumentation: Deutsch. Die Arbeit hier ist überwiegend redaktionelle
Pflege (Termine, Rückblicke, Galerie, Bild/Film des Monats).

@AGENTS.md

## Arbeitsstand und Branches

- Arbeitsordner: `C:\dev\thuerne`. Der frühere Ordner
  `C:\Users\bmarn\OneDrive\HTML\thuerne` ist die alte Arbeitskopie – dort nichts ändern.
- Maßgeblicher Stand ist `main` (seit 5. November 2026 sind alle Arbeits-Branches
  zusammengeführt). Vor Änderungen `git fetch` und mit dem Remote abgleichen.
- Fremde, nicht zum Auftrag gehörende lokale Änderungen bewahren und nicht mitcommitten.

## Arbeitsweise

- Änderungen immer auf einem Feature-Branch (`feature/...`, `fix/...`), nie direkt
  auf `main`. Zusammenführen nur per Pull Request nach grünen GitHub-Prüfungen.
- Kleine, thematisch getrennte Commits (Conventional Commits, deutsch: `feat:`,
  `fix:`, `docs:`, `chore:`). Vor jedem Commit `npm test`.
- Nichts pushen, mergen oder Pull Requests anlegen ohne ausdrückliche Freigabe.
- Auf diesem Windows-PC nur PowerShell-kompatible Befehle nennen.
- Im Arbeitsordner liegen Dateien mit Windows-Zeilenenden (CRLF), im Repository mit LF.
  Erscheinen Dateien in `git diff` komplett als geändert, nicht committen, sondern
  zuerst Zeilenenden klären (`git diff --ignore-cr-at-eol --stat`).

## Veröffentlichung

- GitHub Pages veröffentlicht das Repository; `_config.yml` schließt Pflege- und
  Entwicklungsdateien aus (siehe Regel oben).
- Der Webserver (Variomedia) wird manuell bespielt, maßgeblich ist
  `UPLOAD-WEBSERVER.md`. Am Ende jeder Änderung die hochzuladenden Dateien nennen.
- Das Repository ist öffentlich: weder Zugangsdaten noch Redaktions-PIN in `CLAUDE.md`,
  `AGENTS.md`, Skripten oder Dokumentation.

## Wichtige Anleitungen im Repo

- `README.md` – Startfenster (`js/start-hinweis.js`) pflegen, Veranstaltungen eintragen
- `galeriepflege.md`, `codex-vorschrift-neuer-abschnitt.md` – Galerieabschnitte; die
  Vorschrift gilt auch für Claude
- `MONATSCHECK.md` – Bild und Film des Monats (`scripts\monatscheck.ps1`)
- `UPLOAD-WEBSERVER.md` – welche Dateien auf den Webserver (Variomedia) gehören
- `cloudflare/README.md` – Worker/D1 für die Galeriesortierung

## Regeln, die leicht vergessen werden

- Nach Änderungen an CSS/JS die Cache-Kennung (`?v=...` bzw.
  `siteMetadata.cacheVersion` in `package.json`) erhöhen; `tests/versionierung.test.mjs`
  prüft die Konsistenz.
- Neue Galeriebilder zusätzlich in `START_GALERIEGRUPPEN` in `js/start-hinweis.js`
  eintragen; vorhandene Abschnitts-IDs und Nummernkreise nie wiederverwenden.
- Neue Pflege-/Entwicklungsdateien in `_config.yml` unter `exclude` aufnehmen, damit
  GitHub Pages sie nicht veröffentlicht.
- `CHANGELOG.md` unter `[Unreleased]` fortschreiben.
- Niemals Redaktions-PIN, Tokens oder Passwörter speichern.

## Tests

- `npm test` – lokale Struktur-, Oberflächen- und Worker-Tests (jsdom)
- `npm run test:month` – nur Monatsmedien
- `npm run test:live` – prüft die öffentliche Webseite und die Cloudflare-API (nur
  lesend); läuft über `scripts/live-test.mjs` auch unter Windows

## Hilfsbefehle (`.claude/commands/`)

- `/pruefen` – `npm test` und `npm run test:month` ausführen und berichten
- `/veranstaltung` – neue Veranstaltung im Startfenster eintragen
- `/galeriebild` – Galeriebilder bzw. neuen Galerieabschnitt aufnehmen
- `/monatscheck` – Bild und Film des Monats aktualisieren und prüfen
- `/pr` – Branch, Commits und Pull Request vorbereiten (ohne Merge)
