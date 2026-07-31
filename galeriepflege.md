# Redaktionelle Anweisung: Galerieabschnitte pflegen

Stand: Projektversion 1.1.0

## Namen eines vorhandenen Abschnitts ändern

1. In `docs/galerie.html` im gewünschten Abschnitt nur den Text zwischen
   `<h2>` und `</h2>` ändern.

   ```html
   <h2>Neuer Abschnittsname</h2>
   ```

2. Oben in derselben Datei unter **„Zuordnung der Nummernkreise“** den
   sichtbaren Namen ebenfalls ändern.

   ```html
   <li><span>Neuer Abschnittsname</span><code>a2bild01, a2bild02 …</code></li>
   ```

3. Die `id` des Abschnitts und `data-praefix` nicht ändern. Diese Werte
   verbinden den Abschnitt mit der gespeicherten Reihenfolge und seinen
   Bilddateien.

4. Falls die Bilder auch im Startfenster erscheinen, in
   `js/start-hinweis.js` bei der passenden Gruppe den Text `bildAlt`
   entsprechend anpassen.

5. Danach `npm test` ausführen und die Galerie im Browser prüfen.

## Neuen Abschnitt anlegen

1. Zuerst einen freien Nummernkreis festlegen:

   - `a...` für eine Themengalerie, zum Beispiel `a7bild`
   - `e...` für eine Veranstaltung, zum Beispiel `e5bild`

   Ein vorhandener Nummernkreis darf nicht nochmals verwendet werden.

2. Die Bilder im Ordner `bilder/` fortlaufend benennen:

   ```text
   a7bild01.jpg
   a7bild02.jpg
   a7bild03.png
   ```

   Erlaubte Dateiendungen sind `.jpg`, `.jpeg` und `.png`.

3. In `docs/galerie.html` einen passenden vorhandenen Abschnitt vollständig
   kopieren und anpassen.

   ```html
   <section class="galerie-ereignis galerie-thema" id="galerie-neuer-abschnitt">
     <p class="seiten-kategorie">Themengalerie</p>
     <h2>Neuer Abschnitt</h2>
     <div
       class="galerie-grid automatische-galerie"
       data-praefix="a7bild"
       data-von="3"
       data-bis="1"
       data-stellen="2"></div>
     <p class="galerie-leer">Noch keine Fotos vorhanden.</p>
   </section>
   ```

   Dabei gilt:

   - `id` muss eindeutig sein und darf keine Leerzeichen enthalten.
   - `data-praefix` muss dem neuen Nummernkreis entsprechen.
   - `data-von` enthält die höchste bereits vorhandene Bildnummer.
   - `data-bis="1"` und `data-stellen="2"` bleiben bestehen.
   - Für eine Veranstaltung kann `galerie-thema` entfallen und
     `Rückblick` statt `Themengalerie` verwendet werden.

4. Den neuen Namen und Nummernkreis oben unter
   **„Zuordnung der Nummernkreise“** ergänzen.

5. Alle neuen Bilder in `js/start-hinweis.js` unter
   `START_GALERIEGRUPPEN` als neue Gruppe eintragen. Dadurch gehören sie zum
   vollständigen Zufallspool des Startfensters.

6. Nach einer Änderung an `js/start-hinweis.js` in `index.html` die
   Versionsangabe hinter dem Skriptnamen erhöhen:

   ```html
   <script defer src="js/start-hinweis.js?v=NEUER-WERT"></script>
   ```

7. Tests ausführen:

   ```bash
   npm test
   npm run test:live
   ```

8. Die Galerie im Browser prüfen. Die gewünschte Position kann anschließend
   über **„Reihenfolge der Abschnitte“** mit der Redaktions-PIN gespeichert
   werden. Eine neue Abschnitts-ID wird automatisch in die vorhandene
   Reihenfolge aufgenommen.

## Abschlusskontrolle

- Überschrift und Zuordnungsliste stimmen überein.
- Abschnitts-ID und Bildpräfix sind eindeutig.
- Alle Bilddateien sind richtig geschrieben und nummeriert.
- Der Startbild-Pool enthält alle neuen Galeriebilder.
- Die Skriptversion in `index.html` wurde erhöht.
- Lokale Tests und Live-Tests sind erfolgreich.
- Dokumentation, Versionsnummer und Changelog wurden bei einer
  Veröffentlichung aktualisiert.

