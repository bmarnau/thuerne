# Projektanweisungen für ChatGPT/Codex

## Git- und GitHub-Anmeldung

- Prüfe vor einer erneuten Anmeldung zuerst den vorhandenen Status mit
  `gh auth status`.
- Wenn für dieses Projekt eine Git- oder GitHub-Anmeldung erforderlich ist,
  verwende für die Anmeldung auf dem Windows-PC PowerShell.
- Gib dem Benutzer für die Anmeldung ausschließlich PowerShell-kompatible
  Befehle, insbesondere `gh auth login`.
- Nutze nach Möglichkeit den vorhandenen GitHub-CLI-Anmeldestatus, statt eine
  neue Anmeldung anzustoßen.
- Speichere niemals Passwörter, Zugriffstoken oder andere Zugangsdaten im
  Repository, in Skripten oder in der Projektdokumentation.

## Tagesstart und Tagesabschluss

Diese Regeln gelten für jede KI-Sitzung, unabhängig vom Werkzeug. Tagesstart und Tagesabschluss folgen `SITZUNGSROUTINE.md` aus `bmarnau-standards/ai-development-governance` (Entwurf). Das Tagesprotokoll liegt unter `docs/protokolle/` und wird per Branch und Pull Request abgelegt. Das Repository ist öffentlich: Das Protokoll enthält nur, was das Projekt ohnehin veröffentlicht (TP-09), also keine Personennamen außer Rollen, keine Kosten, Vertrags- oder Entscheidungsinterna, keine Zugangsdaten und keine Hinweise auf Sicherheitslücken.

```yaml
sitzungsroutine:
  standard: bmarnau-standards/ai-development-governance, SITZUNGSROUTINE.md
  repos:
    - bmarnau/thuerne
  arbeitsklon: C:\dev\sonstiges\thuerne   # CLAUDE.md nennt noch C:\dev\thuerne (offen)
  aufgaben: offen      # keine Aufgabenquelle im Repository; GitHub-Issues bisher leer
  plan: offen          # kein Arbeitsplan; Änderungsstand in CHANGELOG.md, Abschnitt [Unreleased]
  wiederanlauf:
    - AGENTS.md
    - CLAUDE.md
    - README.md
    - CHANGELOG.md
    - TESTBERICHT.md
    - UPLOAD-WEBSERVER.md
  ziel: offen          # kein Projektziel oder Meilenstein im Repository belegt
  geschuetzt:
    - main
  protokoll:
    repo: bmarnau/thuerne
    ort: docs/protokolle/
    weg: pr
    sichtbarkeit: oeffentlich
  zusatz:
    - TS-01: gh auth status (Abschnitt "Git- und GitHub-Anmeldung")
    - TS-01: npm test (lokal), npm run test:live (nur lesend, öffentliche Webseite und API)
    - Monatswechsel: MONATSCHECK.md (Bild und Film des Monats)
    - TA-01: hochzuladende Dateien nach UPLOAD-WEBSERVER.md nennen
```
