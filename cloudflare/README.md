# Cloudflare-Konfiguration der Thürne-Galerie

Stand: 26. Juli 2026

Diese Dokumentation beschreibt den vollständigen, im Repository nachvollziehbaren
Soll-Stand und die öffentlich überprüfbaren Live-Einstellungen. Geheime Werte
werden absichtlich nicht dokumentiert.

## Zweck und Aufbau

Die öffentliche Galerie lädt und speichert die Reihenfolge ihrer Abschnitte über
einen Cloudflare Worker. Der Worker verwendet eine D1-Datenbank und speichert
genau eine aktuelle Reihenfolge.

```text
docs/galerie.html
  -> js/galerie.js
  -> Cloudflare Worker
  -> D1-Datenbank
```

## Übersicht aller Einstellungen

| Bereich | Einstellung | Wert / Status |
| --- | --- | --- |
| Cloudflare-Konto | `workers.dev`-Subdomain | `broad-butterfly-074a` |
| Worker | Name | `thuerne-galerie` |
| Worker | Quelldatei | `cloudflare/worker.js` |
| Worker | Kompatibilitätsdatum | `2026-07-25` |
| Worker | Öffentliche Adresse | `https://thuerne-galerie.broad-butterfly-074a.workers.dev` |
| Worker | `workers.dev` | aktiv; in `wrangler.toml` nicht ausdrücklich gesetzt, daher Cloudflare-Standard |
| Worker | Eigene Route/Domain | keine im Repository konfiguriert |
| Worker | Weitere Umgebungen | keine |
| Worker | Cron-Trigger | keine |
| Worker | KV-, R2- oder Durable-Object-Bindings | keine |
| API | Pfad | `/api/galerie-reihenfolge` |
| API | Vollständige Adresse | `https://thuerne-galerie.broad-butterfly-074a.workers.dev/api/galerie-reihenfolge` |
| API | Methoden | `GET`, `PUT`, `OPTIONS` |
| API | Cache | `Cache-Control: no-store` |
| D1 | Datenbankname | `thuerne-galerie` |
| D1 | Worker-Binding | `DB` |
| D1 | Datenbank-ID | im Repository noch nicht eingetragen |
| D1 | Migrationsordner | `cloudflare/migrations` |
| D1 | Migration | `0001_galerie_reihenfolge.sql` |
| Variable | `ALLOWED_ORIGINS` | `https://bmarnau.github.io,https://thuerne.de,https://www.thuerne.de` |
| Secret | `ADMIN_TOKEN` | als Cloudflare-Secret hinterlegt; Wert wird nicht dokumentiert |
| Frontend | API-Konfiguration | Meta-Eintrag `galerie-reihenfolge-api` in `docs/galerie.html` |
| Frontend | Client | `js/galerie.js` |

Die D1-Datenbank-ID steht in `cloudflare/wrangler.toml` momentan noch als
`D1-DATENBANK-ID-EINTRAGEN`. Ein erneutes Deployment mit Wrangler ist erst
reproduzierbar, nachdem die echte ID aus dem Cloudflare-Dashboard eingetragen
wurde. Die ID ist kein Kennwort, sie lässt sich jedoch ohne Zugriff auf das
Cloudflare-Konto nicht zuverlässig ermitteln.

## Cloudflare-Dashboard

### 1. Worker

Pfad:

```text
Workers & Pages
-> Overview
-> thuerne-galerie
```

Erforderlicher Stand:

- Workername: `thuerne-galerie`
- Produktions-URL:
  `https://thuerne-galerie.broad-butterfly-074a.workers.dev`
- `workers.dev` unter **Settings -> Domains & Routes** aktiviert
- keine zusätzliche Route für `thuerne.de` erforderlich; die Webseite ruft die
  Worker-URL direkt auf

### 2. D1-Datenbank und Binding

Pfad zur Datenbank:

```text
Storage & Databases
-> D1 SQL Database
-> thuerne-galerie
```

Pfad zum Worker-Binding:

```text
Workers & Pages
-> thuerne-galerie
-> Settings
-> Bindings
```

Erforderlicher Stand:

| Feld | Wert |
| --- | --- |
| Typ | D1 Database |
| Variablenname | `DB` |
| Datenbank | `thuerne-galerie` |

