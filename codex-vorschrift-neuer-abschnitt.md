# Vorschrift für Codex: Neuen Galerieabschnitt anlegen

Diese Vorschrift gilt immer, wenn Codex gebeten wird, in der Bildergalerie
einen neuen Abschnitt anzulegen.

## Verbindliches Vorgehen

Codex muss:

1. zuerst den aktuellen lokalen Git-Stand mit `origin/main` abgleichen und
   vorhandene, nicht zum Auftrag gehörende Änderungen bewahren;
2. `docs/galerie.html`, `js/galerie.js`, `js/start-hinweis.js`, `index.html`,
   die Tests und die Projektdokumentation prüfen;
3. eine eindeutige Abschnitts-ID und den nächsten wirklich freien
   Bildnummernkreis verwenden;
4. den vollständigen Abschnitt in `docs/galerie.html` anlegen;
5. die sichtbare Zuordnung der Nummernkreise in `docs/galerie.html` ergänzen;
6. alle Bilder des neuen Abschnitts in `START_GALERIEGRUPPEN` in
   `js/start-hinweis.js` aufnehmen;
7. nach Änderungen an `js/start-hinweis.js` die Skriptversion in `index.html`
   erhöhen;
8. erforderliche automatische Tests ergänzen oder anpassen;
9. `npm test` und `npm run test:live` ausführen;
10. README, Changelog, Testbericht und Projektversion passend aktualisieren;
11. nur die zum Auftrag gehörenden Dateien committen und den geprüften Stand
    mit GitHub synchronisieren;
12. abschließend Branch, Commit, Version, Testresultate und geänderte Dateien
    nennen.

Codex darf keine vorhandene Abschnitts-ID und keinen vorhandenen
Bildnummernkreis wiederverwenden. Die Redaktions-PIN oder andere Zugangsdaten
dürfen niemals in HTML, JavaScript, Dokumentation oder Git gespeichert werden.

## Kopierbarer Auftrag an Codex

```text
Lege in der Bildergalerie einen neuen Abschnitt mit dem Namen
„[ABSCHNITTSNAME]“ an.

Art des Abschnitts: [Themengalerie oder Rückblick]
Bilder: [DATEINAMEN ODER BESCHREIBUNG]
Gewünschte Position: [POSITION]

Beachte vollständig die Datei
„codex-vorschrift-neuer-abschnitt.md“. Verwende eine eindeutige
Abschnitts-ID und den nächsten freien Bildnummernkreis. Ergänze die
Zuordnungsliste, den vollständigen Startbild-Pool, die Cache-Version,
die Tests und die Dokumentation. Teste lokal und live, versioniere die
Änderung und synchronisiere den geprüften Stand mit GitHub. Bewahre
fremde lokale Änderungen und speichere keine Zugangsdaten.
```

