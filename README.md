# Thuerne - Website

Eine professionelle HTML-Website erstellt mit Dreamweaver.

## 📁 Projektstruktur

```
thuerne/
├── index.html              # Startseite
├── bilder/                 # Bildmaterial
├── css/
│   ├── style.css          # Hauptstile
│   └── cookie.css         # Cookie-Banner Styles
├── docs/                  # Dokumentenseiten
│   ├── galerie.html       # Galerie
│   ├── service.html       # Services
│   ├── kontakt.html       # Kontakt
│   ├── kalender.html      # Kalender
│   ├── gesundheit.html    # Gesundheit
│   ├── datenschutz.html   # Datenschutzerklärung
│   └── impressum.html     # Impressum
├── favicon/               # Favicon-Dateien
├── fonts/                 # Custom-Fonts
├── images/                # Bilder und Icons
└── js/
    ├── script.js          # Hauptscript
    ├── galerie.js         # Galerie-Funktionalität
    └── service.js         # Service-Funktionalität
```

## 🚀 Erste Schritte

1. Repository klonen:
```bash
git clone https://github.com/yourusername/thuerne.git
cd thuerne
```

2. Local mit Dreamweaver öffnen und bearbeiten

3. Änderungen commiten und pushen:
```bash
git add .
git commit -m "Beschreibung der Änderungen"
git push origin main
```

## 📝 Git-Workflow

### Neue Features / Bugfixes
```bash
# Neuen Branch erstellen
git checkout -b feature/beschreibung

# Änderungen commiten
git add .
git commit -m "Feature: kurze Beschreibung"

# Zu main mergen
git checkout main
git merge feature/beschreibung
```

## 📋 Wichtige Dateien

- `.gitignore` - Ignorierte Dateien (Dreamweaver-Temp-Dateien, etc.)
- `README.md` - Diese Datei

## ⚙️ Empfehlungen für GitHub

1. **Repository auf GitHub erstellen** unter deinem Account
2. **SSH-Keys einrichten** für sichere Verbindung
3. **Remote hinzufügen**:
```bash
git remote add origin https://github.com/yourusername/thuerne.git
git branch -M main
git push -u origin main
```

4. **Branch-Protection** in GitHub-Settings aktivieren (optional)
5. **README & Dokumentation** regelmäßig aktualisieren

## 📄 Lizenz

[LICENSE hinzufügen - z.B. MIT, GPL, etc.]

## 👤 Kontakt

[Kontaktinformationen einfügen]

---

**Hinweis**: Stelle sicher, dass sensible Daten (API-Keys, Passwörter) in der `.env` Datei sind und nicht committed werden!
