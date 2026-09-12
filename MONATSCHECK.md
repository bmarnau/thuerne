# Monatscheck für Bild und Film des Monats

Der Monatscheck kontrolliert in einem Durchlauf:

- identische und gültige Monatsangaben für Film und Bild,
- vorhandene Mediendateien im Ordner `medien`,
- Bezeichnungen, Urheber, Alternativtext und Bildabmessungen,
- alle automatischen Website-, Struktur- und Funktionstests,
- problematische Leerzeichen und einen sauberen Git-Arbeitsstand,
- auf Wunsch zusätzlich die Prüfungen des aktuellen Pull Requests auf GitHub.

## Monatliche Pflege

1. Neues Bild und neuen Film in `medien` ablegen.
2. In `index.html` Monat, Medienpfade, Bezeichnungen, Urheber und Aufnahmezeit ändern.
3. Während der Bearbeitung prüfen:

   ```powershell
   .\scripts\monatscheck.ps1 -Monat 2026-09 -ArbeitsstandErlaubt
   ```

4. Änderungen einschließlich der neuen Medien in Git einchecken und zu GitHub übertragen.
5. Abschließend den vollständigen Freigabecheck ausführen:

   ```powershell
   .\scripts\monatscheck.ps1 -Monat 2026-09 -MitGitHub
   ```

Ohne `-ArbeitsstandErlaubt` gilt der Check nur bei einem vollständig sauberen
Git-Arbeitsstand als bestanden. So kann kein neues, aber noch nicht eingechecktes
Monatsmedium versehentlich als veröffentlichungsbereit gemeldet werden.
