# Inicia el servidor desde esta carpeta y abre el navegador.
# Ejecutar: .\abrir-servidor.ps1

Set-Location $PSScriptRoot

$puerto = 8080
$url = "http://localhost:$puerto"

# Abrir navegador dentro de 3 segundos (da tiempo a que arranque serve)
Start-Job -ScriptBlock { Start-Sleep 3; Start-Process "http://localhost:8080" } | Out-Null

Write-Host "Iniciando servidor en http://localhost:$puerto ..." -ForegroundColor Cyan
Write-Host "Si 8080 esta en uso, en la terminal aparecera otro puerto (ej. 62966)." -ForegroundColor Gray
Write-Host "En ese caso abre en el navegador: http://localhost:XXXX" -ForegroundColor Gray
Write-Host ""

npx --yes serve -l $puerto
