document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      menu.classList.toggle("visible");
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

  const galerieContainer = document.getElementById("galerie-container");

  if (galerieContainer) {
    const imageCount = 12;
    const folder = "bilder/";
    const prefix = "bild";
    const extension = ".jpg";

    for (let i = 1; i <= imageCount; i++) {
      const img = document.createElement("img");
      img.src = `${folder}${prefix}${i}${extension}`;
      img.alt = `Bild ${i}`;
      img.onerror = () => img.remove();
      galerieContainer.appendChild(img);
    }
  }
});