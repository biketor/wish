# Genera los archivos binarios de iconos a partir de los .base64 ya presentes en `icons/`
# Ejecutar desde PowerShell en la raíz del proyecto:
#   .\scripts\generate-icons.ps1

$files = @(
    @{src = 'icons\\icon-192.png.base64'; dst = 'icons\\icon-192.png'},
    @{src = 'icons\\icon-512.png.base64'; dst = 'icons\\icon-512.png'},
    @{src = 'icons\\favicon.ico.base64'; dst = 'favicon.ico'}
)

foreach ($f in $files) {
    if (Test-Path $f.src) {
        Write-Host "Decodificando $($f.src) -> $($f.dst)"
        try {
            $b64 = Get-Content -Raw $f.src
            [IO.File]::WriteAllBytes($f.dst, [Convert]::FromBase64String($b64))
            Write-Host "OK: $($f.dst) creado."
        } catch {
            Write-Host "Error decodificando $($f.src): $_" -ForegroundColor Red
        }
    } else {
        Write-Host "No existe: $($f.src)" -ForegroundColor Yellow
    }
}

Write-Host "Hecho. Asegúrate de reemplazar estos placeholders por iconos reales 192x192 y 512x512 para la PWA."