import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

export const projektWurzel = new URL("../", import.meta.url);

export async function dateiLesen(pfad) {
  return readFile(new URL(pfad, projektWurzel), "utf8");
}

export async function seiteLaden(htmlPfad, scriptPfade = []) {
  const html = await dateiLesen(htmlPfad);
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: new URL(htmlPfad, "https://www.thuerne.de/").href
  });

  for (const scriptPfad of scriptPfade) {
    dom.window.eval(await dateiLesen(scriptPfad));
  }

  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded", {
    bubbles: true
  }));

  return dom;
}

export async function ereignisseVerarbeiten() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
