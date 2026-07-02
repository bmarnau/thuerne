document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('galerie-container');
  const anzahlBilder = 15; // Anzahl der Bilder im Ordner
  const ordnerPfad = '../bilder/';
  const dateipraefix = 'bild'; // z.B. bild1.jpg, bild2.jpg, ...
  const dateiendung = '.jpeg';

  for (let i = 1; i <= anzahlBilder; i++) {
    const img = document.createElement('img');
    img.src = `${ordnerPfad}${dateipraefix}${i}${dateiendung}`;
    img.alt = `Bild ${i}`;
    img.onerror = () => {
      img.remove(); // Bild existiert nicht, also nicht anzeigen
    };
    container.appendChild(img);
  }
});
