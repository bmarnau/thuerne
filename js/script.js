document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  // Markiert auf jeder Seite automatisch den passenden Navigationspunkt.
  const aktuelleDatei = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#menu a").forEach((link) => {
    const zielDatei = new URL(link.href, window.location.href).pathname.split("/").pop() || "index.html";
    if (zielDatei === aktuelleDatei) link.setAttribute("aria-current", "page");
  });

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      menu.classList.toggle("visible");
      // Hält den zugänglichen Menüstatus mit der sichtbaren Darstellung synchron.
      menuToggle.setAttribute("aria-expanded", String(menu.classList.contains("visible")));
    });
  }

  const cookieBanner = document.getElementById("cookie-banner");
  const cookieAccept = document.getElementById("cookie-accept");

  if (cookieBanner && cookieAccept) {
    if (localStorage.getItem("cookieAccepted") === "true") {
      cookieBanner.classList.add("hidden");
    } else {
      cookieBanner.classList.remove("hidden");
    }

    cookieAccept.addEventListener("click", () => {
      localStorage.setItem("cookieAccepted", "true");
      cookieBanner.classList.add("hidden");
    });
  }

  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  const veranstaltungsPopup = document.getElementById("italienPopup");
  const popupSchliessen = veranstaltungsPopup?.querySelector(".veranstaltungs-popup-schliessen");

  if (veranstaltungsPopup) {
    // Am Tag nach der Veranstaltung wird der Hinweis automatisch entfernt.
    const popupEnde = new Date(2026, 7, 2);

    if (new Date() >= popupEnde) {
      veranstaltungsPopup.remove();
    } else {
      const popupEntfernen = () => veranstaltungsPopup.remove();
      popupSchliessen?.addEventListener("click", popupEntfernen);
      veranstaltungsPopup.addEventListener("click", (event) => {
        if (event.target === veranstaltungsPopup) popupEntfernen();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") popupEntfernen();
      });
      popupSchliessen?.focus();
    }
  }

});
