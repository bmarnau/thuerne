document.addEventListener("DOMContentLoaded", () => {
  const dateiendungen = ["jpeg", "jpg", "png"];
  const bilderVerzeichnis = "../bilder/";
  const beschriftungenSchalter = document.getElementById("galerie-beschriftungen-schalter");
  const nummernkreisHinweis = document.getElementById("galerie-nummernkreise");
  const sortierliste = document.getElementById("galerie-sortierliste");
  const sortierungZuruecksetzen = document.getElementById("galerie-sortierung-zuruecksetzen");
  const galerieHauptbereich = document.querySelector("main");
  const galerieAbschnitte = [...document.querySelectorAll(".galerie-ereignis")];
  const standardReihenfolge = galerieAbschnitte.map((abschnitt) => abschnitt.id);
  const speicherSchluessel = "thuerne-galerie-reihenfolge";
  const adminSchluessel = "thuerne-galerie-admin-token";
  const apiUrl =
    document.querySelector('meta[name="galerie-reihenfolge-api"]')?.content.trim() || "";
  const sortierungStatus = document.getElementById("galerie-sortierung-status");
  let beschriftungenSichtbar = false;
  let aktuelleReihenfolge = [...standardReihenfolge];
  let speichernLaeuft = false;

  function nummernkreiseInAbschnittenErgaenzen() {
    galerieAbschnitte.forEach((abschnitt) => {
      const galerie = abschnitt.querySelector(".automatische-galerie");
      const ueberschrift = abschnitt.querySelector("h2");
      if (!galerie || !ueberschrift) return;

      const dateipraefix = galerie.dataset.praefix || "bild";
      const hoechsteNummer = Number.parseInt(galerie.dataset.von, 10);
      const niedrigsteNummer = Number.parseInt(galerie.dataset.bis, 10);
      const stellenzahl = Number.parseInt(galerie.dataset.stellen || "1", 10);
      const nummerFormatieren = (nummer) => String(nummer).padStart(stellenzahl, "0");
      const kennzeichnung = document.createElement("p");
      const beschriftung = document.createElement("strong");
      const nummernkreis = document.createElement("code");

      kennzeichnung.className = "galerie-nummernkreis-abschnitt";
      kennzeichnung.hidden = true;
      beschriftung.textContent = "Nummernkreis: ";

      if (dateipraefix.startsWith("a")) {
        nummernkreis.textContent = `${dateipraefix}01, ${dateipraefix}02 …`;
      } else {
        nummernkreis.textContent =
          `${dateipraefix}${nummerFormatieren(niedrigsteNummer)} bis ` +
          `${dateipraefix}${nummerFormatieren(hoechsteNummer)}`;
      }

      kennzeichnung.append(beschriftung, nummernkreis);
      ueberschrift.insertAdjacentElement("afterend", kennzeichnung);
    });
  }

  nummernkreiseInAbschnittenErgaenzen();

  function statusAnzeigen(text, istFehler = false) {
    if (!sortierungStatus) return;
    sortierungStatus.textContent = text;
    sortierungStatus.classList.toggle("galerie-sortierung-fehler", istFehler);
  }

  function reihenfolgeBereinigen(reihenfolge) {
    if (!Array.isArray(reihenfolge)) return [...standardReihenfolge];

    const bereitsEnthalten = new Set();
    const bekannteIds = reihenfolge.filter((id) => {
      if (
        typeof id !== "string" ||
        !standardReihenfolge.includes(id) ||
        bereitsEnthalten.has(id)
      ) {
        return false;
      }
      bereitsEnthalten.add(id);
      return true;
    });
    const neueIds = standardReihenfolge.filter((id) => !bereitsEnthalten.has(id));
    const nichtZugeordnetIndex = bekannteIds.indexOf("galerie-nicht-zugeordnet");

    if (nichtZugeordnetIndex >= 0) {
      bekannteIds.splice(nichtZugeordnetIndex, 0, ...neueIds);
      return bekannteIds;
    }

    return [...bekannteIds, ...neueIds];
  }

  function lokaleReihenfolgeLesen() {
    try {
      return reihenfolgeBereinigen(JSON.parse(localStorage.getItem(speicherSchluessel)));
    } catch {
      return [...standardReihenfolge];
    }
  }

  function lokaleReihenfolgeSpeichern() {
    try {
      localStorage.setItem(speicherSchluessel, JSON.stringify(aktuelleReihenfolge));
    } catch {
      // Die zentrale Speicherung bleibt davon unberührt.
    }
  }

  async function zentraleReihenfolgeLesen() {
    if (!apiUrl || window.location.protocol === "file:") {
      statusAnzeigen("Lokale Vorschau: Die Reihenfolge gilt nur in diesem Browser.");
      return lokaleReihenfolgeLesen();
    }

    const antwort = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (!antwort.ok) throw new Error(`Abruf fehlgeschlagen (HTTP ${antwort.status})`);

    const daten = await antwort.json();
    return reihenfolgeBereinigen(daten.reihenfolge);
  }

  function reihenfolgeAnwenden() {
    aktuelleReihenfolge.forEach((id) => {
      const abschnitt = document.getElementById(id);
      if (abschnitt && galerieHauptbereich) galerieHauptbereich.appendChild(abschnitt);
    });
  }

  async function reihenfolgeSpeichern() {
    if (!apiUrl || window.location.protocol === "file:") {
      lokaleReihenfolgeSpeichern();
      statusAnzeigen("Lokal gespeichert. Auf der veröffentlichten Seite wird zentral gespeichert.");
      return;
    }

    let adminToken = sessionStorage.getItem(adminSchluessel);
    if (!adminToken) {
      adminToken = window.prompt("Administrator-Kennwort zum Speichern der Reihenfolge:");
      if (!adminToken) throw new Error("Speichern wurde abgebrochen.");
      sessionStorage.setItem(adminSchluessel, adminToken);
    }

    const antwort = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reihenfolge: aktuelleReihenfolge })
    });

    if (antwort.status === 401) {
      sessionStorage.removeItem(adminSchluessel);
      throw new Error("Das Administrator-Kennwort ist nicht gültig.");
    }
    if (!antwort.ok) throw new Error(`Speichern fehlgeschlagen (HTTP ${antwort.status})`);

    lokaleReihenfolgeSpeichern();
    statusAnzeigen("Reihenfolge zentral gespeichert.");
  }

  function sortierlisteAnzeigen() {
    if (!sortierliste) return;
    sortierliste.replaceChildren();

    aktuelleReihenfolge.forEach((id, index) => {
      const abschnitt = document.getElementById(id);
      const titel = abschnitt?.querySelector("h2")?.textContent.trim() || id;
      const eintrag = document.createElement("li");
      const beschriftung = document.createElement("span");
      const aktionen = document.createElement("span");
      const nachOben = document.createElement("button");
      const nachUnten = document.createElement("button");

      beschriftung.textContent = titel;
      aktionen.className = "galerie-sortieraktionen";

      nachOben.type = "button";
      nachOben.textContent = "↑";
      nachOben.disabled = speichernLaeuft || index === 0;
      nachOben.setAttribute("aria-label", `${titel} nach oben verschieben`);
      nachOben.addEventListener("click", () => abschnittVerschieben(index, -1));

      nachUnten.type = "button";
      nachUnten.textContent = "↓";
      nachUnten.disabled = speichernLaeuft || index === aktuelleReihenfolge.length - 1;
      nachUnten.setAttribute("aria-label", `${titel} nach unten verschieben`);
      nachUnten.addEventListener("click", () => abschnittVerschieben(index, 1));

      aktionen.append(nachOben, nachUnten);
      eintrag.append(beschriftung, aktionen);
      sortierliste.appendChild(eintrag);
    });

    if (sortierungZuruecksetzen) sortierungZuruecksetzen.disabled = speichernLaeuft;
  }

  async function abschnittVerschieben(index, richtung) {
    if (speichernLaeuft) return;
    const zielIndex = index + richtung;
    if (zielIndex < 0 || zielIndex >= aktuelleReihenfolge.length) return;

    const vorherigeReihenfolge = [...aktuelleReihenfolge];
    [aktuelleReihenfolge[index], aktuelleReihenfolge[zielIndex]] =
      [aktuelleReihenfolge[zielIndex], aktuelleReihenfolge[index]];
    reihenfolgeAnwenden();
    speichernLaeuft = true;
    sortierlisteAnzeigen();
    statusAnzeigen("Reihenfolge wird gespeichert …");

    try {
      await reihenfolgeSpeichern();
    } catch (fehler) {
      aktuelleReihenfolge = vorherigeReihenfolge;
      reihenfolgeAnwenden();
      statusAnzeigen(fehlerText(fehler), true);
    } finally {
      speichernLaeuft = false;
      sortierlisteAnzeigen();
    }
  }

  function fehlerText(fehler) {
    return fehler instanceof Error ? fehler.message : "Die Reihenfolge konnte nicht gespeichert werden.";
  }

  async function initialisiereReihenfolge() {
    aktuelleReihenfolge = lokaleReihenfolgeLesen();
    reihenfolgeAnwenden();
    sortierlisteAnzeigen();

    try {
      aktuelleReihenfolge = await zentraleReihenfolgeLesen();
      reihenfolgeAnwenden();
      sortierlisteAnzeigen();
      if (apiUrl && window.location.protocol !== "file:") {
        statusAnzeigen("Zentrale Reihenfolge geladen.");
      }
    } catch (fehler) {
      statusAnzeigen(
        `Zentrale Reihenfolge nicht erreichbar. Lokale Ersatzreihenfolge wird verwendet. ${fehlerText(fehler)}`,
        true
      );
    }
  }

  initialisiereReihenfolge();

  sortierungZuruecksetzen?.addEventListener("click", async () => {
    if (speichernLaeuft) return;
    const vorherigeReihenfolge = [...aktuelleReihenfolge];
    aktuelleReihenfolge = [...standardReihenfolge];
    reihenfolgeAnwenden();
    speichernLaeuft = true;
    sortierlisteAnzeigen();
    statusAnzeigen("Standardreihenfolge wird gespeichert …");

    try {
      await reihenfolgeSpeichern();
    } catch (fehler) {
      aktuelleReihenfolge = vorherigeReihenfolge;
      reihenfolgeAnwenden();
      statusAnzeigen(fehlerText(fehler), true);
    } finally {
      speichernLaeuft = false;
      sortierlisteAnzeigen();
    }
  });

  if (beschriftungenSchalter) {
    beschriftungenSchalter.addEventListener("click", () => {
      beschriftungenSichtbar = !beschriftungenSichtbar;
      beschriftungenSchalter.setAttribute("aria-pressed", String(beschriftungenSichtbar));

      document.querySelectorAll(".galerie-grid figcaption").forEach((beschriftung) => {
        beschriftung.hidden = !beschriftungenSichtbar;
      });

      document.querySelectorAll(".galerie-nummernkreis-abschnitt").forEach((nummernkreis) => {
        nummernkreis.hidden = !beschriftungenSichtbar;
      });

      if (nummernkreisHinweis) {
        nummernkreisHinweis.hidden = !beschriftungenSichtbar;
      }
    });
  }

  function findeBild(dateipraefix, bildnummer, stellenzahl) {
    return new Promise((resolve) => {
      let endungsIndex = 0;
      const formatierteNummer = String(bildnummer).padStart(stellenzahl, "0");

      function pruefeNaechsteEndung() {
        if (endungsIndex >= dateiendungen.length) {
          resolve(null);
          return;
        }

        const bild = new Image();
        const dateiendung = dateiendungen[endungsIndex];
        endungsIndex += 1;

        bild.onload = async () => {
          bild.alt = `Galeriebild ${formatierteNummer}`;
          bild.loading = "lazy";
          bild.decoding = "async";
          bild.dataset.bildnummer = String(bildnummer);

          // Erst nach vollständig abgeschlossener Dekodierung in die Galerie einsetzen.
          // Das verhindert kurzzeitig weiße Bildflächen bei größeren PNG-Dateien.
          if (typeof bild.decode === "function") {
            try {
              await bild.decode();
            } catch {
              // Manche Browser melden trotz erfolgreich geladenem Bild einen Decode-Fehler.
            }
          }

          resolve(bild);
        };

        bild.onerror = pruefeNaechsteEndung;
        bild.src = `${bilderVerzeichnis}${dateipraefix}${formatierteNummer}.${dateiendung}`;
      }

      pruefeNaechsteEndung();
    });
  }

  function nachgelagerteSuchePlanen(aufgabe) {
    window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(aufgabe, { timeout: 2500 });
      } else {
        aufgabe();
      }
    }, 1200);
  }

  document.querySelectorAll(".automatische-galerie").forEach(async (galerie) => {
    galerie.setAttribute("aria-busy", "true");
    const hoechsteNummer = Number.parseInt(galerie.dataset.von, 10);
    const niedrigsteNummer = Number.parseInt(galerie.dataset.bis, 10);
    const dateipraefix = galerie.dataset.praefix || "bild";
    const stellenzahl = Number.parseInt(galerie.dataset.stellen || "1", 10);
    const suchblockGroesse = Number.parseInt(galerie.dataset.suchblock || "20", 10);
    const suchgrenze = Number.parseInt(galerie.dataset.suchgrenze || "999", 10);
    const leerHinweis = galerie.parentElement.querySelector(".galerie-leer");

    if (
      !Number.isInteger(hoechsteNummer) ||
      !Number.isInteger(niedrigsteNummer) ||
      !Number.isInteger(stellenzahl) ||
      !Number.isInteger(suchblockGroesse) ||
      !Number.isInteger(suchgrenze) ||
      hoechsteNummer < niedrigsteNummer ||
      niedrigsteNummer < 0 ||
      stellenzahl < 1 ||
      suchblockGroesse < 1 ||
      suchgrenze < hoechsteNummer
    ) {
      galerie.setAttribute("aria-busy", "false");
      return;
    }

    const gefundeneBilder = new Map();

    function bildEinfuegen(bild) {
      const bildnummer = Number.parseInt(bild.dataset.bildnummer, 10);
      if (galerie.querySelector(`figure[data-bildnummer="${bildnummer}"]`)) return;

      const figure = document.createElement("figure");
      const beschriftung = document.createElement("figcaption");
      figure.dataset.bildnummer = String(bildnummer);
      beschriftung.textContent = bild.src.split("/").pop();
      beschriftung.hidden = !beschriftungenSichtbar;
      figure.append(bild, beschriftung);

      const vorhandeneFiguren = [...galerie.querySelectorAll("figure[data-bildnummer]")];
      const naechsteFigur = vorhandeneFiguren.find(
        (vorhandeneFigur) =>
          Number.parseInt(vorhandeneFigur.dataset.bildnummer, 10) < bildnummer
      );
      galerie.insertBefore(figure, naechsteFigur || null);
    }

    function galerieAktualisieren() {
      const sortierteBilder = [...gefundeneBilder.values()].sort(
        (erstesBild, zweitesBild) =>
          Number.parseInt(zweitesBild.dataset.bildnummer, 10) -
          Number.parseInt(erstesBild.dataset.bildnummer, 10)
      );

      // Nur neu gefundene Bilder ergänzen. Bereits sichtbare Elemente bleiben erhalten.
      sortierteBilder.forEach(bildEinfuegen);

      if (leerHinweis) leerHinweis.hidden = sortierteBilder.length > 0;

      const nummernkreisAnzeige = galerie.parentElement.querySelector(
        ".galerie-nummernkreis-abschnitt code"
      );

      if (!dateipraefix.startsWith("a") && nummernkreisAnzeige && sortierteBilder.length > 0) {
        const gefundeneNummern = sortierteBilder.map((bild) =>
          Number.parseInt(bild.dataset.bildnummer, 10)
        );
        nummernkreisAnzeige.textContent =
          `${dateipraefix}${String(Math.min(...gefundeneNummern)).padStart(stellenzahl, "0")} bis ` +
          `${dateipraefix}${String(Math.max(...gefundeneNummern)).padStart(stellenzahl, "0")}`;
      }
    }

    async function bildnummernLaden(bildNummern) {
      const bilder = await Promise.all(
        bildNummern.map((bildnummer) => findeBild(dateipraefix, bildnummer, stellenzahl))
      );

      bilder.filter(Boolean).forEach((bild) => {
        gefundeneBilder.set(Number.parseInt(bild.dataset.bildnummer, 10), bild);
      });
      return bilder.filter(Boolean).length;
    }

    // Phase 1: Nur der im HTML bekannte Bestand wird geladen und sofort angezeigt.
    const bekannteBildNummern = [];
    for (let nummer = niedrigsteNummer; nummer <= hoechsteNummer; nummer += 1) {
      bekannteBildNummern.push(nummer);
    }
    await bildnummernLaden(bekannteBildNummern);
    galerieAktualisieren();
    galerie.setAttribute("aria-busy", "false");

    // Phase 2: Erst danach sucht die Galerie im Leerlauf nach höheren Nummern.
    async function weitereBilderSuchen(blockStart) {
      if (blockStart > suchgrenze) return;

      const blockEnde = Math.min(blockStart + suchblockGroesse - 1, suchgrenze);
      const bildNummern = [];
      for (let nummer = blockStart; nummer <= blockEnde; nummer += 1) {
        bildNummern.push(nummer);
      }

      const anzahlGefunden = await bildnummernLaden(bildNummern);
      if (anzahlGefunden === 0) return;

      galerieAktualisieren();
      nachgelagerteSuchePlanen(() => weitereBilderSuchen(blockEnde + 1));
    }

    nachgelagerteSuchePlanen(() => weitereBilderSuchen(hoechsteNummer + 1));
  });
});
