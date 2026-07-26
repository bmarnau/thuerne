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

  /*
    Das Startfenster wird bewusst nicht hier gesteuert.
    Redaktionelle Veranstaltungen und Galeriebilder stehen getrennt und
    ausführlich kommentiert in js/start-hinweis.js.
  */
});
