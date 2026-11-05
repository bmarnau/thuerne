---
description: Lokale Tests und Monatsmedien-Test ausführen und kurz berichten
---

Prüfe den aktuellen Stand der Thürne-Website, ohne Dateien zu ändern.

1. `git status -sb` ausführen und Branch sowie offene Änderungen nennen.
2. `npm test` ausführen.
3. `npm run test:month` ausführen.
4. Wenn `$ARGUMENTS` das Wort `live` enthält, zusätzlich `npm run test:live`
   ausführen (liest nur die öffentliche Seite und API, verändert nichts).

Bericht auf Deutsch, kurz:
- Ergebnis zuerst: bestanden / fehlgeschlagen mit Anzahl (bestanden, fehlgeschlagen,
  übersprungen).
- Bei Fehlern: welcher Test, welche Meldung, welche Datei vermutlich betroffen ist
  und ein Vorschlag zur Behebung. Nichts ohne Rückfrage reparieren.
