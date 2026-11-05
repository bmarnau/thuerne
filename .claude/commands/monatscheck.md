---
description: Bild und/oder Film des Monats austauschen und mit dem Monatscheck prüfen
argument-hint: "[JJJJ-MM, Bild/Film, Datei, Bezeichnung, Urheber]"
---

Aktualisiere Bild und/oder Film des Monats auf der Startseite. Angaben: $ARGUMENTS

Grundlage ist `MONATSCHECK.md`. Film und Bild werden getrennt gepflegt und dürfen
unterschiedlichen Monaten zugeordnet sein.

1. Klären: Bild, Film oder beides? Monat (`JJJJ-MM`), Datei, Bezeichnung
   (z. B. Tierart), Urheber, Aufnahmezeit, Alternativtext. Nichts erfinden.
2. Datei prüfen:
   - Bild: in `medien/`, Abmessungen ermitteln (für `width`/`height`),
     EXIF-/GPS-Daten melden und auf Wunsch entfernen.
   - Film: H.264/AVC mit AAC-Ton (siehe `UPLOAD-WEBSERVER.md`); sonst melden.
3. In `index.html` im Bereich Bild/Film des Monats beim jeweiligen Medium
   `<time datetime="JJJJ-MM">` und sichtbaren Monat, Pfad, Bezeichnung, Urheber
   (`Foto:` bzw. `Film:`), Aufnahmezeit und Alternativtext anpassen.
4. Prüfen mit
   `.\scripts\monatscheck.ps1 -Monat JJJJ-MM -ArbeitsstandErlaubt`
5. `CHANGELOG.md` und `UPLOAD-WEBSERVER.md` (Abschnitt „Aktuelle Änderung“)
   aktualisieren.
6. Berichten: geänderte Dateien, Ergebnis des Monatschecks, Upload-Liste.
   Nicht committen oder pushen ohne Freigabe. Nach dem Push kann der vollständige
   Freigabecheck `.\scripts\monatscheck.ps1 -Monat JJJJ-MM -MitGitHub` laufen.
