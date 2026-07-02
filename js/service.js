document.addEventListener('DOMContentLoaded', () => {

  const toggleButton = document.getElementById('padlet-toggle');
  const padletContainer = document.getElementById('padlet-container');
  const toggleButton2 = document.getElementById('padlet-toggle2');
  const padletContainer2 = document.getElementById('padlet-container2');

  if (!toggleButton || !padletContainer) return;

  let padletLoaded = false;

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

      toggleButton.textContent = "Botbacken im April - Padlet ausblenden";
      padletLoaded = true;

    } else {

      padletContainer.innerHTML = "";
      padletContainer.classList.add("hidden");

      toggleButton.textContent = "Botbacken im April - Padlet laden";
      padletLoaded = false;

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