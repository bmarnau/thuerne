[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^\d{4}-(0[1-9]|1[0-2])$')]
  [string]$Monat,

  [switch]$MitGitHub,
  [switch]$ArbeitsstandErlaubt
)

$ErrorActionPreference = 'Stop'
$projekt = Split-Path -Parent $PSScriptRoot
Push-Location $projekt

try {
  Write-Host "Monatscheck für $Monat" -ForegroundColor Cyan

  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    throw 'Node.js wurde nicht gefunden. Bitte Node.js installieren oder den Check über GitHub Actions ausführen.'
  }

  $env:MONATSCHECK_MONAT = $Monat
  try {
    & $node.Source --test tests/*.test.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Die Website-Tests sind fehlgeschlagen.' }
  }
  finally {
    Remove-Item Env:MONATSCHECK_MONAT -ErrorAction SilentlyContinue
  }

  git diff --check
  if ($LASTEXITCODE -ne 0) { throw 'Git meldet problematische Leerzeichen.' }

  $status = @(git status --porcelain)
  if ($status.Count -gt 0) {
    Write-Host 'Noch nicht eingecheckte Dateien oder Änderungen:' -ForegroundColor Yellow
    $status | ForEach-Object { Write-Host "  $_" }
    if (-not $ArbeitsstandErlaubt) {
      throw 'Der Git-Arbeitsstand ist nicht sauber. Änderungen zuerst prüfen und einchecken.'
    }
  }

  if ($MitGitHub) {
    gh auth status
    if ($LASTEXITCODE -ne 0) { throw 'Die GitHub-Anmeldung ist nicht aktiv.' }

    gh pr checks
    if ($LASTEXITCODE -ne 0) { throw 'Die GitHub-Prüfungen sind nicht vollständig grün.' }
  }

  Write-Host 'Monatscheck erfolgreich.' -ForegroundColor Green
}
finally {
  Pop-Location
}
