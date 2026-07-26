import assert from "node:assert/strict";
import test from "node:test";
import worker from "../cloudflare/worker.js";

function umgebung() {
  let datensatz = null;
  const DB = {
    prepare() {
      return {
        async first() {
          return datensatz;
        },
        bind(reihenfolge, aktualisiertAm) {
          return {
            async run() {
              datensatz = { reihenfolge, aktualisiert_am: aktualisiertAm };
            }
          };
        }
      };
    }
  };

  return {
    DB,
    ADMIN_TOKEN: "sichere-test-pin",
    ALLOWED_ORIGINS: "https://bmarnau.github.io,https://thuerne.de,https://www.thuerne.de"
  };
}

const api = "https://worker.example/api/galerie-reihenfolge";

test("Worker liest eine leere und eine gespeicherte Reihenfolge", async () => {
  const env = umgebung();
  let antwort = await worker.fetch(new Request(api), env);
  assert.equal(antwort.status, 200);
  assert.deepEqual((await antwort.json()).reihenfolge, []);

  antwort = await worker.fetch(
    new Request(api, {
      method: "PUT",
      headers: {
        Authorization: "Bearer sichere-test-pin",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reihenfolge: ["galerie-natur", "galerie-aktionen"] })
    }),
    env
  );
  assert.equal(antwort.status, 200);

  antwort = await worker.fetch(new Request(api), env);
  assert.deepEqual((await antwort.json()).reihenfolge, [
    "galerie-natur",
    "galerie-aktionen"
  ]);
});

test("Worker schützt Schreibzugriffe und validiert Nutzdaten", async () => {
  const env = umgebung();
  const schreiben = (token, body) =>
    worker.fetch(
      new Request(api, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }),
      env
    );

  assert.equal((await schreiben("falsch", { reihenfolge: ["ok"] })).status, 401);
  assert.equal(
    (await schreiben("sichere-test-pin", { reihenfolge: ["doppelt", "doppelt"] })).status,
    400
  );
  assert.equal(
    (await schreiben("sichere-test-pin", { reihenfolge: ["ungültige id"] })).status,
    400
  );
});

test("Worker setzt CORS nur für zugelassene Webseiten", async () => {
  const env = umgebung();

  for (const origin of [
    "https://bmarnau.github.io",
    "https://thuerne.de",
    "https://www.thuerne.de"
  ]) {
    const antwort = await worker.fetch(
      new Request(api, { method: "OPTIONS", headers: { Origin: origin } }),
      env
    );
    assert.equal(antwort.status, 204);
    assert.equal(antwort.headers.get("access-control-allow-origin"), origin);
  }

  const abgewiesen = await worker.fetch(
    new Request(api, { method: "OPTIONS", headers: { Origin: "https://example.org" } }),
    env
  );
  assert.equal(abgewiesen.status, 403);
});

test("Worker meldet falsche Pfade und Methoden korrekt", async () => {
  const env = umgebung();
  assert.equal(
    (await worker.fetch(new Request("https://worker.example/falsch"), env)).status,
    404
  );
  assert.equal(
    (await worker.fetch(new Request(api, { method: "POST" }), env)).status,
    405
  );
});
