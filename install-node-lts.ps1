# Instalar Node.js LTS (añade Node al PATH)
# Ejecutar en PowerShell. Si falla la instalación, abre PowerShell "Como administrador" y vuelve a ejecutar.

$nodeVersion = "24.14.0"
$msiUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$dest = Join-Path $PSScriptRoot "node-v$nodeVersion-x64.msi"

Write-Host "Descargando Node.js LTS v$nodeVersion..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $msiUrl -OutFile $dest -UseBasicParsing
} catch {
    Write-Host "Error al descargar: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Instalando (silencioso, Node se añadira al PATH)..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/i", "`"$dest`"", "/qn", "/norestart" -Wait -Verb RunAs

Write-Host "Listo." -ForegroundColor Green
Write-Host ""
Write-Host "Cierra esta terminal, abre una nueva en Cursor y ejecuta: npx --yes serve -l 8080" -ForegroundColor Yellow
Remove-Item $dest -ErrorAction SilentlyContinue
