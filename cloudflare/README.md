# Zentrale Galerie-Reihenfolge mit Cloudflare

Der Worker stellt `GET` und `PUT /api/galerie-reihenfolge` bereit. D1 speichert genau
eine aktuelle Reihenfolge. Schreibzugriffe benötigen das Cloudflare-Secret
`ADMIN_TOKEN`; das Kennwort gehört niemals in Git oder in eine HTML-Datei.

## Einmalige Einrichtung

1. Bei Cloudflare anmelden und im Projektordner ausführen:

   ```bash
   npx wrangler login
   cd cloudflare
   npx wrangler d1 create thuerne-galerie --location weur
   ```

2. Die ausgegebene `database_id` in `wrangler.toml` eintragen.
3. In `wrangler.toml` `ALLOWED_ORIGINS` auf die öffentliche Website setzen.
4. Datenbank und Administrator-Kennwort einrichten:

   ```bash
   npx wrangler d1 migrations apply thuerne-galerie --remote
   npx wrangler secret put ADMIN_TOKEN
   npx wrangler deploy
   ```

5. Im Cloudflare-Dashboard eine Route für den Worker anlegen:
   `DEINE-DOMAIN.DE/api/galerie-reihenfolge*`.
6. In `docs/galerie.html` prüfen, dass der Meta-Eintrag
   `galerie-reihenfolge-api` auf `/api/galerie-reihenfolge` zeigt.

Bei einer separaten `workers.dev`-Adresse muss im Meta-Eintrag stattdessen die
vollständige HTTPS-Adresse stehen. `ALLOWED_ORIGINS` muss dann weiterhin die
Origin der Website enthalten.

## Lokaler Test

```bash
cd cloudflare
npx wrangler d1 migrations apply thuerne-galerie --local
echo "ADMIN_TOKEN=ein-langes-testkennwort" > .dev.vars
npx wrangler dev
```

Die lokale Datei `.dev.vars` wird durch `.gitignore` ausgeschlossen und darf
niemals committed werden.
