(() => {
  const dateiendungen = ["jpeg", "jpg", "png"];
  const bilderVerzeichnis = "../bilder/";
  const beschriftungenSchalter = document.getElementById("galerie-beschriftungen-schalter");
  const nummernkreisHinweis = document.getElementById("galerie-nummernkreise");
  const sortierliste = document.getElementById("galerie-sortierliste");
  const sortierungSpeichern = document.getElementById("galerie-sortierung-speichern");
  const sortierungStatus = document.getElementById("galerie-sortierung-status");
  const zuordnungKopieren = document.getElementById("galerie-zuordnung-kopieren");
  const zuordnungStatus = document.getElementById("galerie-zuordnung-status");
  const speicherdialog = document.getElementById("galerie-speicherdialog");
  const speichernAbbrechen = document.getElementById("galerie-speichern-abbrechen");
  const speichernBestaetigen = document.getElementById("galerie-speichern-bestaetigen");
  const redaktionsPin = document.getElementById("galerie-redaktions-pin");
  const dialogStatus = document.getElementById("galerie-dialog-status");
  const galerieHauptbereich = document.querySelector("main");
  const galerieAbschnitte = [...document.querySelectorAll(".galerie-ereignis")];
  const htmlReihenfolge = galerieAbschnitte.map((abschnitt) => abschnitt.id);
  // Die vollständige API-Adresse steht im HTML. Dadurch ist keine zusätzliche
  // Konfigurationsdatei nötig und der Worker-Pfad wird nicht doppelt ergänzt.
  const galerieApiMeta = document.querySelector('meta[name="galerie-reihenfolge-api"]');
  const galerieApiUrl = String(galerieApiMeta?.content || "").replace(/\/+$/, "");
  const erlaubteLiveHosts = new Set([
    "thuerne.de",
    "www.thuerne.de",
    "bmarnau.github.io"
  ]);
  const istLiveSeite = erlaubteLiveHosts.has(window.location.hostname);
  let beschriftungenSichtbar = false;
  let aktuelleReihenfolge = [...htmlReihenfolge];
  let zentraleReihenfolgeGeladen = false;

  function speicherschutzSetzen(freigegeben, statusText = "") {
    zentraleReihenfolgeGeladen = freigegeben;
    if (sortierungSpeichern) sortierungSpeichern.disabled = !freigegeben;
    if (sortierungStatus && statusText) sortierungStatus.textContent = statusText;
  }

  function datumUhrzeitFormatieren(isoWert) {
    if (!isoWert) return "Zeitpunkt unbekannt";
    const datum = new Date(isoWert);
    if (Number.isNaN(datum.getTime())) return "Zeitpunkt unbekannt";
    return datum.toLocaleString("de-DE");
  }

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

  function kompakteZuordnungErstellen() {
    const zuordnungen = [...document.querySelectorAll("#galerie-nummernkreise > ul > li")]
      .map((eintrag) => {
        const name = eintrag.querySelector("span")?.textContent.trim();
        const nummernkreis = eintrag.querySelector("code")?.textContent;
        const kuerzel = nummernkreis?.match(/[ae]\d+bild/i)?.[0];
        return name && kuerzel ? `${name}: ${kuerzel}XX` : null;
      })
      .filter(Boolean);

    return [
      "Thürne-Galerie – Bildzuordnung",
      ...zuordnungen,
      "Dateiname: Kürzel + zweistellige Nummer + .jpg/.jpeg/.png",
      "Beispiel: a1bild01.jpg"
    ].join("\n");
  }

  async function textInZwischenablageKopieren(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textfeld = document.createElement("textarea");
    textfeld.value = text;
    textfeld.setAttribute("readonly", "");
    textfeld.style.position = "fixed";
    textfeld.style.opacity = "0";
    document.body.appendChild(textfeld);
    textfeld.select();
    const erfolgreich = document.execCommand("copy");
    textfeld.remove();
    if (!erfolgreich) throw new Error("Kopieren nicht möglich");
  }

  zuordnungKopieren?.addEventListener("click", async () => {
    try {
      await textInZwischenablageKopieren(kompakteZuordnungErstellen());
      if (zuordnungStatus) zuordnungStatus.textContent = "Übersicht kopiert.";
    } catch {
      if (zuordnungStatus) {
        zuordnungStatus.textContent =
          "Kopieren war nicht möglich. Bitte die Seite über thuerne.de öffnen.";
      }
    }
  });

  function reihenfolgeVervollstaendigen(reihenfolge) {
    if (!Array.isArray(reihenfolge)) return [...htmlReihenfolge];

    const bekannteIds = reihenfolge.filter(
      (id, index) =>
        htmlReihenfolge.includes(id) &&
        reihenfolge.indexOf(id) === index
    );
    const neueIds = htmlReihenfolge.filter((id) => !bekannteIds.includes(id));
    const nichtZugeordnetIndex = bekannteIds.indexOf("galerie-nicht-zugeordnet");

    if (nichtZugeordnetIndex >= 0) {
      bekannteIds.splice(nichtZugeordnetIndex, 0, ...neueIds);
      return bekannteIds;
    }

    return [...bekannteIds, ...neueIds];
  }

  function veroeffentlichteReihenfolgeLesen() {
    return reihenfolgeVervollstaendigen(window.thuerneGalerieReihenfolge);
  }

  function reihenfolgeAnwenden() {
    aktuelleReihenfolge.forEach((id) => {
      const abschnitt = document.getElementById(id);
      if (abschnitt && galerieHauptbereich) galerieHauptbereich.appendChild(abschnitt);
    });
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
      nachOben.disabled = index === 0;
      nachOben.setAttribute("aria-label", `${titel} nach oben verschieben`);
      nachOben.addEventListener("click", () => abschnittVerschieben(index, -1));

      nachUnten.type = "button";
      nachUnten.textContent = "↓";
      nachUnten.disabled = index === aktuelleReihenfolge.length - 1;
      nachUnten.setAttribute("aria-label", `${titel} nach unten verschieben`);
      nachUnten.addEventListener("click", () => abschnittVerschieben(index, 1));

      aktionen.append(nachOben, nachUnten);
      eintrag.append(beschriftung, aktionen);
      sortierliste.appendChild(eintrag);
    });

  }

  function abschnittVerschieben(index, richtung) {
    const zielIndex = index + richtung;
    if (zielIndex < 0 || zielIndex >= aktuelleReihenfolge.length) return;

    [aktuelleReihenfolge[index], aktuelleReihenfolge[zielIndex]] =
      [aktuelleReihenfolge[zielIndex], aktuelleReihenfolge[index]];
    reihenfolgeAnwenden();
    sortierlisteAnzeigen();
    if (sortierungStatus) {
      sortierungStatus.textContent = "Reihenfolge geändert – bitte noch speichern.";
    }
  }

  aktuelleReihenfolge = veroeffentlichteReihenfolgeLesen();
  reihenfolgeAnwenden();
  sortierlisteAnzeigen();

  async function zentraleReihenfolgeLaden() {
    speicherschutzSetzen(false, "Zentrale Reihenfolge wird geprüft – Speichern ist noch gesperrt.");

    if (!istLiveSeite) {
      speicherschutzSetzen(
        false,
        "Vorschauseite erkannt. Laden und Speichern der zentralen Reihenfolge sind nur auf der Live-Seite freigegeben."
      );
      return;
    }

    if (!galerieApiUrl) {
      speicherschutzSetzen(
        false,
        "Der zentrale Speicher ist nicht eingerichtet. Speichern bleibt zum Schutz der Reihenfolge gesperrt."
      );
      return;
    }

    try {
      // Die Meta-Angabe enthält bereits den vollständigen Worker-Pfad.
      const antwort = await fetch(galerieApiUrl, {
        method: "GET",
        cache: "no-store"
      });
      const daten = await antwort.json();
      if (!antwort.ok || !Array.isArray(daten.reihenfolge)) {
        throw new Error(daten.fehler || "Reihenfolge konnte nicht geladen werden.");
      }

      const aktiveIds = daten.reihenfolge.filter((id) => htmlReihenfolge.includes(id));
      if (aktiveIds.length === 0) {
        speicherschutzSetzen(
          false,
          "Keine aktive zentrale Reihenfolge gefunden. Speichern bleibt gesperrt."
        );
        return;
      }

      aktuelleReihenfolge = reihenfolgeVervollstaendigen(daten.reihenfolge);
      reihenfolgeAnwenden();
      sortierlisteAnzeigen();
      speicherschutzSetzen(
        true,
        `Zentrale Reihenfolge aktiv · zuletzt geändert: ${datumUhrzeitFormatieren(daten.aktualisiertAm)}`
      );
    } catch {
      speicherschutzSetzen(
        false,
        "Der zentrale Speicher ist momentan nicht erreichbar. Die hinterlegte Reihenfolge wird nur angezeigt; Speichern bleibt gesperrt."
      );
    }
  }

  zentraleReihenfolgeLaden();

  async function reihenfolgeZentralSpeichern(pin) {
    if (!istLiveSeite || !zentraleReihenfolgeGeladen) {
      throw new Error(
        "Speichern ist nur auf der Live-Seite und nach erfolgreichem Laden einer aktiven zentralen Reihenfolge möglich."
      );
    }
    if (!galerieApiUrl) {
      throw new Error("Der zentrale Speicher ist noch nicht eingerichtet.");
    }
    if (!/^[\x20-\x7E]{8,128}$/.test(pin)) {
      throw new Error("Die Redaktions-PIN muss mindestens acht Zeichen lang sein.");
    }

    // Der Bearer-Token wird nur für diesen Speichervorgang übertragen.
    // Er wird weder im Browser gespeichert noch in den Quellcode geschrieben.
    const antwort = await fetch(galerieApiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${pin}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reihenfolge: aktuelleReihenfolge })
    });
    const daten = await antwort.json();
    if (!antwort.ok) {
      throw new Error(daten.fehler || "Speichern war nicht möglich.");
    }
    return daten;
  }

  sortierungSpeichern?.addEventListener("click", () => {
    if (speicherdialog?.showModal) {
      if (dialogStatus) dialogStatus.textContent = "";
      if (redaktionsPin) redaktionsPin.value = "";
      speicherdialog.showModal();
      redaktionsPin?.focus();
      return;
    }

    const pin = window.prompt("Redaktions-PIN eingeben:");
    if (pin) {
      reihenfolgeZentralSpeichern(pin)
        .then((daten) => {
          if (sortierungStatus) {
            sortierungStatus.textContent =
              `Reihenfolge gespeichert · zuletzt geändert: ${datumUhrzeitFormatieren(daten.aktualisiertAm)}`;
          }
        })
        .catch((fehler) => {
          if (sortierungStatus) sortierungStatus.textContent = fehler.message;
        });
    }
  });

  speichernAbbrechen?.addEventListener("click", () => {
    if (redaktionsPin) redaktionsPin.value = "";
    speicherdialog?.close();
  });
  speichernBestaetigen?.addEventListener("click", async () => {
    const pin = redaktionsPin?.value || "";
    if (dialogStatus) dialogStatus.textContent = "";
    speichernBestaetigen.disabled = true;

    try {
      const daten = await reihenfolgeZentralSpeichern(pin);
      if (redaktionsPin) redaktionsPin.value = "";
      speicherdialog?.close();
      if (sortierungStatus) {
        sortierungStatus.textContent =
          `Reihenfolge gespeichert · zuletzt geändert: ${datumUhrzeitFormatieren(daten.aktualisiertAm)}`;
      }
    } catch (fehler) {
      if (dialogStatus) dialogStatus.textContent = fehler.message;
    } finally {
      speichernBestaetigen.disabled = false;
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

        bild.onload = () => {
          bild.alt = `Galeriebild ${formatierteNummer}`;
          bild.loading = "lazy";
          bild.decoding = "async";
          bild.dataset.bildnummer = String(bildnummer);
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
    const suchblockGroesse = Number.parseInt(galerie.dataset.suchblock || "5", 10);
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
})();
