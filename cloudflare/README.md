# Zentrale Galerie-Reihenfolge mit Cloudflare

Der Worker stellt `GET` und `PUT /api/galerie-reihenfolge` bereit. D1 speichert genau
eine aktuelle Reihenfolge. Schreibzugriffe benötigen das Cloudflare-Secret
`ADMIN_TOKEN`; das Kennwort gehört niemals in Git oder in eine HTML-Datei.

## Verwendete Werte

| Einstellung | Wert |
| --- | --- |
| Worker | `thuerne-galerie` |
| D1-Datenbank | `thuerne-galerie` |
| D1-Binding | `DB` |
| Variable | `ALLOWED_ORIGINS` |
| Erlaubte Origins | `https://bmarnau.github.io,https://thuerne.de,https://www.thuerne.de` |
| Secret | `ADMIN_TOKEN` |
| API-Pfad | `/api/galerie-reihenfolge` |
| Aktuelle API-Adresse | `https://thuerne-galerie.broad-butterfly-074a.workers.dev/api/galerie-reihenfolge` |

## Kontrolle und Einrichtung im Cloudflare-Dashboard

1. Unter **Storage & Databases > D1 SQL Database** muss die Datenbank
   `thuerne-galerie` vorhanden sein.
2. In `thuerne-galerie` unter **Console** muss die Tabelle mit folgendem SQL
   angelegt sein:

   ```sql
   CREATE TABLE IF NOT EXISTS galerie_reihenfolge (
     id INTEGER PRIMARY KEY CHECK (id = 1),
     reihenfolge TEXT NOT NULL CHECK (json_valid(reihenfolge)),
     aktualisiert_am TEXT NOT NULL
   );
   ```

3. Unter **Workers & Pages > Overview > thuerne-galerie > Bindings**
   muss ein D1-Binding mit dem Variablennamen `DB` auf `thuerne-galerie` zeigen.
4. Unter **Settings > Variables and Secrets** muss die normale Textvariable
   `ALLOWED_ORIGINS` den oben genannten Wert enthalten.
5. Im selben Menü muss `ADMIN_TOKEN` als Typ **Secret** hinterlegt sein.
6. Unter **Settings > Domains & Routes** muss die verwendete `workers.dev`-Adresse
   aktiv sein.

## Alternative Einrichtung mit Wrangler

Wenn die Datenbank neu angelegt werden muss:

```bash
npx wrangler login
cd cloudflare
npx wrangler d1 create thuerne-galerie --location weur
```

Danach die ausgegebene `database_id` in `wrangler.toml` eintragen und ausführen:

```bash
npx wrangler d1 migrations apply thuerne-galerie --remote
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

Die PIN wird bei `secret put` verdeckt abgefragt:

```text
npx wrangler secret put ADMIN_TOKEN
Enter a secret value: [PIN verdeckt eingeben]
```

## Verbindung zur Galerie

`docs/galerie.html` enthält die vollständige API-Adresse im Meta-Eintrag
`galerie-reihenfolge-api`. `js/galerie.js` verwendet diese Adresse unverändert.
Client und Worker verwenden dasselbe JSON-Format:

```json
{
  "reihenfolge": ["galerie-aktionen", "galerie-astronomie"]
}
```

Die PIN wird beim Speichern als Bearer-Token übertragen:

```text
Authorization: Bearer [ADMIN_TOKEN]
```

Sie wird nicht im Browser gespeichert.

## Lokaler Test

```bash
cd cloudflare
npx wrangler d1 migrations apply thuerne-galerie --local
echo "ADMIN_TOKEN=ein-langes-testkennwort" > .dev.vars
npx wrangler dev
```

Die lokale Datei `.dev.vars` wird durch `.gitignore` ausgeschlossen und darf
niemals committed werden.
