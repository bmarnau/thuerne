# Testbericht der Thürne-Webseite

Stand: 31. Juli 2026

## Status

**BESTANDEN**

Der automatisierte Test deckt die im Repository vorhandenen clientseitigen
Funktionen und die Cloudflare-Worker-API ab. Geheime Redaktionsdaten werden nicht
im Test gespeichert oder übertragen.

| Teststufe | Ergebnis |
| --- | --- |
| Lokale Struktur-, UI-, Startfenster-, Galerie-, Versionierungs- und Worker-Tests | 28 bestanden, 0 fehlgeschlagen |
| Live-Test der öffentlichen Seiten und API | nicht erneut ausgeführt; letzter dokumentierter Stand vom 27.07.2026: 2 bestanden, 0 fehlgeschlagen |
| Sichtprüfung Wartungsmenü | Desktop 1280 × 720 und Mobil 390 × 844 bestanden |

## Geprüfte Bereiche

| Bereich | Prüfung |
| --- | --- |
| Alle HTML-Seiten | Grundstruktur, Seitentitel, Sprache und eindeutige IDs |
| Dateien und Links | lokale Links, Bilder, PDFs, Stylesheets und Skripte vorhanden |
| JavaScript | Syntax aller Dateien in `js/` |
| Navigation | mobiles Menü und `aria-expanded` |
| Datenschutz | Cookie-Einwilligung und lokale Speicherung |
| Bedienung | Nach-oben-Schaltfläche |
| Wartungshilfe | Öffnen, Schließen, Reiter, Escape-Taste, Fokusführung und Mobilansicht |
| Versionierung | Projektversion, Dokumentationsstand und Cache-Kennung konsistent |
| Startfenster | nächste Veranstaltung vor Beginn; Galeriebild ab Beginn |
| Startfenster-Schalter | vollständiges Ausschalten ohne Bildabruf oder Speicherung |
| Startfenster-Bildpool | alle 42 nummerierten Galeriebilder enthalten; keine Doppelungen |
| Startfenster-Zufall | aufeinanderfolgende Starts zeigen unterschiedliche Bilder |
| Startfenster-Fehlerfall | Reservebilder und sichtbarer Text bei Bildfehlern |
| Startfenster-Bedienung | Schließen über Schaltfläche und Hintergrund |
| Startfenster-Darstellung | Breiten-/Höhenbegrenzung, `object-fit` und Querformat-Regel |
| Kalender | externe Einbettung erst nach Klick; Ein-/Ausblenden |
| Service | beide Padlets; Flyer öffnen und schließen |
| Galerie | zentrale Reihenfolge laden, Abschnitte verschieben, Beschriftungen, PIN-Prüfung und Speichern |
| Galerie-Speicherschutz | nur auf Live-Domains und nach erfolgreichem Laden einer aktiven D1-Reihenfolge |
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
  manuell zu prüfen. Die automatische Prüfung bestätigt die dafür vorgesehenen
  responsiven CSS-Regeln, ersetzt aber keinen Test auf einem physischen Gerät.
- Der produktive Schreibvorgang mit der geheimen PIN wird aus Sicherheitsgründen
  nicht automatisiert.
- Externe Dienste wie Google Kalender und Padlet werden nur bis zur korrekt
  erzeugten Einbettung geprüft; deren fremde Inhalte liegen außerhalb dieses
  Projekts.

## Sichtprüfung vom 31. Juli 2026

- Desktop: Seitenpanel 430 Pixel breit bei 1280 × 720 Pixel Viewport
- Mobil: vollbreites Panel bei 390 × 844 Pixel Viewport
- kein horizontaler Überlauf
- Orientierung, Verlauf und System umschaltbar
- Escape-Taste schließt das Panel und setzt den Fokus auf den Auslöser zurück
- keine Warnungen oder Fehler in der Browserkonsole
- lokale Vorschau kennzeichnet die produktionsgebundene Worker-Prüfung
  verständlich als nur auf der veröffentlichten Website ausführbar
