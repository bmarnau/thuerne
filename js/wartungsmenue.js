document.addEventListener("DOMContentLoaded", () => {
  const ausloeser = document.getElementById("wartungsmenue-oeffnen");
  const menue = document.getElementById("wartungsmenue");
  const hintergrund = document.getElementById("wartungsmenue-hintergrund");
  const schliessen = document.getElementById("wartungsmenue-schliessen");

  if (!ausloeser || !menue || !hintergrund || !schliessen) return;

  const tabs = [...menue.querySelectorAll('[role="tab"]')];
  const systemPanel = document.getElementById("wartung-panel-system");
  const workerStatus = document.getElementById("wartungsstatus-worker");
  const workerStatusText = document.getElementById("wartungsstatus-worker-text");
  const githubStatus = document.getElementById("wartungsstatus-github");
  const githubStatusText = document.getElementById("wartungsstatus-github-text");
  const githubStatusLink = document.getElementById("wartungsstatus-github-link");
  const aufgabenStatus = document.getElementById("wartungsaufgaben-status");
  const aufgabenListe = document.getElementById("wartungsaufgaben-liste");
  let workerPruefungGestartet = false;
  let githubPruefungGestartet = false;
  let aufgabenPruefungGestartet = false;
  const fokusElementeSelektor = [
    "button:not([disabled])",
    "a[href]",
    "summary",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  function tabAktivieren(tab, fokusSetzen = false) {
    tabs.forEach((eintrag) => {
      const aktiv = eintrag === tab;
      eintrag.setAttribute("aria-selected", String(aktiv));
      eintrag.tabIndex = aktiv ? 0 : -1;
      const panel = document.getElementById(eintrag.getAttribute("aria-controls"));
      if (panel) panel.hidden = !aktiv;
    });

    if (fokusSetzen) tab.focus();

    if (tab.id === "wartung-tab-system") {
      workerPruefen();
      githubPruefen();
      wartungsaufgabenLaden();
    }
  }

  function aufgabenFarbe(labels) {
    const namen = labels.map((label) => label.name.toLowerCase());
    if (namen.some((name) => /kritisch|critical|blocker|security|bug/.test(name))) return "rot";
    if (namen.some((name) => /hoch|high|wichtig|priority/.test(name))) return "gelb";
    return "grau";
  }

  function wartungsaufgabeDarstellen(issue) {
    const eintrag = document.createElement("li");
    const punkt = document.createElement("i");
    const inhalt = document.createElement("div");
    const link = document.createElement("a");
    const meta = document.createElement("span");
    const labels = document.createElement("span");
    const farbe = aufgabenFarbe(issue.labels || []);

    punkt.className = `wartungsstatus-${farbe}`;
    punkt.setAttribute("aria-label", farbe === "rot" ? "Dringend" : farbe === "gelb" ? "Wichtig" : "Normal");
    inhalt.className = "wartungsaufgaben-inhalt";
    link.href = issue.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = issue.title;
    meta.className = "wartungsaufgaben-meta";
    meta.textContent = `Issue #${issue.number} · aktualisiert ${new Date(issue.updated_at).toLocaleDateString("de-DE")}`;
    labels.className = "wartungsaufgaben-labels";

    (issue.labels || []).slice(0, 3).forEach((label) => {
      const marke = document.createElement("span");
      marke.textContent = label.name;
      labels.append(marke);
    });

    inhalt.append(link, meta);
    if (labels.childElementCount) inhalt.append(labels);
    eintrag.append(punkt, inhalt);
    return eintrag;
  }

  async function wartungsaufgabenLaden() {
    if (
      aufgabenPruefungGestartet ||
      !systemPanel ||
      !aufgabenStatus ||
      !aufgabenListe ||
      typeof window.fetch !== "function"
    ) return;

    aufgabenPruefungGestartet = true;
    aufgabenStatus.textContent = "Offene Wartungsaufgaben werden geladen …";

    try {
      const antwort = await window.fetch(systemPanel.dataset.githubIssuesUrl, {
        method: "GET",
        cache: "no-store"
      });
      if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);

      const ergebnisse = await antwort.json();
      if (!Array.isArray(ergebnisse)) throw new Error("Antwortformat ungültig");

      const issues = ergebnisse
        .filter((eintrag) => !eintrag.pull_request)
        .sort((a, b) => {
          const farben = { rot: 0, gelb: 1, grau: 2 };
          return farben[aufgabenFarbe(a.labels || [])] - farben[aufgabenFarbe(b.labels || [])];
        });

      aufgabenListe.replaceChildren();
      if (!issues.length) {
        aufgabenListe.hidden = true;
        aufgabenStatus.textContent = "Keine offenen Wartungsaufgaben in GitHub Issues.";
        return;
      }

      issues.slice(0, 5).forEach((issue) => {
        aufgabenListe.append(wartungsaufgabeDarstellen(issue));
      });
      aufgabenListe.hidden = false;
      aufgabenStatus.textContent = `${issues.length} offene ${issues.length === 1 ? "Aufgabe" : "Aufgaben"} · dringende zuerst`;
    } catch {
      aufgabenListe.hidden = true;
      aufgabenStatus.textContent = "Wartungsaufgaben konnten nicht geladen werden · GitHub Issues manuell prüfen.";
    }
  }

  function githubStatusSetzen(farbe, beschriftung, text, url) {
    const punkt = githubStatus?.querySelector(".wartungsstatus-punkt");
    if (!punkt || !githubStatusText) return;

    punkt.className = `wartungsstatus-punkt wartungsstatus-${farbe}`;
    punkt.setAttribute("aria-label", beschriftung);
    githubStatusText.textContent = text;
    if (url && githubStatusLink) githubStatusLink.href = url;
  }

  async function githubPruefen() {
    if (
      githubPruefungGestartet ||
      !systemPanel ||
      !githubStatus ||
      !githubStatusText ||
      typeof window.fetch !== "function"
    ) return;

    githubPruefungGestartet = true;
    githubStatusText.textContent = "GitHub-Status wird geprüft …";

    try {
      const listeAntwort = await window.fetch(systemPanel.dataset.githubPullsUrl, {
        method: "GET",
        cache: "no-store"
      });
      if (!listeAntwort.ok) throw new Error(`HTTP ${listeAntwort.status}`);

      const offenePullRequests = await listeAntwort.json();
      if (!Array.isArray(offenePullRequests)) throw new Error("Antwortformat ungültig");

      if (offenePullRequests.length === 0) {
        githubStatusSetzen(
          "gruen",
          "Kein offener Synchronisationsvorgang",
          "Keine offenen Pull Requests · GitHub meldet keinen ausstehenden Abgleich"
        );
        return;
      }

      const details = await Promise.all(
        offenePullRequests.map(async (pullRequest) => {
          const antwort = await window.fetch(pullRequest.url, {
            method: "GET",
            cache: "no-store"
          });
          if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
          return antwort.json();
        })
      );

      const konflikt = details.find((pullRequest) => pullRequest.mergeable === false);
      const unklar = details.find((pullRequest) => pullRequest.mergeable == null);
      const entwuerfe = details.filter((pullRequest) => pullRequest.draft);
      const ersterPullRequest = konflikt || unklar || details[0];
      const link = ersterPullRequest.html_url;

      if (konflikt) {
        githubStatusSetzen(
          "rot",
          "GitHub-Konflikt",
          `PR #${konflikt.number} enthält Konflikte und muss aufgelöst werden`,
          link
        );
      } else if (unklar) {
        githubStatusSetzen(
          "grau",
          "GitHub-Zustand unklar",
          `PR #${unklar.number}: GitHub konnte die Zusammenführbarkeit noch nicht bestimmen`,
          link
        );
      } else {
        const beschreibung = entwuerfe.length
          ? `${details.length} offen, davon ${entwuerfe.length} Entwurf`
          : `${details.length} offen und zusammenführbar`;
        githubStatusSetzen(
          "gelb",
          "Synchronisation noch offen",
          `Pull Requests: ${beschreibung}`,
          link
        );
      }
    } catch {
      githubStatusSetzen(
        "grau",
        "GitHub-Status nicht erreichbar",
        "GitHub-Zustand konnte nicht geprüft werden · manuell kontrollieren"
      );
    }
  }

  async function workerPruefen() {
    if (
      workerPruefungGestartet ||
      !systemPanel ||
      !workerStatus ||
      !workerStatusText ||
      typeof window.fetch !== "function"
    ) return;

    workerPruefungGestartet = true;
    const punkt = workerStatus.querySelector(".wartungsstatus-punkt");

    if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
      punkt.className = "wartungsstatus-punkt wartungsstatus-gelb";
      punkt.setAttribute("aria-label", "In lokaler Vorschau nicht prüfbar");
      workerStatusText.textContent = "Lokale Vorschau · Live-Prüfung nur auf der veröffentlichten Website möglich";
      return;
    }

    workerStatusText.textContent = "Live-Prüfung läuft …";

    try {
      const antwort = await window.fetch(systemPanel.dataset.workerUrl, {
        method: "GET",
        cache: "no-store"
      });
      if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);

      const daten = await antwort.json();
      if (!Array.isArray(daten.reihenfolge)) {
        throw new Error("Antwortformat ungültig");
      }

      const geaendertAm = daten.aktualisiertAm
        ? new Date(daten.aktualisiertAm).toLocaleString("de-DE")
        : "Zeitpunkt unbekannt";

      if (daten.reihenfolge.length === 0) {
        punkt.className = "wartungsstatus-punkt wartungsstatus-gelb";
        punkt.setAttribute("aria-label", "Keine aktive Reihenfolge");
        workerStatusText.textContent = "Worker erreichbar · keine aktive D1-Reihenfolge gespeichert";
      } else {
        punkt.className = "wartungsstatus-punkt wartungsstatus-gruen";
        punkt.setAttribute("aria-label", "Aktive Reihenfolge");
        workerStatusText.textContent =
          `Aktiv · ${daten.reihenfolge.length} Bereiche · zuletzt geändert: ${geaendertAm}`;
      }
    } catch {
      punkt.className = "wartungsstatus-punkt wartungsstatus-rot";
      punkt.setAttribute("aria-label", "Fehler");
      workerStatusText.textContent = `Nicht erreichbar oder ungültige Antwort · ${new Date().toLocaleString("de-DE")}`;
    }
  }

  function menueOeffnen() {
    menue.hidden = false;
    hintergrund.hidden = false;
    menue.setAttribute("aria-hidden", "false");
    ausloeser.setAttribute("aria-expanded", "true");
    document.body.classList.add("wartungsmenue-offen");
    schliessen.focus();
  }

  function menueSchliessen() {
    menue.hidden = true;
    hintergrund.hidden = true;
    menue.setAttribute("aria-hidden", "true");
    ausloeser.setAttribute("aria-expanded", "false");
    document.body.classList.remove("wartungsmenue-offen");
    ausloeser.focus();
  }

  ausloeser.addEventListener("click", menueOeffnen);
  schliessen.addEventListener("click", menueSchliessen);
  hintergrund.addEventListener("click", menueSchliessen);

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => tabAktivieren(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let zielIndex = index;
      if (event.key === "ArrowLeft") zielIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") zielIndex = (index + 1) % tabs.length;
      if (event.key === "Home") zielIndex = 0;
      if (event.key === "End") zielIndex = tabs.length - 1;
      tabAktivieren(tabs[zielIndex], true);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (menue.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      menueSchliessen();
      return;
    }

    if (event.key !== "Tab") return;

    const fokusElemente = [...menue.querySelectorAll(fokusElementeSelektor)]
      .filter((element) => !element.closest("[hidden]"));
    if (!fokusElemente.length) return;

    const erstesElement = fokusElemente[0];
    const letztesElement = fokusElemente.at(-1);

    if (event.shiftKey && document.activeElement === erstesElement) {
      event.preventDefault();
      letztesElement.focus();
    } else if (!event.shiftKey && document.activeElement === letztesElement) {
      event.preventDefault();
      erstesElement.focus();
    }
  });
});
