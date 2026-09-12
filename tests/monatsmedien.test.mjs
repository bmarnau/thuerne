import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { JSDOM } from "jsdom";
import { dateiLesen } from "./helpers.mjs";

const monatsnamen = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

function projektdatei(relativerPfad) {
  return path.resolve(process.cwd(), decodeURIComponent(relativerPfad));
}

test("Bild und Film des Monats sind vollständig und konsistent gepflegt", async () => {
  const dom = new JSDOM(await dateiLesen("index.html"));
  const { document } = dom.window;
  const bereich = document.querySelector(".monatsmedien");
  assert.ok(bereich, "Der Bereich für die Monatsmedien fehlt.");

  const zeiten = [...bereich.querySelectorAll("time")];
  assert.equal(zeiten.length, 2, "Film und Bild benötigen jeweils eine Monatsangabe.");
  const monate = new Set(zeiten.map((element) => element.getAttribute("datetime")));
  assert.equal(monate.size, 1, "Film und Bild müssen demselben Monat zugeordnet sein.");

  const [monat] = monate;
  assert.match(monat, /^\d{4}-(0[1-9]|1[0-2])$/, "Der Monat muss im Format JJJJ-MM stehen.");
  if (process.env.MONATSCHECK_MONAT) {
    assert.equal(monat, process.env.MONATSCHECK_MONAT, "Die Webseite zeigt nicht den erwarteten Monat.");
  }

  const [jahr, monatsnummer] = monat.split("-").map(Number);
  const sichtbarerMonat = `${monatsnamen[monatsnummer - 1]} ${jahr}`;
  zeiten.forEach((element) => assert.equal(element.textContent.trim(), sichtbarerMonat));

  const video = bereich.querySelector("video.monatsmedium");
  const quelle = video?.querySelector("source");
  assert.ok(video && quelle, "Der Film des Monats fehlt.");
  assert.match(video.getAttribute("aria-label") ?? "", /Film des Monats: .+/);
  assert.equal(quelle.getAttribute("type"), "video/mp4");

  const filmPfad = quelle.getAttribute("src");
  assert.ok(filmPfad?.startsWith("medien/"), "Der Monatsfilm muss im Ordner medien liegen.");
  assert.ok(fs.statSync(projektdatei(filmPfad)).size > 0, "Die Filmdatei ist leer.");

  const bild = bereich.querySelector("img.monatsmedium");
  assert.ok(bild, "Das Bild des Monats fehlt.");
  assert.ok(bild.getAttribute("alt")?.trim(), "Das Monatsbild benötigt einen Alternativtext.");
  assert.ok(Number(bild.getAttribute("width")) > 0 && Number(bild.getAttribute("height")) > 0,
    "Das Monatsbild benötigt Breite und Höhe.");

  const bildPfad = bild.getAttribute("src");
  assert.ok(bildPfad?.startsWith("medien/"), "Das Monatsbild muss im Ordner medien liegen.");
  assert.ok(fs.statSync(projektdatei(bildPfad)).size > 0, "Die Bilddatei ist leer.");

  const texte = [...bereich.querySelectorAll("p, figcaption")].map((element) => element.textContent.trim());
  assert.ok(texte.some((text) => /Film:\s*\S/.test(text)), "Beim Film fehlt der Urheber.");
  assert.ok(texte.some((text) => /Foto:\s*\S/.test(text)), "Beim Bild fehlt der Urheber.");
  assert.ok(texte.filter((text) => text.includes(sichtbarerMonat)).length >= 2,
    "Aufnahmezeit und Monatsangabe passen nicht zusammen.");

  dom.window.close();
});
