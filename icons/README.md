Archivos de iconos (placeholders)

-para ejecutar proyecto
npx http-sever -p 8080
Estos archivos contienen una imagen placeholder (1x1 transparente) codificada en base64.

Archivos:
- `favicon.ico.base64`  → base64 del placeholder (puedes convertirlo a `favicon.ico`)
- `icon-192.png.base64` → base64 del placeholder (192x192 placeholder)
- `icon-512.png.base64` → base64 del placeholder (512x512 placeholder)

Cómo generar los binarios desde PowerShell (ejecutar en la carpeta del proyecto `c:\Users\Biketor\Documents\project\wizh`):

# Generar `favicon.ico` desde base64
$base64 = Get-Content -Raw .\\icons\\favicon.ico.base64
[IO.File]::WriteAllBytes('.\\favicon.ico',[Convert]::FromBase64String($base64))

# Generar `icons/icon-192.png`
$base64 = Get-Content -Raw .\\icons\\icon-192.png.base64
[IO.File]::WriteAllBytes('.\\icons\\icon-192.png',[Convert]::FromBase64String($base64))

# Generar `icons/icon-512.png`
$base64 = Get-Content -Raw .\\icons\\icon-512.png.base64
[IO.File]::WriteAllBytes('.\\icons\\icon-512.png',[Convert]::FromBase64String($base64))

Notas:
- Los archivos que se crean con estos comandos son placeholders (1x1 PNG). Reemplázalos luego por tus iconos reales 192x192 y 512x512.
- Si prefieres que yo cree directamente los binarios en el repo, dime y los escribiré en la raíz/proyecto (necesito tu confirmación).