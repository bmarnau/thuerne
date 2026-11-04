---
description: Neue Veranstaltung im Startfenster (und auf Wunsch unter Aktuelles) eintragen
argument-hint: "[Titel, Datum/Uhrzeit, Bilddatei, Link]"
---

Trage eine neue Veranstaltung in das Startfenster der Thürne-Website ein.
Angaben des Nutzers: $ARGUMENTS

Vorgehen:

1. Fehlende Angaben erfragen: Titel, Beginn (Datum und Uhrzeit), Einladungsbild
   (Datei in `bilder/`), kurzer Text, Ziel des Links (meist ein Abschnitt in
   `docs/service.html`) und Linktext. Nichts erfinden.
2. Prüfen, dass das Bild in `bilder/` liegt. Fehlt es, nachfragen.
3. In `js/start-hinweis.js` in `START_VERANSTALTUNGEN` einen neuen Block nach dem
   Muster der vorhandenen Einträge anlegen:
   - `beginn` immer mit Uhrzeit und Zeitzone: `+02:00` in der Sommerzeit,
     `+01:00` in der Winterzeit.
   - `bildAlt` beschreibt das Bild sinnvoll (Barrierefreiheit).
   - Abgelaufene Einträge nicht löschen, außer der Nutzer wünscht es.
4. Fragen, ob die Veranstaltung zusätzlich unter „Aktuelles“ in `index.html`
   und/oder auf `docs/service.html` erscheinen soll; vorhandene Karten als Muster
   nehmen.
5. Cache-Kennung erhöhen: neues Datum `JJJJMMTT` in allen `?v=`-Angaben der
   HTML-Dateien und in `package.json` → `siteMetadata.cacheVersion`.
6. `CHANGELOG.md` unter `[Unreleased]` ergänzen.
7. `npm test` ausführen.
8. Ergebnis berichten: geänderte Dateien, Testergebnis und die Dateien, die auf
   den Webserver müssen (siehe `UPLOAD-WEBSERVER.md`, Abschnitt „Aktuelle Änderung“
   ebenfalls aktualisieren). Nicht committen oder pushen ohne Freigabe.
