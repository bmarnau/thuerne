document.addEventListener('DOMContentLoaded', () => {

  const toggleButton = document.getElementById('padlet-toggle');
  const padletContainer = document.getElementById('padlet-container');
  const toggleButton2 = document.getElementById('padlet-toggle2');
  const padletContainer2 = document.getElementById('padlet-container2');

  if (!toggleButton || !padletContainer) return;

  const datumAlsIso = (datum) => {
    const jahr = datum.getFullYear();
    const monat = String(datum.getMonth() + 1).padStart(2, '0');
    const tag = String(datum.getDate()).padStart(2, '0');
    return `${jahr}-${monat}-${tag}`;
  };

  const naechsterBacktermin = (heute = new Date()) => {
    const heuteIso = datumAlsIso(heute);
    const termine = [...document.querySelectorAll('[data-backtermin]')]
      .map((element) => element.dataset.backtermin)
      .filter((datum) => /^\d{4}-\d{2}-\d{2}$/.test(datum))
      .sort();

    const letzterVergangenerTermin = [...termine].reverse().find((datum) => datum < heuteIso);
    if (letzterVergangenerTermin) {
      const [jahr, monat, tag] = letzterVergangenerTermin.split('-').map(Number);
      const wochenende = new Date(jahr, monat - 1, tag, 12);
      const tageBisSonntag = (7 - wochenende.getDay()) % 7;
      wochenende.setDate(wochenende.getDate() + tageBisSonntag);

      if (heuteIso <= datumAlsIso(wochenende)) {
        return letzterVergangenerTermin;
      }
    }

    return termine.find((datum) => datum >= heuteIso) || null;
  };

  const datumDeutsch = (isoDatum) => {
    const [jahr, monat, tag] = isoDatum.split('-');
    return `${tag}.${monat}.${jahr}`;
  };

  let aktuellerBacktermin = null;
  let padletLoaded = false;

  const beschriftungAktualisieren = () => {
    if (!aktuellerBacktermin) {
      toggleButton.textContent = 'Brotbacken – derzeit kein neuer Backtermin';
      toggleButton.disabled = true;
      return;
    }

    const aktion = padletLoaded ? 'Padlet ausblenden' : 'Padlet laden';
    toggleButton.textContent = `Brotbacken am ${datumDeutsch(aktuellerBacktermin)} – ${aktion}`;
    toggleButton.disabled = false;
  };

  const backterminAktualisieren = (heute = new Date()) => {
    aktuellerBacktermin = naechsterBacktermin(heute);
    beschriftungAktualisieren();
    return aktuellerBacktermin;
  };

  window.ServicePadlets = { backterminAktualisieren, naechsterBacktermin };
  backterminAktualisieren();

  toggleButton.addEventListener('click', () => {

    if (!padletLoaded) {

      const iframe = document.createElement('iframe');
      iframe.src = "https://padlet.com/info34264/anmeldung-zum-brotbacktermin-am-14-m-rz-2026-ovz159uqcyxlu6fu";
      iframe.className = "padlet-frame";
      iframe.loading = "lazy";
      iframe.title = "Padlet Board";
      iframe.setAttribute("allowfullscreen", "");

      padletContainer.innerHTML = "";
      padletContainer.appendChild(iframe);

      padletContainer.classList.remove("hidden");

      padletLoaded = true;
      beschriftungAktualisieren();

    } else {

      padletContainer.innerHTML = "";
      padletContainer.classList.add("hidden");

      padletLoaded = false;
      beschriftungAktualisieren();

    }

  });


if (!toggleButton2 || !padletContainer2) return;

  let padletLoaded2 = false;

  toggleButton2.addEventListener('click', () => {

    if (!padletLoaded2) {

      const iframe = document.createElement('iframe');
      iframe.src = "https://padlet.com/info34264/8-pflanzenb-rse-rqxasoqwxlw3n7mk";
      iframe.className = "padlet-frame";
      iframe.loading = "lazy";
      iframe.title = "Padlet Board";
      iframe.setAttribute("allowfullscreen", "");

      padletContainer2.innerHTML = "";
      padletContainer2.appendChild(iframe);

      padletContainer2.classList.remove("hidden");

      toggleButton2.textContent = "Pflanzenbörse im Mai - Padlet ausblenden";
      padletLoaded2 = true;

    } else {

      padletContainer2.innerHTML = "";
      padletContainer2.classList.add("hidden");

      toggleButton2.textContent = "Pflanzenbörse im Mai - Padlet laden";
      padletLoaded2 = false;

    }

  });

});

const flyer = document.getElementById("flyer");
const popup = document.getElementById("flyerPopup");
const closeFlyer = document.getElementById("closeFlyer");

// Der Flyer ist nur auf der Service-Seite vorhanden; andere Seiten bleiben fehlerfrei.
if (flyer && popup && closeFlyer) {
  flyer.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  closeFlyer.addEventListener("click", () => {
    popup.style.display = "none";
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popup.style.display = "none";
    }
  });
}
