import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { dateiLesen, ereignisseVerarbeiten, seiteLaden } from "./helpers.mjs";

test("Wartungsmenü enthält drei zugängliche Bereiche", async () => {
  const dom = await seiteLaden("index.html", ["js/wartungsmenue.js"]);
  const { document } = dom.window;
  const ausloeser = document.getElementById("wartungsmenue-oeffnen");
  const menue = document.getElementById("wartungsmenue");
  const tabs = [...menue.querySelectorAll('[role="tab"]')];
  const panels = [...menue.querySelectorAll('[role="tabpanel"]')];

  assert.ok(ausloeser);
  assert.equal(ausloeser.getAttribute("aria-controls"), "wartungsmenue");
  assert.equal(ausloeser.getAttribute("aria-expanded"), "false");
  assert.equal(menue.getAttribute("aria-hidden"), "true");
  assert.equal(tabs.length, 3);
  assert.equal(panels.length, 3);
  assert.ok(ausloeser.closest("footer"), "Wartungszugang liegt nicht im Footer");
  assert.match(
    document.getElementById("wartung-panel-verlauf").textContent,
    /Vorgeschichte[\s\S]*Git-dokumentierter Verlauf seit 02\.07\.2026/
  );
  assert.equal(document.querySelectorAll(".wartungsstatus-liste > li").length, 6);
  const infoLinks = [...document.querySelectorAll(".wartungsmenue-links a")];
  assert.equal(infoLinks.length, 3);
  assert.ok(infoLinks.every((link) => link.target === "_blank"));
  assert.ok(infoLinks.every((link) => link.rel.includes("noopener")));
  assert.ok(infoLinks.every((link) => link.rel.includes("noreferrer")));
  assert.deepEqual(
    tabs.map((tab) => tab.textContent.trim()),
    ["Orientierung", "Verlauf", "System"]
  );
  assert.ok(document.querySelector("#menu a"), "bestehende Navigation fehlt");
  dom.window.close();
});

test("Systemansicht prüft Worker und D1 einmalig und rein lesend", async () => {
  const dom = new JSDOM(await dateiLesen("index.html"), {
    runScripts: "outside-only",
    url: "https://www.thuerne.de/"
  });
  const { document } = dom.window;
  const anfragen = [];

  dom.window.fetch = async (url, optionen) => {
    anfragen.push({ url, optionen });
    if (url.includes("api.github.com/repos/bmarnau/thuerne/pulls?")) {
      return {
        ok: true,
        json: async () => ([{
          number: 6,
          url: "https://api.github.com/repos/bmarnau/thuerne/pulls/6"
        }])
      };
    }
    if (url.endsWith("/pulls/6")) {
      return {
        ok: true,
        json: async () => ({
          number: 6,
          draft: true,
          mergeable: true,
          html_url: "https://github.com/bmarnau/thuerne/pull/6"
        })
      };
    }
    return {
      ok: true,
      json: async () => ({ reihenfolge: ["galerie-aktionen"] })
    };
  };
  dom.window.eval(await dateiLesen("js/wartungsmenue.js"));
  document.dispatchEvent(new dom.window.Event("DOMContentLoaded", { bubbles: true }));

  document.getElementById("wartungsmenue-oeffnen").click();
  document.getElementById("wartung-tab-system").click();
  await ereignisseVerarbeiten();
  await ereignisseVerarbeiten();

  const workerAnfragen = anfragen.filter(({ url }) => url.includes("galerie-reihenfolge"));
  assert.equal(workerAnfragen.length, 1);
  assert.equal(workerAnfragen[0].optionen.method, "GET");
  assert.equal(workerAnfragen[0].optionen.cache, "no-store");
  assert.match(document.getElementById("wartungsstatus-worker-text").textContent, /D1-Antwort gültig/);
  assert.ok(
    document.querySelector("#wartungsstatus-worker .wartungsstatus-punkt")
      .classList.contains("wartungsstatus-gruen")
  );

  document.getElementById("wartung-tab-orientierung").click();
  document.getElementById("wartung-tab-system").click();
  await ereignisseVerarbeiten();
  assert.equal(
    anfragen.filter(({ url }) => url.includes("galerie-reihenfolge")).length,
    1,
    "Worker wurde mehrfach geprüft"
  );
  assert.match(
    document.getElementById("wartungsstatus-github-text").textContent,
    /1 offen, davon 1 Entwurf/
  );
  assert.ok(
    document.querySelector("#wartungsstatus-github .wartungsstatus-punkt")
      .classList.contains("wartungsstatus-gelb")
  );
  dom.window.close();
});

test("Wartungsmenü öffnet, wechselt Bereiche und schließt vollständig", async () => {
  const dom = await seiteLaden("index.html", ["js/wartungsmenue.js"]);
  const { document, KeyboardEvent } = dom.window;
  const ausloeser = document.getElementById("wartungsmenue-oeffnen");
  const menue = document.getElementById("wartungsmenue");
  const hintergrund = document.getElementById("wartungsmenue-hintergrund");

  ausloeser.click();
  assert.equal(menue.hidden, false);
  assert.equal(hintergrund.hidden, false);
  assert.equal(menue.getAttribute("aria-hidden"), "false");
  assert.equal(ausloeser.getAttribute("aria-expanded"), "true");
  assert.equal(document.activeElement.id, "wartungsmenue-schliessen");

  document.getElementById("wartung-tab-system").click();
  assert.equal(document.getElementById("wartung-tab-system").getAttribute("aria-selected"), "true");
  assert.equal(document.getElementById("wartung-panel-system").hidden, false);
  assert.equal(document.getElementById("wartung-panel-orientierung").hidden, true);

  document.dispatchEvent(new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true
  }));
  assert.equal(menue.hidden, true);
  assert.equal(ausloeser.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, ausloeser);

  ausloeser.click();
  hintergrund.click();
  assert.equal(menue.hidden, true);
  dom.window.close();
});

test("Pfeiltasten bedienen die Wartungsmenü-Reiter", async () => {
  const dom = await seiteLaden("index.html", ["js/wartungsmenue.js"]);
  const { document, KeyboardEvent } = dom.window;
  const ersterTab = document.getElementById("wartung-tab-orientierung");

  ersterTab.dispatchEvent(new KeyboardEvent("keydown", {
    key: "ArrowRight",
    bubbles: true,
    cancelable: true
  }));

  const verlaufTab = document.getElementById("wartung-tab-verlauf");
  assert.equal(verlaufTab.getAttribute("aria-selected"), "true");
  assert.equal(document.activeElement, verlaufTab);
  dom.window.close();
});
