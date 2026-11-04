---
description: Galeriebilder in einen vorhandenen Abschnitt aufnehmen oder neuen Abschnitt anlegen
argument-hint: "[Abschnitt oder neuer Name, Bilddateien]"
---

Nimm Bilder in die Galerie der Thürne-Website auf. Angaben: $ARGUMENTS

Verbindlich sind `galeriepflege.md` und `codex-vorschrift-neuer-abschnitt.md`
(gilt auch für Claude). Lies beide zuerst.

1. Klären: vorhandener Abschnitt oder neuer Abschnitt? Welche Bilddateien?
   Bei neuem Abschnitt: Name, Art (Themengalerie `a…` oder Rückblick `e…`),
   gewünschte Position.
2. Bilder prüfen: Liegen sie im Arbeitsordner? Format `.jpg`, `.jpeg` oder `.png`?
   EXIF-/GPS-Daten melden (Datenschutz) und fragen, ob sie entfernt werden sollen.
   Sehr große Dateien (> 1 MB) melden.
3. Dateien nach dem Nummernkreis umbenennen bzw. kopieren (`a7bild01.jpg` …).
   Vorhandene Nummernkreise und Abschnitts-IDs nie wiederverwenden. Originale
   nicht löschen, ohne zu fragen.
4. `docs/galerie.html` anpassen: Abschnitt anlegen bzw. `data-von` auf die höchste
   Bildnummer setzen; Zuordnungsliste „Zuordnung der Nummernkreise“ ergänzen.
5. Alle neuen Bilder in `START_GALERIEGRUPPEN` in `js/start-hinweis.js` eintragen.
6. Cache-Kennung erhöhen (alle `?v=` in den HTML-Dateien und
   `package.json` → `siteMetadata.cacheVersion`).
7. Tests anpassen, falls nötig; `npm test` ausführen.
8. `CHANGELOG.md` und `UPLOAD-WEBSERVER.md` (Abschnitt „Aktuelle Änderung“)
   aktualisieren.
9. Berichten: Abschnitt, Nummernkreis, Dateien, Testergebnis, Upload-Liste.
   Nicht committen oder pushen ohne Freigabe. Die Reihenfolge der Abschnitte
   speichert der Nutzer selbst auf der Live-Seite mit der Redaktions-PIN.
