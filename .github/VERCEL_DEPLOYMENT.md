# Vercel Deployment - Troubleshooting

## Estado Actual
❌ **El workflow falló en el primer intento**

El build local funciona correctamente, por lo que el problema está en la configuración de GitHub Secrets.

## Verificar Secrets en GitHub

Ve a: https://github.com/biketor/wish/settings/secrets/actions

Debes tener estos **3 secrets** configurados:

### 1. VERCEL_TOKEN
```
MoZqVaqSrfK4iZxDLivMnnAo
```

### 2. VERCEL_ORG_ID
```
team_s6aFAmW8pwuncUiZITB96UPQ
```

### 3. VERCEL_PROJECT_ID
```
prj_fgNBhBPdcKolSAtfOtyb2OTtFmXk
```

## Pasos para Corregir

### Si los secrets ya están agregados:
1. Verifica que los nombres sean **exactamente** como arriba (case-sensitive)
2. Verifica que no haya espacios al inicio o final de los valores
3. Vuelve a ejecutar el workflow:
   - Ve a: https://github.com/biketor/wish/actions/runs/20316523294
   - Click en "Re-run all jobs"

### Si falta algún secret:
1. Ve a: https://github.com/biketor/wish/settings/secrets/actions/new
2. Agrega el secret faltante
3. Guarda y ejecuta el workflow nuevamente

## Probar el Deployment Manualmente

Si el workflow sigue fallando, puedes desplegar manualmente:

```powershell
# Desde la raíz del proyecto
vercel --prod
```

Esto subirá el proyecto directamente a producción.

## Ver Logs Detallados

Para ver exactamente qué falló:
1. Ve a: https://github.com/biketor/wish/actions/runs/20316523294
2. Click en el job "deploy"
3. Expande el paso que falló (probablemente "Deploy Project Artifacts to Vercel")
4. Lee el error específico

## Alternativa: Despliegue Automático desde Vercel

Si prefieres, puedes usar el despliegue automático nativo de Vercel:

1. Ve a: https://vercel.com/victor-jss-projects/wizh/settings/git
2. Activa "Production Branch": `main`
3. Vercel desplegará automáticamente cada push sin necesidad del workflow de GitHub Actions

---

**Última actualización**: Diciembre 17, 2025
