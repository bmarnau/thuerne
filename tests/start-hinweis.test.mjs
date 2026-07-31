import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";
import { dateiLesen, projektWurzel } from "./helpers.mjs";

/*
  Diese Hilfsfunktion lädt nur das neutrale HTML und das Startfenster-Skript.
  Das Testdatum wird anschließend ausdrücklich übergeben, damit die Tests auch
  nach dem echten Veranstaltungsdatum unverändert funktionieren.
*/
async function startseiteVorbereiten({ startbildAktiv = true } = {}) {
  const dom = new JSDOM(await dateiLesen("index.html"), {
    runScripts: "outside-only",
    url: "https://www.thuerne.de/index.html"
  });
  const dialog = dom.window.document.getElementById("start-hinweis");

  // JSDOM zeichnet den Dialogzustand nach, ohne ein sichtbares Fenster zu öffnen.
  dialog.showModal = function showModal() {
    this.open = true;
  };
  dialog.close = function close() {
    this.open = false;
  };

  /*
    Für den Ausschalttest wird ausschließlich im Arbeitsspeicher eine zweite
    Schalterstellung erzeugt. Die Projektdatei selbst bleibt dabei unverändert.
  */
  const startHinweisQuelltext = (await dateiLesen("js/start-hinweis.js")).replace(
    "const STARTBILD_AKTIV = true;",
    `const STARTBILD_AKTIV = ${startbildAktiv};`
  );
  dom.window.eval(startHinweisQuelltext);
  return dom;
}

test("redaktioneller Schalter kann das Startbild vollständig ausschalten", async () => {
  const dom = await startseiteVorbereiten({ startbildAktiv: false });
  const ergebnis = dom.window.StartHinweis.initialisieren();
  const dialog = dom.window.document.getElementById("start-hinweis");

  assert.equal(dom.window.StartHinweis.startbildAktiv, false);
  assert.equal(ergebnis.typ, "deaktiviert");
  assert.equal(dialog.open, false);
  assert.equal(dialog.dataset.initialisiert, "deaktiviert");
  assert.equal(dom.window.localStorage.length, 0);
  dom.window.close();
});

test("Startbild-Pool enthält den vollständigen nummerierten Galeriebestand", async () => {
  const dom = await startseiteVorbereiten();
  const vorhandeneGaleriebilder = (await readdir(new URL("bilder/", projektWurzel)))
    .filter((datei) => /^[ae]\d+bild\d+\.(?:jpe?g|png)$/i.test(datei))
    .map((datei) => `bilder/${datei}`)
    .sort();
  const startbildPool = [...dom.window.StartHinweis.galeriebilder].sort();

  // Der exakte Mengenvergleich erkennt neue, fehlende und doppelte Einträge.
  assert.deepEqual(startbildPool, vorhandeneGaleriebilder);
  assert.equal(new Set(startbildPool).size, startbildPool.length);
  assert.equal(startbildPool.length, 42);
  dom.window.close();
});

test("vor Veranstaltungsbeginn erscheint die zeitlich nächste Einladung", async () => {
  const dom = await startseiteVorbereiten();
  const ergebnis = dom.window.StartHinweis.initialisieren({
    jetzt: new Date("2026-08-01T17:59:59+02:00")
  });
  const { document } = dom.window;

  assert.equal(ergebnis.typ, "veranstaltung");
  assert.equal(document.getElementById("start-hinweis").open, true);
  assert.equal(document.getElementById("start-hinweis-titel").textContent, "Italienischer Abend 2026");
  assert.equal(
    document.getElementById("start-hinweis-bild").getAttribute("src"),
    "bilder/italienischer-abend-popup.png"
  );
  assert.match(document.getElementById("start-hinweis-link").href, /service\.html#italienischer-abend$/);
  dom.window.close();
});

test("ab Veranstaltungsbeginn erscheint ein Galeriebild statt der Einladung", async () => {
  const dom = await startseiteVorbereiten();
  const ergebnis = dom.window.StartHinweis.initialisieren({
    jetzt: new Date("2026-08-01T18:00:00+02:00"),
    zufall: () => 0
  });
  const { document } = dom.window;

  assert.equal(ergebnis.typ, "galerie");
  assert.equal(
    document.getElementById("start-hinweis-titel").textContent,
    "Willkommen in unserer Dörfergemeinschaft"
  );
  assert.match(document.getElementById("start-hinweis-link").href, /docs\/galerie\.html$/);
  assert.match(document.getElementById("start-hinweis-bild").getAttribute("src"), /^bilder\//);
  dom.window.close();
});

test("zwei aufeinanderfolgende Starts wählen unterschiedliche Galeriebilder", async () => {
  const dom = await startseiteVorbereiten();
  const { document } = dom.window;
  const optionen = {
    jetzt: new Date("2026-08-02T12:00:00+02:00"),
    zufall: () => 0
  };

  dom.window.StartHinweis.initialisieren(optionen);
  const erstesBild = document.getElementById("start-hinweis-bild").getAttribute("src");

  // Simuliert einen neuen Seitenstart mit erhaltenem localStorage.
  document.getElementById("start-hinweis").dataset.initialisiert = "false";
  dom.window.StartHinweis.initialisieren(optionen);
  const zweitesBild = document.getElementById("start-hinweis-bild").getAttribute("src");

  assert.notEqual(zweitesBild, erstesBild);
  dom.window.close();
});

test("Bildfehler führen zu Reservebildern und nie zu einem leeren Fenster", async () => {
  const dom = await startseiteVorbereiten();
  const { document, Event } = dom.window;
  dom.window.StartHinweis.initialisieren({
    jetzt: new Date("2026-08-02T12:00:00+02:00"),
    zufall: () => 0
  });

  const bild = document.getElementById("start-hinweis-bild");
  // Der vollständige konfigurierte Pool schlägt nacheinander fehl.
  for (let index = 0; index < dom.window.StartHinweis.galeriebilder.length; index += 1) {
    bild.dispatchEvent(new Event("error"));
  }

  assert.equal(bild.hidden, true);
  assert.match(document.getElementById("start-hinweis-beschreibung").textContent, /nicht geladen/i);
  assert.ok(document.getElementById("start-hinweis-titel").textContent.trim());
  dom.window.close();
});

test("Schaltfläche und abgedunkelter Hintergrund schließen das Startfenster", async () => {
  const dom = await startseiteVorbereiten();
  const { document, MouseEvent } = dom.window;
  const dialog = document.getElementById("start-hinweis");

  dom.window.StartHinweis.initialisieren({
    jetzt: new Date("2026-07-30T12:00:00+02:00")
  });
  document.querySelector(".start-hinweis-schliessen").click();
  assert.equal(dialog.open, false);

  dialog.open = true;
  dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  assert.equal(dialog.open, false);
  dom.window.close();
});

test("responsive CSS begrenzt Startfenster und Bild in Breite und Höhe", async () => {
  const css = await dateiLesen("css/style.css");

  // Diese Regeln sichern insbesondere kleine Geräte und das Querformat ab.
  assert.match(css, /\.start-hinweis\s*\{[^}]*max-height:\s*calc\(100dvh - 2rem\)/s);
  assert.match(css, /\.start-hinweis-bild\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(css, /@media \(orientation:\s*landscape\) and \(max-height:\s*600px\)/);
});
