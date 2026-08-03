import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { dateiLesen, ereignisseVerarbeiten, seiteLaden } from "./helpers.mjs";

test("Navigation, Cookie-Hinweis und Nach-oben-Schaltfläche funktionieren", async () => {
  // Der allgemeine Seitencode bleibt unabhängig vom redaktionellen Startfenster.
  const dom = await seiteLaden("index.html", ["js/script.js"]);
  const { document, Event } = dom.window;
  const menue = document.getElementById("menu");
  const menueSchalter = document.getElementById("menu-toggle");

  menueSchalter.click();
  assert.ok(menue.classList.contains("visible"));
  assert.equal(menueSchalter.getAttribute("aria-expanded"), "true");

  document.getElementById("cookie-accept").click();
  assert.equal(dom.window.localStorage.getItem("cookieAccepted"), "true");
  assert.ok(document.getElementById("cookie-banner").classList.contains("hidden"));

  const filmDesMonats = document.querySelector("video.monatsmedium");
  assert.equal(filmDesMonats.querySelector("source").getAttribute("src"), "bilder/dachs.mp4");
  assert.equal(filmDesMonats.querySelector("source").getAttribute("type"), "video/mp4");
  assert.equal(document.querySelector(".monatsfilm-platzhalter"), null);

  Object.defineProperty(dom.window, "scrollY", { configurable: true, value: 400 });
  dom.window.dispatchEvent(new Event("scroll"));
  assert.equal(document.getElementById("back-to-top").style.display, "block");
  dom.window.close();
});

test("Kalender wird erst nach Zustimmung eingebettet und wieder ausgeblendet", async () => {
  const dom = await seiteLaden("docs/kalender.html", ["js/kalender.js"]);
  const { document } = dom.window;
  const schalter = document.getElementById("kalender-laden");
  const container = document.getElementById("kalender-container");

  assert.equal(container.querySelector("iframe"), null);
  schalter.click();
  assert.ok(container.querySelector("iframe"));
  assert.equal(schalter.getAttribute("aria-expanded"), "true");
  assert.ok(!container.classList.contains("hidden"));

  schalter.click();
  assert.equal(schalter.getAttribute("aria-expanded"), "false");
  assert.ok(container.classList.contains("hidden"));
  dom.window.close();
});

test("Service-Padlets und Flyer lassen sich öffnen und schließen", async () => {
  const dom = await seiteLaden("docs/service.html", ["js/service.js"]);
  const { document, KeyboardEvent } = dom.window;

  document.getElementById("padlet-toggle").click();
  assert.ok(document.querySelector("#padlet-container iframe"));
  document.getElementById("padlet-toggle").click();
  assert.equal(document.querySelector("#padlet-container iframe"), null);

  document.getElementById("padlet-toggle2").click();
  assert.ok(document.querySelector("#padlet-container2 iframe"));

  document.getElementById("flyer").click();
  assert.equal(document.getElementById("flyerPopup").style.display, "flex");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  assert.equal(document.getElementById("flyerPopup").style.display, "none");
  dom.window.close();
});

test("Galerie lädt, sortiert, zeigt Beschriftungen und schützt das Speichern", async () => {
  const html = await dateiLesen("docs/galerie.html");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "https://www.thuerne.de/docs/galerie.html"
  });
  const { document } = dom.window;
  const abschnittIds = [...document.querySelectorAll(".galerie-ereignis")].map(({ id }) => id);
  const anfragen = [];

  dom.window.fetch = async (_url, optionen = {}) => {
    anfragen.push(optionen);
    if ((optionen.method || "GET") === "PUT") {
      return {
        ok: true,
        json: async () => ({
          gespeichert: true,
          aktualisiertAm: "2026-07-31T05:30:00.000Z"
        })
      };
    }
    return {
      ok: true,
      json: async () => ({
        reihenfolge: [...abschnittIds].reverse(),
        aktualisiertAm: "2026-07-31T05:00:00.000Z"
      })
    };
  };
  dom.window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  dom.window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };

  dom.window.eval(await dateiLesen("js/galerie.js"));
  assert.equal(
    document.getElementById("galerie-sortierung-speichern").disabled,
    true,
    "Speichern ist vor dem zentralen Laden nicht gesperrt"
  );
  await ereignisseVerarbeiten();
  await ereignisseVerarbeiten();

  assert.equal(
    document.querySelector(".galerie-ereignis").id,
    abschnittIds.at(-1),
    "zentrale Reihenfolge wurde nicht angewendet"
  );
  assert.equal(document.querySelectorAll("#galerie-sortierliste > li").length, abschnittIds.length);
  assert.equal(document.getElementById("galerie-sortierung-speichern").disabled, false);
  assert.match(
    document.getElementById("galerie-sortierung-status").textContent,
    /Zentrale Reihenfolge aktiv.*zuletzt geändert/i
  );

  const ersterTitel = document.querySelector("#galerie-sortierliste > li span").textContent;
  document.querySelector("#galerie-sortierliste > li button:nth-child(2)").click();
  assert.notEqual(
    document.querySelector("#galerie-sortierliste > li span").textContent,
    ersterTitel,
    "Pfeil nach unten hat die Reihenfolge nicht geändert"
  );

  const beschriftungen = document.getElementById("galerie-beschriftungen-schalter");
  beschriftungen.click();
  assert.equal(beschriftungen.getAttribute("aria-pressed"), "true");
  assert.equal(document.getElementById("galerie-nummernkreise").hidden, false);

  document.getElementById("galerie-sortierung-speichern").click();
  assert.equal(document.getElementById("galerie-speicherdialog").open, true);

  document.getElementById("galerie-redaktions-pin").value = "kurz";
  document.getElementById("galerie-speichern-bestaetigen").click();
  await ereignisseVerarbeiten();
  assert.match(document.getElementById("galerie-dialog-status").textContent, /mindestens acht/i);

  document.getElementById("galerie-redaktions-pin").value = "gueltige-test-pin";
  document.getElementById("galerie-speichern-bestaetigen").click();
  await ereignisseVerarbeiten();
  assert.equal(anfragen.filter(({ method }) => method === "PUT").length, 1);
  assert.match(document.getElementById("galerie-sortierung-status").textContent, /gespeichert/i);
  dom.window.close();
});

test("Galeriespeichern bleibt außerhalb der Live-Seite vollständig gesperrt", async () => {
  const html = await dateiLesen("docs/galerie.html");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "http://127.0.0.1:8765/docs/galerie.html"
  });
  const { document } = dom.window;
  let anfragen = 0;
  dom.window.fetch = async () => {
    anfragen += 1;
    return {
      ok: true,
      json: async () => ({
        reihenfolge: ["galerie-aktionen"],
        aktualisiertAm: "2026-07-31T05:00:00.000Z"
      })
    };
  };

  dom.window.eval(await dateiLesen("js/galerie.js"));
  await ereignisseVerarbeiten();

  assert.equal(anfragen, 0, "Vorschauseite hat den zentralen Speicher angesprochen");
  assert.equal(document.getElementById("galerie-sortierung-speichern").disabled, true);
  assert.match(document.getElementById("galerie-sortierung-status").textContent, /Vorschauseite/i);
  dom.window.close();
});
