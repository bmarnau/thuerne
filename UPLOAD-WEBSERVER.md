# Dateien für den Webserver

Stand: 3. August 2026

## Nur die Filmkorrektur veröffentlichen

Auf dem Webserver genau diese Datei überschreiben:

| Lokale Datei | Ziel auf dem Webserver |
| --- | --- |
| `bilder/dachs.mp4` | `/bilder/dachs.mp4` |

Die neue Datei verwendet H.264/AVC, AAC und YUV 4:2:0. Sie ist für die
Wiedergabe in üblichen Desktop- und Mobilbrowsern vorbereitet. Der Dateiname
und der Pfad bleiben unverändert; `index.html` muss für diese reine
Codec-Korrektur nicht erneut hochgeladen werden.

Nach dem Hochladen:

1. Prüfen, dass die Datei auf dem Server ungefähr 2,42 MB groß ist.
2. Die Startseite auf dem betroffenen Endgerät vollständig neu laden.
3. Falls weiterhin die alte Fassung erscheint, Browser- und gegebenenfalls
   Servercache leeren.

## Den gesamten aktuellen Website-Stand veröffentlichen

Wenn neben der Filmkorrektur auch alle aktuellen Seitenänderungen
veröffentlicht werden sollen, folgende Dateien mit gleicher Ordnerstruktur
kopieren:

```text
index.html
css/style.css
assets/icons/facebook.svg
assets/icons/instagram.svg
docs/datenschutz.html
docs/galerie.html
docs/gesundheit.html
docs/impressum.html
docs/kalender.html
docs/kontakt.html
docs/service.html
fonts/roboto-regular-latin.woff2
bilder/dachs.mp4
bilder/huhn.jpg
```

Nicht für den Webserver benötigt werden `tests/`, `package.json`,
`CHANGELOG.md`, `UPLOAD-WEBSERVER.md`, `licenses/` und der Ordner `preview/`.
