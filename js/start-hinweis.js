/*
  ================================================================
  REDAKTION: AKTUELLE VERANSTALTUNGEN
  ================================================================

  Für eine neue Einladung:
  1. Das Einladungsbild im Ordner bilder/ speichern.
  2. Einen vollständigen Block zwischen { und } kopieren.
  3. Titel, Beginn, Bild, Bildbeschreibung, Text und Link ändern.
  4. Das Datum immer mit Uhrzeit und Zeitzone schreiben:
     JJJJ-MM-TTTHH:MM:SS+02:00 (Sommerzeit) oder +01:00 (Winterzeit).
  5. Ab dem eingetragenen Beginn wird die Einladung automatisch nicht mehr
     angezeigt. Bei mehreren Einträgen erscheint die zeitlich nächste.

  WICHTIG:
  - Texte in Anführungszeichen setzen.
  - Zwischen zwei Veranstaltungsblöcken steht ein Komma.
  - Keine abgelaufene Veranstaltung muss von Hand gelöscht werden.
*/
const START_VERANSTALTUNGEN = [
  {
    titel: "Italienischer Abend 2026",
    beginn: "2026-08-01T18:00:00+02:00",
    bild: "bilder/italienischer-abend-popup.png",
    bildAlt: "Einladung zum Italienischen Abend am 1. August 2026 im Pfarrheim Houverath",
    text: "Wir laden herzlich zum Italienischen Abend am Thürne ein.",
    link: "docs/service.html#italienischer-abend",
    linkText: "Informationen und Flyer ansehen"
  }
];

/*
  ================================================================
  REDAKTION: ERSATZBILDER OHNE AKTUELLE VERANSTALTUNG
  ================================================================

  Wenn keine Veranstaltung mehr aktuell ist, wird eines dieser Bilder gezeigt.
  Für ein weiteres Bild einen vorhandenen Block kopieren und Pfad sowie
  Bildbeschreibung anpassen. Nur tatsächlich vorhandene Webbilder verwenden.

  Der Browser merkt sich das zuletzt gezeigte Bild. Beim nächsten Öffnen der
  Startseite wird nach Möglichkeit ein anderes Bild ausgewählt.
*/
const START_GALERIEBILDER = [
  {
    bild: "bilder/a4bild01.jpg",
    bildAlt: "Naturaufnahme aus der Dörfergemeinschaft am Thürne"
  },
  {
    bild: "bilder/e1bild01.jpg",
    bildAlt: "Gemeinschaftliches Erlebnis am Thürne"
  },
  {
    bild: "bilder/e2bild03.jpeg",
    bildAlt: "Eindruck von einer Veranstaltung der Dörfergemeinschaft"
  },
  {
    bild: "bilder/e3bild08.jpg",
    bildAlt: "Impression aus den Dörfern rund um den Thürne"
  },
  {
    bild: "bilder/e4bild07.jpeg",
    bildAlt: "Dorfleben in der Dörfergemeinschaft am Thürne"
  }
];

