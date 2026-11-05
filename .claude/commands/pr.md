---
description: Branch, Commits und Pull Request vorbereiten (ohne Merge)
argument-hint: "[kurze Beschreibung der Änderung]"
---

Bereite die aktuellen Änderungen für GitHub vor. Beschreibung: $ARGUMENTS

1. `gh auth status` prüfen (nicht neu anmelden, wenn aktiv); `git fetch`,
   `git status -sb`.
2. Steht der Arbeitsordner auf `main`, einen Branch `feature/…` oder `fix/…`
   anlegen. Gibt es für den aktuellen Branch schon einen offenen PR
   (`gh pr list --head <branch>`), diesen weiterverwenden statt einen neuen
   anzulegen.
3. Nur die zum Auftrag gehörenden Dateien committen; unversionierte Fotos und
   fremde Änderungen nicht mitnehmen. Kleine Commits, Conventional Commits auf
   Deutsch (`feat:`, `fix:`, `docs:`, `chore:`).
4. Vorher `npm test`; bei Fehlern abbrechen und berichten.
5. Commits, Branch und geplanten PR-Text zeigen und auf Freigabe warten.
6. Nach Freigabe: `git push` (nie Force), dann PR gegen `main` mit
   `.github/pull_request_template.md` anlegen bzw. die Beschreibung des
   vorhandenen PRs aktualisieren.
7. `gh pr checks` abwarten und berichten. Niemals mergen.

Abschluss: PR-Link, `git log --oneline -3`, Testergebnis, Upload-Liste für den
Webserver.
