import assert from "node:assert/strict";
import { access, readdir } from "node:fs/promises";
import { extname } from "node:path";
import test from "node:test";
import vm from "node:vm";
import { JSDOM } from "jsdom";
import { dateiLesen, projektWurzel } from "./helpers.mjs";

const htmlDateien = [
  "index.html",
  "docs/datenschutz.html",
  "docs/entwicklung.html",
  "docs/galerie.html",
  "docs/gesundheit.html",
  "docs/impressum.html",
  "docs/kalender.html",
  "docs/kontakt.html",
  "docs/service.html"
];

test("alle HTML-Seiten haben Grundstruktur, Titel und eindeutige IDs", async () => {
  for (const datei of htmlDateien) {
    const dom = new JSDOM(await dateiLesen(datei));
    const { document } = dom.window;
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);

    assert.equal(document.documentElement.lang, "de", `${datei}: Sprache`);
    assert.ok(document.title.trim(), `${datei}: Titel fehlt`);
    assert.ok(document.querySelector("main"), `${datei}: main fehlt`);
    assert.equal(new Set(ids).size, ids.length, `${datei}: doppelte ID`);
    dom.window.close();
  }
});

test("alle lokalen Links, Bilder, Stylesheets und Skripte verweisen auf vorhandene Dateien", async () => {
  const fehlend = [];

  for (const datei of htmlDateien) {
    const dom = new JSDOM(await dateiLesen(datei));
    const basis = new URL(datei, projektWurzel);

    for (const element of dom.window.document.querySelectorAll("[href], [src]")) {
      const referenz = element.getAttribute("href") || element.getAttribute("src");
      if (
        !referenz ||
        referenz.startsWith("#") ||
        /^(?:https?:|mailto:|tel:|data:)/i.test(referenz)
      ) {
        continue;
      }

      const ziel = new URL(referenz.split(/[?#]/, 1)[0], basis);
      try {
        await access(ziel);
      } catch {
        fehlend.push(`${datei}: ${referenz}`);
      }
    }
    dom.window.close();
  }

  assert.deepEqual(fehlend, []);
});

test("alle klassischen JavaScript-Dateien sind syntaktisch gültig", async () => {
  const dateien = (await readdir(new URL("js/", projektWurzel)))
    .filter((datei) => extname(datei) === ".js");

  for (const datei of dateien) {
    const quelltext = await dateiLesen(`js/${datei}`);
    assert.doesNotThrow(
      () => new vm.Script(quelltext, { filename: datei }),
      `${datei}: Syntaxfehler`
    );
  }
});

test("Galerie-Konfiguration passt zum vorhandenen Bildbestand", async () => {
  const dom = new JSDOM(await dateiLesen("docs/galerie.html"));
  const bilder = await readdir(new URL("bilder/", projektWurzel));
  const fehler = [];

  for (const galerie of dom.window.document.querySelectorAll(".automatische-galerie")) {
    const praefix = galerie.dataset.praefix;
    const vorhanden = bilder
      .map((name) => name.match(new RegExp(`^${praefix}(\\d+)\\.(?:jpe?g|png)$`, "i")))
      .filter(Boolean)
      .map((treffer) => Number(treffer[1]));
    const hoechsteVorhandeneNummer = vorhanden.length ? Math.max(...vorhanden) : 0;
    const bekannterBestand = Number(galerie.dataset.von);

    if (bekannterBestand < hoechsteVorhandeneNummer) {
      fehler.push(`${praefix}: data-von=${bekannterBestand}, vorhanden=${hoechsteVorhandeneNummer}`);
    }
  }

  assert.deepEqual(fehler, []);
  dom.window.close();
});