/*
  ================================================================
  TECHNIK: AB HIER IST KEINE REDAKTIONELLE ÄNDERUNG NÖTIG
  ================================================================
*/
(() => {
  const SPEICHER_SCHLUESSEL = "startHinweisLetztesGaleriebild";

  function naechsteVeranstaltung(zeitpunkt) {
    return START_VERANSTALTUNGEN
      .map((veranstaltung) => ({
        ...veranstaltung,
        beginnAlsDatum: new Date(veranstaltung.beginn)
      }))
      .filter(({ beginnAlsDatum }) => (
        !Number.isNaN(beginnAlsDatum.getTime()) && beginnAlsDatum > zeitpunkt
      ))
      .sort((a, b) => a.beginnAlsDatum - b.beginnAlsDatum)[0] || null;
  }

  function galeriebilderMischen(zufall = Math.random) {
    const letztesBild = localStorage.getItem(SPEICHER_SCHLUESSEL);
    const andereBilder = START_GALERIEBILDER.filter(({ bild }) => bild !== letztesBild);
    const moeglicheBilder = andereBilder.length ? andereBilder : [...START_GALERIEBILDER];

    /*
      Fisher-Yates-Mischung: Das erste Bild ist die aktuelle Zufallsauswahl.
      Die weitere Reihenfolge dient zugleich als Reserve bei einem Bildfehler.
    */
    for (let index = moeglicheBilder.length - 1; index > 0; index -= 1) {
      const tauschIndex = Math.floor(zufall() * (index + 1));
      [moeglicheBilder[index], moeglicheBilder[tauschIndex]] =
        [moeglicheBilder[tauschIndex], moeglicheBilder[index]];
    }

    return moeglicheBilder;
  }

  function inhaltEintragen(elemente, inhalt) {
    elemente.kategorie.textContent = inhalt.kategorie;
    elemente.titel.textContent = inhalt.titel;
    elemente.beschreibung.textContent = inhalt.text;

    if (inhalt.link && inhalt.linkText) {
      elemente.link.href = inhalt.link;
      elemente.link.textContent = inhalt.linkText;
      elemente.link.hidden = false;
    } else {
      elemente.link.hidden = true;
    }
  }

  function bildMitReserveLaden(elemente, bilder, istGaleriebild) {
    let bildIndex = 0;

    const naechstesBild = () => {
      const bild = bilder[bildIndex];
      bildIndex += 1;

      if (!bild) {
        // Der Text bleibt als zugängliche Rückfallebene sichtbar.
        elemente.bild.hidden = true;
        elemente.beschreibung.textContent += " Ein Bild konnte leider nicht geladen werden.";
        return;
      }

      elemente.bild.hidden = false;
      elemente.bild.alt = bild.bildAlt;
      elemente.bild.src = bild.bild;

      if (istGaleriebild) {
        localStorage.setItem(SPEICHER_SCHLUESSEL, bild.bild);
      }
    };

    elemente.bild.addEventListener("error", naechstesBild);
    naechstesBild();
  }

  function initialisieren({ jetzt = new Date(), zufall = Math.random } = {}) {
    const dialog = document.getElementById("start-hinweis");
    if (!dialog || dialog.dataset.initialisiert === "true") return null;

    const elemente = {
      bild: document.getElementById("start-hinweis-bild"),
      kategorie: document.getElementById("start-hinweis-kategorie"),
      titel: document.getElementById("start-hinweis-titel"),
      beschreibung: document.getElementById("start-hinweis-beschreibung"),
      link: document.getElementById("start-hinweis-link"),
      schliessen: dialog.querySelector(".start-hinweis-schliessen")
    };

    if (Object.values(elemente).some((element) => !element)) return null;
    dialog.dataset.initialisiert = "true";

    const veranstaltung = naechsteVeranstaltung(jetzt);
    if (veranstaltung) {
      inhaltEintragen(elemente, {
        ...veranstaltung,
        kategorie: "Nächste Veranstaltung"
      });
      bildMitReserveLaden(elemente, [veranstaltung], false);
    } else {
      inhaltEintragen(elemente, {
        kategorie: "Ein Blick rund um den Thürne",
        titel: "Willkommen in unserer Dörfergemeinschaft",
        text: "Entdecke Eindrücke aus unseren Dörfern, Veranstaltungen und der Natur.",
        link: "docs/galerie.html",
        linkText: "Zur vollständigen Galerie"
      });
      bildMitReserveLaden(elemente, galeriebilderMischen(zufall), true);
    }

    const schliessen = () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    };

    elemente.schliessen.addEventListener("click", schliessen);
    dialog.addEventListener("click", (event) => {
      // Nur ein Klick direkt auf den abgedunkelten Dialogrand schließt.
      if (event.target === dialog) schliessen();
    });

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      // Rückfall für ältere Browser ohne native dialog-Unterstützung.
      dialog.setAttribute("open", "");
    }

    elemente.schliessen.focus();
    return { typ: veranstaltung ? "veranstaltung" : "galerie", dialog };
  }

  // Die öffentliche Test-Schnittstelle hält Datum und Zufall reproduzierbar.
  window.StartHinweis = { initialisieren, naechsteVeranstaltung };
  document.addEventListener("DOMContentLoaded", () => initialisieren());
})();
