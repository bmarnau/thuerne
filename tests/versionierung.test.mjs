import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { dateiLesen } from "./helpers.mjs";

const htmlDateien = [
  "index.html",
  "docs/datenschutz.html",
  "docs/galerie.html",
  "docs/gesundheit.html",
  "docs/impressum.html",
  "docs/kalender.html",
  "docs/kontakt.html",
  "docs/service.html"
];

function regulaererAusdruckText(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("Projektversion ist in Paketdateien, README und Wartungshilfe synchron", async () => {
  const paket = JSON.parse(await dateiLesen("package.json"));
  const sperrdatei = JSON.parse(await dateiLesen("package-lock.json"));
  const readme = await dateiLesen("README.md");
  const startseite = await dateiLesen("index.html");
  const version = regulaererAusdruckText(paket.version);

  assert.equal(sperrdatei.version, paket.version);
  assert.equal(sperrdatei.packages[""].version, paket.version);
  assert.match(readme, new RegExp(`Aktuelle Version:\\*\\* ${version}`));
  assert.match(startseite, new RegExp(`<dt>Version</dt><dd>${version}</dd>`));
});

test("alle lokalen Stylesheets und Skripte verwenden die zentrale Cache-Kennung", async () => {
  const paket = JSON.parse(await dateiLesen("package.json"));
  const erwarteteVersion = paket.siteMetadata.cacheVersion;
  const fehler = [];

  for (const datei of htmlDateien) {
    const dom = new JSDOM(await dateiLesen(datei));
    const elemente = dom.window.document.querySelectorAll(
      'link[rel="stylesheet"][href], script[src]'
    );

    for (const element of elemente) {
      const referenz = element.getAttribute("href") || element.getAttribute("src");
      if (/^(?:https?:|data:)/i.test(referenz)) continue;

      const url = new URL(referenz, "https://www.thuerne.de/");
      assert.ok(
        /\.(?:css|js)$/i.test(url.pathname),
        `${datei}: unerwartete lokale Ressource ${referenz}`
      );
      if (url.searchParams.get("v") !== erwarteteVersion) {
        fehler.push(`${datei}: ${referenz}`);
      }
    }
    dom.window.close();
  }

  assert.deepEqual(fehler, []);
});

test("Arbeits- und Dokumentationsstand entsprechen den zentralen Metadaten", async () => {
  const paket = JSON.parse(await dateiLesen("package.json"));
  const readme = await dateiLesen("README.md");
  const changelog = await dateiLesen("CHANGELOG.md");
  const entwicklerLeitfaden = await dateiLesen("docs/entwicklung.html");
  const datumDeutsch = paket.siteMetadata.documentationDate.split("-").reverse().join(".");

  assert.match(changelog, /## \[Unreleased\]/);
  assert.match(readme, /Arbeitsstand:\*\* Unreleased/);
  assert.match(readme, new RegExp(`Dokumentationsstand ${regulaererAusdruckText(datumDeutsch)}`));
  assert.match(
    entwicklerLeitfaden,
    new RegExp(`Dokumentationsstand: ${regulaererAusdruckText(datumDeutsch)}`)
  );
});
