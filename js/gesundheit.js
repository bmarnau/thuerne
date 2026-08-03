(() => {
  "use strict";

  const bilder = [...document.querySelectorAll(".praxis-minigalerie-bild")];
  const dialog = document.getElementById("praxis-bilddialog");
  const grossbild = document.getElementById("praxis-bilddialog-bild");
  const beschreibung = document.getElementById("praxis-bilddialog-beschreibung");
  const zaehler = document.getElementById("praxis-bilddialog-zaehler");
  const schliessen = dialog?.querySelector(".praxis-bilddialog-schliessen");
  let aktuellerIndex = 0;
  let ausloeser = null;

  if (!bilder.length || !dialog || !grossbild || !beschreibung || !zaehler) return;

  function bildAnzeigen(index) {
    aktuellerIndex = (index + bilder.length) % bilder.length;
    const auswahl = bilder[aktuellerIndex];
    const bildtext = auswahl.dataset.beschreibung;

    grossbild.src = auswahl.dataset.bild;
    grossbild.alt = bildtext;
    beschreibung.textContent = bildtext;
    zaehler.textContent = `${aktuellerIndex + 1} von ${bilder.length}`;
  }

  function dialogOeffnen(index, schaltflaeche) {
    ausloeser = schaltflaeche;
    bildAnzeigen(index);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function dialogSchliessen() {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      ausloeser?.focus();
    }
  }

  bilder.forEach((schaltflaeche, index) => {
    schaltflaeche.addEventListener("click", () => dialogOeffnen(index, schaltflaeche));
  });

  dialog.querySelectorAll("[data-richtung]").forEach((schaltflaeche) => {
    schaltflaeche.addEventListener("click", () => {
      bildAnzeigen(aktuellerIndex + Number(schaltflaeche.dataset.richtung));
    });
  });

  schliessen?.addEventListener("click", dialogSchliessen);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialogSchliessen();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") bildAnzeigen(aktuellerIndex - 1);
    if (event.key === "ArrowRight") bildAnzeigen(aktuellerIndex + 1);
  });

  dialog.addEventListener("close", () => {
    grossbild.removeAttribute("src");
    ausloeser?.focus();
  });
})();
