# Git Flow - Estructura de Branches

Este proyecto usa **Git Flow** para organizar el desarrollo y despliegues.

## Branches Principales

### 🟢 `main` - Producción
- Código estable y probado
- Se despliega automáticamente a: **https://wizh.vercel.app**
- Solo se actualiza mediante Pull Requests desde `develop`
- Workflow: [`.github/workflows/vercel.yml`](.github/workflows/vercel.yml)

### 🟡 `develop` - Desarrollo
- Versión preliminar con últimas features
- Se despliega automáticamente a Vercel Preview URL
- Branch base para nuevas features
- Workflow: [`.github/workflows/vercel-preview.yml`](.github/workflows/vercel-preview.yml)

## Comandos Básicos

### Cambiar de Branch
```bash
# Cambiar a develop
git checkout develop

# Cambiar a main
git checkout main

# Cambiar a un branch remoto que no tienes localmente
git fetch origin
git checkout nombre-branch
```

### Ver Branches
```bash
# Ver branch actual (tiene un *)
git branch

# Ver todos los branches (locales y remotos)
git branch -a

# Ver solo remotos
git branch -r
```

### Obtener Branches Remotos
```bash
# Descargar información de branches remotos sin mergear
git fetch origin

# Descargar un branch específico del remoto
git fetch origin nombre-branch

# Después de fetch, cambiar al branch
git checkout nombre-branch
```

### Actualizar Branch Actual
```bash
# Obtener últimos cambios del remoto
git pull origin nombre-branch

# O si ya estás en el branch
git pull
```

## Flujo de Trabajo

### 1️⃣ Desarrollo de Features
```bash
# Desde develop, crear un feature branch
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature

# Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# Subir feature
git push origin feature/nombre-feature
```

### 2️⃣ Merge a Develop (Preview)
```bash
# Crear Pull Request: feature/nombre-feature → develop
# Revisar, aprobar y mergear en GitHub
# O localmente:
git checkout develop
git merge feature/nombre-feature
git push origin develop
```

✅ **Se despliega automáticamente a Vercel Preview**

### 3️⃣ Release a Producción
```bash
# Cuando develop esté listo para producción
# Crear Pull Request: develop → main
# Revisar, aprobar y mergear en GitHub
# O localmente:
git checkout main
git merge develop
git push origin main
```

✅ **Se despliega automáticamente a producción: https://wizh.vercel.app**

## Tipos de Commits (Conventional Commits)

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Formateo, espacios (no afecta código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o corregir tests
- `chore:` - Mantenimiento, dependencias

## Ejemplo Completo

```bash
# 1. Crear feature
git checkout develop
git checkout -b feature/login-firebase

# 2. Desarrollar
git add .
git commit -m "feat: add Firebase authentication"
git push origin feature/login-firebase

# 3. Merge a develop (crear PR en GitHub)
# develop se despliega a preview automáticamente

# 4. Cuando esté listo, merge a main (crear PR en GitHub)
# main se despliega a producción automáticamente
```

## URLs de Despliegue

- **Producción (`main`)**: https://wizh.vercel.app
- **Preview (`develop`)**: URL generada por Vercel en cada push
- **Feature branches**: Crear manualmente con `vercel` CLI si se necesita

## Protección de Branches (Recomendado)

Configura en GitHub:
- https://github.com/biketor/wish/settings/branches

**Para `main`:**
- ✅ Require pull request before merging
- ✅ Require status checks to pass (Vercel deployment)
- ✅ Require branches to be up to date

**Para `develop`:**
- ✅ Require pull request before merging (opcional)

---

**Última actualización**: Diciembre 17, 2025
