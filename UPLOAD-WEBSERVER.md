# Dateien für den Webserver

Stand: 5. November 2026 (Commit `3c129af`, Branch `feature/adventsmarkt-2026`)

Der Webserver (Variomedia) wird von Hand bespielt. Dateien immer mit gleicher
Ordnerstruktur hochladen; bereits vorhandene Dateien werden überschrieben.

## Aktuelle Änderung hochladen (November 2026)

Geändert seit dem letzten Stand (`f7f930c`): Bild des Monats November,
Herbstwanderung als Rückblick mit Galerieabschnitt, neuer Galerieabschnitt
„Adventsmarkt“, Abschnitt „Wanderweg - Wääch jangs“ umbenannt, sieben Galeriebilder
in andere Abschnitte verschoben, Werbung für den 4. Thürne-Adventsmarkt
(Startfenster, Startseite, Serviceseite mit Flyer und PDF) und neue
Cache-Kennung (`?v=20261105`) auf allen Seiten.

```text
index.html
css/style.css
js/start-hinweis.js
docs/datenschutz.html
docs/entwicklung.html
docs/galerie.html
docs/gesundheit.html
docs/impressum.html
docs/kalender.html
docs/kontakt.html
docs/service.html
docs/adventsmarkt2026.pdf
bilder/adventsmarkt-2026-flyer.jpg
bilder/e5bild01.jpg
bilder/e5bild02.jpg
bilder/e5bild03.jpg
bilder/e5bild04.jpg
bilder/a6bild06.jpeg
bilder/a6bild07.jpeg
bilder/a6bild08.jpeg
bilder/a6bild09.jpeg
bilder/e4bild08.jpeg
bilder/a5bild01.jpg
bilder/e6bild01.jpeg
medien/maeusebussard.jpg
```

**Auf dem Server löschen** (die Bilder wurden verschoben: nach „Wanderweg - Wääch
jangs“ als `a6bild06` bis `a6bild09`, `e3bild02` nach „Aktivitäten“ als `e4bild08`,
`a2bild03` nach „Noch nicht zugeordnet“ als `a5bild01`,
`e4bild06` nach „Adventsmarkt“ als `e6bild01`; bleiben die alten
Dateien liegen, zeigt die Galerie sie weiterhin in ihren alten Abschnitten):

```text
bilder/e2bild01.jpeg
bilder/e3bild03.jpeg
bilder/e3bild05.jpeg
bilder/e3bild06.jpeg
bilder/e3bild02.jpeg
bilder/a2bild03.jpg
bilder/e4bild06.jpeg
```

## Gesamten Website-Stand veröffentlichen

Wenn unklar ist, was auf dem Server liegt, diese Ordner und Dateien vollständig
hochladen:

| Ordner / Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite |
| `docs/` | Unterseiten (`*.html`) und PDF-Dokumente |
| `css/` | `style.css`, `cookie.css`, `wartungsmenue.css` |
| `js/` | `script.js`, `start-hinweis.js`, `galerie.js`, `kalender.js`, `service.js`, `wartungsmenue.js` |
| `bilder/` | Galeriebilder (`a…bild…`, `e…bild…`), Flyer und weitere Bilder |
| `medien/` | Bild und Film des Monats |
| `assets/icons/` | Symbole für Facebook und Instagram |
| `fonts/` | lokale Schrift `roboto-regular-latin.woff2` |
| `images/` | weitere Seitenbilder |

## Nicht hochladen

Diese Dateien dienen nur der Pflege und Entwicklung:

```text
tests/
scripts/
cloudflare/
licenses/
node_modules/
.github/
.claude/
package.json
package-lock.json
_config.yml
.gitattributes
.gitignore
*.md   (README, CHANGELOG, CLAUDE, AGENTS, Anleitungen)
```

Auch unversionierte Dateien aus dem Arbeitsordner (zum Beispiel noch nicht
eingebundene `signal-…`-Fotos) gehören nicht auf den Server.

## Filme und Bilder

- Filme im Webformat H.264/AVC mit AAC-Ton und YUV 4:2:0 hochladen, damit sie in
  üblichen Desktop- und Mobilbrowsern laufen.
- Dateinamen exakt so übernehmen, wie sie in Git stehen (Groß-/Kleinschreibung und
  Leerzeichen, zum Beispiel `medien/Blinder Passagier.mp4`).

## Nach dem Hochladen

1. Startseite, Galerie und Serviceseite im Browser vollständig neu laden.
2. Prüfen, dass Bild und Film des Monats erscheinen und die Galerie den neuen
   Abschnitt zeigt.
3. Optional den Live-Test ausführen: `npm run test:live`.
4. Erscheint weiterhin der alte Stand, Browser- und gegebenenfalls Servercache
   leeren. Bei geänderten CSS- oder JavaScript-Dateien muss die Cache-Kennung
   (`?v=…`) in den HTML-Dateien erhöht worden sein.

## Diese Datei pflegen

Bei jeder Änderung, die auf den Server soll, den Abschnitt „Aktuelle Änderung
hochladen“ mit Datum, Commit und Dateiliste aktualisieren. Die Liste ergibt sich aus:

```powershell
git diff --name-only <letzter-hochgeladener-commit> HEAD
```
