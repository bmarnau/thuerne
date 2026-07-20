document.addEventListener("DOMContentLoaded", () => {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  const monatsgruppen = document.querySelectorAll(".monatsgruppe");
  const keineTermine = document.getElementById("keine-monatstermine");
  let naechsteGruppeGefunden = false;

  monatsgruppen.forEach((gruppe) => {
    const termine = gruppe.querySelectorAll(".termin-karte");
    let zukuenftigeTermine = 0;

    termine.forEach((termin) => {
      const datumText = termin.querySelector("time")?.getAttribute("datetime");
      const terminDatum = datumText ? new Date(`${datumText}T00:00:00`) : null;
      const istZukuenftig = terminDatum && !Number.isNaN(terminDatum.getTime()) && terminDatum >= heute;

      termin.hidden = !istZukuenftig;
      if (istZukuenftig) zukuenftigeTermine += 1;
    });

    const istNaechsteGruppe = !naechsteGruppeGefunden && zukuenftigeTermine > 0;
    gruppe.hidden = !istNaechsteGruppe;

    if (istNaechsteGruppe) naechsteGruppeGefunden = true;
  });

  if (keineTermine) keineTermine.hidden = naechsteGruppeGefunden;

  const ladenButton = document.getElementById("kalender-laden");
  const kalenderContainer = document.getElementById("kalender-container");

  if (!ladenButton || !kalenderContainer) return;

  ladenButton.addEventListener("click", () => {
    const istSichtbar = !kalenderContainer.classList.contains("hidden");

    if (!kalenderContainer.querySelector("iframe")) {
      const iframe = document.createElement("iframe");
      iframe.src = ladenButton.dataset.kalenderUrl;
      iframe.title = "Google-Veranstaltungskalender der Dörfergemeinschaft Thürne";
      iframe.loading = "lazy";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("scrolling", "no");
      kalenderContainer.appendChild(iframe);
    }

    kalenderContainer.classList.toggle("hidden", istSichtbar);
    ladenButton.setAttribute("aria-expanded", String(!istSichtbar));
    ladenButton.textContent = istSichtbar ? "Google-Kalender laden" : "Google-Kalender ausblenden";
  });
});
