# Testbericht der Thürne-Webseite

Stand: 26. Juli 2026

## Status

**BESTANDEN**

Der automatisierte Test deckt die im Repository vorhandenen clientseitigen
Funktionen und die Cloudflare-Worker-API ab. Geheime Redaktionsdaten werden nicht
im Test gespeichert oder übertragen.

| Teststufe | Ergebnis |
| --- | --- |
| Lokale Struktur-, UI-, Galerie- und Worker-Tests | 12 bestanden, 0 fehlgeschlagen |
| Live-Test der öffentlichen Seiten und API | 2 bestanden, 0 fehlgeschlagen |

## Geprüfte Bereiche

| Bereich | Prüfung |
| --- | --- |
| Alle HTML-Seiten | Grundstruktur, Seitentitel, Sprache und eindeutige IDs |
| Dateien und Links | lokale Links, Bilder, PDFs, Stylesheets und Skripte vorhanden |
| JavaScript | Syntax aller Dateien in `js/` |
| Navigation | mobiles Menü und `aria-expanded` |
| Datenschutz | Cookie-Einwilligung und lokale Speicherung |
| Bedienung | Nach-oben-Schaltfläche |
| Kalender | externe Einbettung erst nach Klick; Ein-/Ausblenden |
| Service | beide Padlets; Flyer öffnen und schließen |
| Galerie | zentrale Reihenfolge laden, Abschnitte verschieben, Beschriftungen, PIN-Prüfung und Speichern |
| Galeriebilder | bekannter Bestand stimmt mit den vorhandenen nummerierten Dateien überein |
| Cloudflare Worker | Lesen, Schreiben, Authentifizierung, Datenprüfung, CORS, Pfade und Methoden |
| Live-System | öffentliche Seiten, Galerie-API und CORS über separaten Live-Test |

## Befehle

```bash
npm ci
npm test
npm run test:live
```

`npm test` arbeitet ausschließlich mit lokalen Dateien und Testdaten.
`npm run test:live` liest die öffentlich erreichbare Webseite und API, verändert
aber keine Daten. Ein produktiver Schreibtest ist absichtlich ausgeschlossen,
weil dafür die geheime Redaktions-PIN nötig wäre und die gespeicherte Reihenfolge
verändert würde.

## Automatischer Status auf GitHub

Die GitHub-Aktion `.github/workflows/website-tests.yml` führt bei Pull Requests,
bei Änderungen an `main` und auf manuellen Start beide Teststufen aus. GitHub
meldet das Ergebnis als grünen oder roten Check.

## Grenzen

- Darstellung und Bedienkomfort auf konkreten Endgeräten bleiben zusätzlich
  manuell zu prüfen.
- Der produktive Schreibvorgang mit der geheimen PIN wird aus Sicherheitsgründen
  nicht automatisiert.
- Externe Dienste wie Google Kalender und Padlet werden nur bis zur korrekt
  erzeugten Einbettung geprüft; deren fremde Inhalte liegen außerhalb dieses
  Projekts.
