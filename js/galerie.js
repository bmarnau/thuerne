document.addEventListener("DOMContentLoaded", () => {
  const dateiendungen = ["jpeg", "jpg", "png"];
  const bildPfad = "../bilder/bild";
  const beschriftungenSchalter = document.getElementById("galerie-beschriftungen-schalter");
  let beschriftungenSichtbar = false;

  if (beschriftungenSchalter) {
    beschriftungenSchalter.addEventListener("click", () => {
      beschriftungenSichtbar = !beschriftungenSichtbar;
      beschriftungenSchalter.setAttribute("aria-pressed", String(beschriftungenSichtbar));

      document.querySelectorAll(".galerie-grid figcaption").forEach((beschriftung) => {
        beschriftung.hidden = !beschriftungenSichtbar;
      });
    });
  }

  function findeBild(bildnummer) {
    return new Promise((resolve) => {
      let endungsIndex = 0;

      function pruefeNaechsteEndung() {
        if (endungsIndex >= dateiendungen.length) {
          resolve(null);
          return;
        }

        const bild = new Image();
        const dateiendung = dateiendungen[endungsIndex];
        endungsIndex += 1;

        bild.onload = () => {
          bild.alt = `Galeriebild ${bildnummer}`;
          bild.loading = "lazy";
          bild.decoding = "async";
          resolve(bild);
        };

        bild.onerror = pruefeNaechsteEndung;
        bild.src = `${bildPfad}${bildnummer}.${dateiendung}`;
      }

      pruefeNaechsteEndung();
    });
  }

  document.querySelectorAll(".automatische-galerie").forEach(async (galerie) => {
    const hoechsteNummer = Number.parseInt(galerie.dataset.von, 10);
    const niedrigsteNummer = Number.parseInt(galerie.dataset.bis, 10);

    if (
      !Number.isInteger(hoechsteNummer) ||
      !Number.isInteger(niedrigsteNummer) ||
      hoechsteNummer < niedrigsteNummer ||
      niedrigsteNummer < 0
    ) {
      return;
    }

    const bildNummern = [];
    for (let nummer = hoechsteNummer; nummer >= niedrigsteNummer; nummer -= 1) {
      bildNummern.push(nummer);
    }

    const bilder = await Promise.all(bildNummern.map(findeBild));

    bilder.forEach((bild) => {
      if (!bild) {
        return;
      }

      const figure = document.createElement("figure");
      const beschriftung = document.createElement("figcaption");
      beschriftung.textContent = bild.src.split("/").pop();
      beschriftung.hidden = !beschriftungenSichtbar;

      figure.appendChild(bild);
      figure.appendChild(beschriftung);
      galerie.appendChild(figure);
    });
  });
});
