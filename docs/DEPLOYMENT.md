# Despliegue — Vercel y dominio thetoprentals.com

## Modelo recomendado (propiedad del cliente)

1. El **cliente** crea cuenta en [GitHub](https://github.com) (organización recomendada, ej. `top-rentals` o nombre legal).
2. El **cliente** crea cuenta/team en [Vercel](https://vercel.com).
3. El desarrollador hace **push** del código al repo del cliente (o transferencia del repo).
4. En Vercel del cliente: **Import Project** → elegir el repo → framework **Next.js** (detección automática).
5. El **cliente** configura DNS del dominio para apuntar a Vercel.
6. Resultado: sitio en `https://thetoprentals.com/` (sin subdominio `.vercel.app` en producción).

## Configuración en Vercel

### Build

| Campo | Valor |
|-------|--------|
| Framework Preset | Next.js |
| Build Command | `npm run build` (default) |
| Output | Next.js default |
| Install Command | `npm install` (default) |
| Node.js Version | 20.x (recomendado) |

No hace falta `vercel.json` en el repo para un despliegue estándar.

### Environment Variables (Production)

Copiar desde `.env.example` y completar en Vercel → Settings → Environment Variables:

- `ADMIN_TOKEN` — **generar uno nuevo y seguro** para producción
- `BLOB_READ_WRITE_TOKEN` — desde Blob Store (ver abajo)
- `NEXT_PUBLIC_GNAHS_*` — según contrato GNAHS
- `GNAHS_SECRET_KEY`, `GNAHS_DOWNLOAD_KEY` — si se usan funciones servidor

Marcar variables públicas (`NEXT_PUBLIC_*`) también en **Preview** si se usan preview deployments.

### Vercel Blob (obligatorio)

1. En el proyecto Vercel: **Storage** → **Create Database/Store** → **Blob**.
2. **Connect** al proyecto Next.js.
3. Vercel inyecta `BLOB_READ_WRITE_TOKEN` automáticamente (verificar que exista en Environment Variables).

Sin Blob, en producción:

- El sitio **puede leer** JSON del build/repo.
- El panel **no guarda** cambios (error al guardar).

Prefijos usados en código:

- `top-rentals/content/*.json` — contenido editado
- `top-rentals/uploads/*` — imágenes/videos subidos

Medios servidos por la app: `/api/media/top-rentals/...`

### Dominio personalizado

1. Vercel → Project → **Settings** → **Domains**.
2. Agregar `thetoprentals.com` y `www.thetoprentals.com` (si aplica).
3. En el registrador DNS del cliente, seguir instrucciones de Vercel (registros A/CNAME o nameservers).
4. Esperar propagación SSL (certificado automático Let's Encrypt en Vercel).

### Redirects

Definidos en `next.config.ts` (no en panel Vercel):

- `/reservar` → `/reservas`
- `/misreservas` → `/mis-reservas`
- `/quienes-somos` → `/nosotros`
- `/trabaja` → `/trabaja-con-nosotros`

## Checklist post-deploy

- [ ] Home carga y widget GNAHS responde (no 401)
- [ ] `/reservas` muestra motor
- [ ] Login `/admin` y guardar un texto de prueba
- [ ] Subir imagen de prueba en propiedades o imágenes
- [ ] `thetoprentals.com` resuelve con HTTPS
- [ ] Redirects legacy funcionan

## Migrar desde otra cuenta Vercel

No existe “migración automática” de Blob entre cuentas. Plan:

1. Nuevo proyecto en Vercel del cliente + nuevo Blob.
2. Deploy desde repo.
3. Re-subir medios críticos desde admin **o** export/import manual de blobs (soporte Vercel / scripts).
4. Revisar que JSON en Blob se reescriba al guardar en admin (o copiar JSON desde repo si parten de cero).

## Desarrollo local vs producción

| | Local | Vercel producción |
|---|--------|-------------------|
| Contenido JSON | Archivos en repo | Blob (+ merge con repo en lectura) |
| Uploads | `public/uploads/` | Blob |
| GNAHS | Puede fallar sin dominio autorizado | Dominio producción autorizado |