Der Worker greift im Code über `env.DB` auf dieses Binding zu.

### 3. Textvariable

Pfad:

```text
Workers & Pages
-> thuerne-galerie
-> Settings
-> Variables and Secrets
```

| Name | Typ | Wert |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | Text | `https://bmarnau.github.io,https://thuerne.de,https://www.thuerne.de` |

Die Einträge sind durch Kommas getrennt und enthalten keine abschließenden
Schrägstriche.

### 4. Secret

Im selben Menü muss vorhanden sein:

| Name | Typ | Wert |
| --- | --- | --- |
| `ADMIN_TOKEN` | Secret | geheime Redaktions-PIN; niemals in Git, HTML, JavaScript oder dieser Dokumentation speichern |

Der Wert eines Cloudflare-Secrets ist nach dem Speichern nicht wieder
auslesbar. Bei Verlust muss ein neuer Wert gesetzt und der Worker erneut
bereitgestellt werden.

## D1-Datenmodell

Die Migration `cloudflare/migrations/0001_galerie_reihenfolge.sql` legt folgende
Tabelle an:

```sql
CREATE TABLE IF NOT EXISTS galerie_reihenfolge (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  reihenfolge TEXT NOT NULL CHECK (json_valid(reihenfolge)),
  aktualisiert_am TEXT NOT NULL
);
```

Es gibt absichtlich nur den Datensatz mit `id = 1`.

| Spalte | Inhalt |
| --- | --- |
| `id` | immer `1` |
| `reihenfolge` | JSON-Array der Galerie-Abschnitts-IDs |
| `aktualisiert_am` | Zeitpunkt der letzten Speicherung als ISO-Zeitstempel |

## API-Verhalten

### Reihenfolge lesen

```http
GET /api/galerie-reihenfolge
```

Beispielantwort:

```json
{
  "reihenfolge": ["galerie-aktionen", "galerie-astronomie"],
  "aktualisiertAm": "2026-07-26T13:50:51.849Z"
}
```

Ein leerer Speicher liefert ein leeres Array und `aktualisiertAm: null`.

### Reihenfolge speichern

```http
PUT /api/galerie-reihenfolge
Authorization: Bearer [ADMIN_TOKEN]
Content-Type: application/json
```

Anfrage:

```json
{
  "reihenfolge": ["galerie-aktionen", "galerie-astronomie"]
}
```

Erfolgsantwort:

```json
{
  "gespeichert": true,
  "aktualisiertAm": "2026-07-26T13:50:51.849Z"
}
```

### Validierung und Schutz

- Schreibzugriffe benötigen den Bearer-Token `ADMIN_TOKEN`.
- Der Token wird im Worker über SHA-256-Digests zeitkonstant verglichen.
- Der Request-Body darf höchstens 10.000 Zeichen groß sein.
- Die Reihenfolge darf höchstens 100 IDs enthalten.
- IDs dürfen nur Buchstaben, Ziffern, Unterstriche und Bindestriche enthalten.
- Doppelte IDs werden abgelehnt.
- Die PIN wird im Browser nur für den einzelnen Speichervorgang verwendet und
  nicht lokal gespeichert.

### HTTP-Statuscodes

| Status | Bedeutung |
| --- | --- |
| `200` | Lesen oder Speichern erfolgreich |
| `204` | CORS-Preflight erfolgreich |
| `400` | ungültiges JSON oder ungültige Reihenfolge |
| `401` | ADMIN_TOKEN fehlt oder ist falsch |
| `403` | aufrufender Ursprung ist nicht erlaubt |
| `404` | falscher API-Pfad |
| `405` | nicht unterstützte HTTP-Methode |
| `413` | Anfrage ist zu groß |

## CORS-Einstellungen

Zugelassene Webseiten:

```text
https://bmarnau.github.io
https://thuerne.de
https://www.thuerne.de
```

Antwort-Header bei einem erlaubten Ursprung:

```text
Access-Control-Allow-Origin: [aufrufender erlaubter Ursprung]
Access-Control-Allow-Methods: GET, PUT, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
Vary: Origin
```

Ein nicht zugelassener Ursprung erhält beim Preflight den Status `403`.

## Verbindung mit der Webseite

`docs/galerie.html` enthält die vollständige API-Adresse:

