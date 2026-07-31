import assert from "node:assert/strict";
import test from "node:test";

const live = process.env.RUN_LIVE_TESTS === "true";
const seiten = [
  "https://www.thuerne.de/",
  "https://www.thuerne.de/docs/kalender.html",
  "https://www.thuerne.de/docs/kontakt.html",
  "https://www.thuerne.de/docs/service.html",
  "https://www.thuerne.de/docs/gesundheit.html",
  "https://www.thuerne.de/docs/galerie.html",
  "https://www.thuerne.de/docs/impressum.html",
  "https://www.thuerne.de/docs/datenschutz.html"
];
const api =
  "https://thuerne-galerie.broad-butterfly-074a.workers.dev/api/galerie-reihenfolge";

test("öffentliche Seiten sind erreichbar", { skip: !live }, async () => {
  for (const url of seiten) {
    const antwort = await fetch(url, { redirect: "follow" });
    assert.equal(antwort.status, 200, url);
    assert.match(antwort.headers.get("content-type") || "", /text\/html/i, url);
  }
});

test("öffentliche Galerie-API und CORS sind erreichbar", { skip: !live }, async () => {
  const get = await fetch(api, {
    headers: { Origin: "https://www.thuerne.de" },
    cache: "no-store"
  });
  assert.equal(get.status, 200);
  assert.ok(Array.isArray((await get.json()).reihenfolge));
  assert.equal(get.headers.get("access-control-allow-origin"), "https://www.thuerne.de");

  const fremd = await fetch(api, {
    method: "OPTIONS",
    headers: {
      Origin: "https://example.org",
      "Access-Control-Request-Method": "PUT"
    }
  });
  assert.equal(fremd.status, 403);
});