```html
<meta
  name="galerie-reihenfolge-api"
  content="https://thuerne-galerie.broad-butterfly-074a.workers.dev/api/galerie-reihenfolge"
/>
```

`js/galerie.js` liest diesen Meta-Eintrag. Worker und Webseite verwenden
einheitlich das JSON-Feld `reihenfolge`.

## Reproduzierbare Einrichtung mit Wrangler

Voraussetzungen:

- Anmeldung am richtigen Cloudflare-Konto
- echte D1-Datenbank-ID in `cloudflare/wrangler.toml`
- `ADMIN_TOKEN` als Cloudflare-Secret

Anmelden und Konto prüfen:

```bash
npx wrangler login
npx wrangler whoami
```

Datenbank nur dann neu erstellen, wenn sie noch nicht existiert:

```bash
cd cloudflare
npx wrangler d1 create thuerne-galerie --location weur
```

Die ausgegebene `database_id` anschließend in `wrangler.toml` eintragen.
Die tatsächliche Datenbankregion des bestehenden Live-Systems muss im
Cloudflare-Dashboard geprüft werden; `weur` ist hier nur die vorgesehene
Erstellungsoption.

Migrationen und Secret:

```bash
npx wrangler d1 migrations list thuerne-galerie --remote
npx wrangler d1 migrations apply thuerne-galerie --remote
npx wrangler secret put ADMIN_TOKEN
```

`wrangler secret put` fragt den Wert verdeckt ab und stellt eine neue
Worker-Version bereit. Danach:

```bash
npx wrangler deploy
```

## Lokale Entwicklung

```bash
cd cloudflare
npx wrangler d1 migrations apply thuerne-galerie --local
npx wrangler dev
```

Für lokale Tests kann im Ordner `cloudflare` eine nicht versionierte
`.dev.vars` verwendet werden:

```text
ADMIN_TOKEN=ein-langes-testkennwort
```

`.dev.vars` und `.env` dürfen niemals committed werden.

## Prüfung nach Änderungen

1. Öffentliche Galerie laden.
2. Prüfen, dass die gespeicherte Reihenfolge auf einem zweiten Browser oder
   Endgerät übernommen wird.
3. Speichern mit der richtigen PIN testen.
4. Speichern mit einer falschen PIN muss fehlschlagen.
5. Browser-Konsole auf CORS- oder Netzwerkfehler prüfen.
6. API ohne Browser testen:

   ```bash
   curl -i \
     -H "Origin: https://www.thuerne.de" \
     https://thuerne-galerie.broad-butterfly-074a.workers.dev/api/galerie-reihenfolge
   ```

## Live-Prüfung vom 26. Juli 2026

Öffentlich bestätigt:

- API antwortet auf `GET` mit Status `200`.
- Eine gespeicherte Reihenfolge ist in D1 vorhanden.
- `Cache-Control: no-store` ist aktiv.
- Preflight für `https://bmarnau.github.io`: `204`, CORS erlaubt.
- Preflight für `https://thuerne.de`: `204`, CORS erlaubt.
- Preflight für `https://www.thuerne.de`: `204`, CORS erlaubt.
- Preflight für einen fremden Ursprung: `403`.
- Das Speichern über die Galerie wurde vom Betreiber als funktionierend
  bestätigt.

Nicht öffentlich prüfbar:

- Cloudflare-Konto-ID
- echte D1-Datenbank-ID
- Wert des `ADMIN_TOKEN`
- D1-Region
- Dashboard-Einstellungen für Protokolle und Observability

Diese Werte müssen nach einer Anmeldung am Cloudflare-Konto kontrolliert werden.

## Noch zu erledigen

1. Im Cloudflare-Dashboard die ID der bestehenden D1-Datenbank
   `thuerne-galerie` kopieren.
2. Den Platzhalter `D1-DATENBANK-ID-EINTRAGEN` in
   `cloudflare/wrangler.toml` durch diese ID ersetzen.
3. Danach `npx wrangler deploy --dry-run` ausführen.
4. Erst nach erfolgreicher Prüfung wieder produktiv deployen.

## Offizielle Cloudflare-Dokumentation

- [Wrangler-Konfiguration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Worker-Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [workers.dev-Routen](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [D1-Binding-API](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [D1-Migrationen](https://developers.cloudflare.com/d1/reference/migrations/)
