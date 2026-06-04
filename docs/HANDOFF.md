# Guía de entrega — Top Rentals (desarrollador)

Documento para quien retome el proyecto: clonar, desarrollar, desplegar y editar contenido.

## 1. Qué es este proyecto

- **Frontend + backend ligero** en Next.js (App Router).
- **Sin base de datos SQL**: textos, propiedades, blog y reseñas se guardan en **archivos JSON** y, en producción en Vercel, en **Vercel Blob**.
- **Reservas**: no están implementadas en código propio; el motor es **GNAHS** (`hostalric.gnahs.app`) embebido en `/reservas`, widget en home, etc.
- **Panel admin**: `/admin` (login con `ADMIN_TOKEN`).

## 2. Requisitos

- Node.js 20+ (recomendado LTS)
- npm
- Cuenta Vercel + Blob Store para producción
- Credenciales GNAHS (account manager) para producción y dominio autorizado

## 3. Primer arranque

```bash
git clone <URL_DEL_REPO_CLIENTE>
cd top-rentals
npm install
cp .env.example .env.local
```

Completar en `.env.local` al menos:

- `ADMIN_TOKEN` — contraseña del panel
- Variables `NEXT_PUBLIC_GNAHS_*` (ver `.env.example` y `src/lib/gnahs/config.ts`)

```bash
npm run dev
```

## 4. Variables de entorno

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `ADMIN_TOKEN` | Sí (prod + admin) | Login `/admin/login` |
| `BLOB_READ_WRITE_TOKEN` | Sí en Vercel | Guardar JSON e imágenes desde el panel |
| `NEXT_PUBLIC_GNAHS_WIDGET_UUID` | Sí (sitio público) | Widget buscador |
| `NEXT_PUBLIC_GNAHS_API_URL` | Sí | API motor GNAHS |
| `NEXT_PUBLIC_GNAHS_ASSETS_URL` | Sí | Assets GNAHS |
| `NEXT_PUBLIC_GNAHS_BOOKING_ROUTE` | No (default `/reservas`) | Ruta del motor |
| `NEXT_PUBLIC_GNAHS_MY_BOOKING_URL` | No | Mis reservas |
| `GNAHS_SECRET_KEY` | Si usás APIs servidor | Descargas / integraciones |
| `GNAHS_DOWNLOAD_KEY` | Si usás APIs servidor | Idem |

En **local** sin `BLOB_READ_WRITE_TOKEN`: lectura/escritura en JSON del repo y `public/uploads/`.

En **Vercel** sin Blob: el panel **no puede guardar** (error explícito en `src/lib/vercelBlob.ts`).

## 5. Dónde está el contenido

| Archivo / área | Qué controla |
|----------------|--------------|
| `home-content.json` | Home, header y footer (slugs `home-header`, `home`, `home-footer` en admin) |
| `corporate-content.json` | `/corporate` |
| `propiedades-content.json` | Textos del listado `/propiedades` |
| `properties-catalog.json` | Edificios: listado, fichas, destacados home, ofertas |
| `property-reviews.json` | Reseñas por propiedad (admin comentarios) |
| `blog-data.json` | Blog |
| `marketing-config.json` | Botón flotante y barra de campaña |
| `real-estate-content.json` | `/real-estate` |
| `trabaja-content.json`, `propietarios-content.json`, `contacto-content.json`, etc. | Otras landings |
| `public/uploads/` | Subidas en desarrollo local |
| Vercel Blob `top-rentals/content/*` | JSON editado en producción |
| Vercel Blob `top-rentals/uploads/*` | Medios subidos en producción |

Lógica de lectura: `src/lib/fsJson.ts` (merge disco + blob).

## 6. Panel de administración

| Ruta | Función |
|------|---------|
| `/admin/login` | Acceso |
| `/admin/paginas/*` | Textos por página |
| `/admin/propiedades` | Catálogo de edificios |
| `/admin/propiedades/comentarios` | Reseñas |
| `/admin/blog` | Entradas de blog |
| `/admin/marketing` | Sticky reservar + barra campaña |
| `/admin/imagenes` | Slots globales de imagen |

Rutas internas del sitio en el panel están **bloqueadas o en selector** (`src/lib/pageContent/siteRoutes.ts`) para evitar URLs rotas.

## 7. Rutas públicas principales

`/`, `/propiedades`, `/propiedades/[slug]`, `/corporate`, `/reservas`, `/reservas/buenos-aires`, `/reservas/quito`, `/blog`, `/club-top-rentals`, `/real-estate`, `/contacto`, etc.

Redirects en `next.config.ts` (ej. `/reservar` → `/reservas`).

## 8. GNAHS

Leer obligatoriamente:

- [GNAHS-INTEGRACION.md](./GNAHS-INTEGRACION.md)
- [GNAHS-WIDGET.md](./GNAHS-WIDGET.md)

Config central: `src/lib/gnahs/config.ts`.  
En producción, GNAHS debe **autorizar el dominio** HTTPS (ej. `thetoprentals.com`). En `localhost` el widget puede devolver 401 hasta que lo habiliten.

## 9. Flujo de trabajo Git (equipo cliente)

1. Clonar el repo de la organización del cliente.
2. Rama `main` (o `develop` si definen Git Flow).
3. Cambios → commit → push → deploy automático en Vercel (si está conectado).
4. No commitear `.env.local` (está en `.gitignore`).
5. Los JSON de contenido en repo son **plantilla/backup**; en producción el panel puede haber actualizado Blob.

## 10. Pasos manuales fuera del código

- [ ] Crear proyecto Vercel y conectar repo
- [ ] Crear **Blob Store** y vincular `BLOB_READ_WRITE_TOKEN`
- [ ] Configurar todas las variables de entorno en Vercel
- [ ] Dominio `thetoprentals.com` en Vercel (DNS del cliente apuntando a Vercel)
- [ ] Pedir a GNAHS whitelist del dominio de producción
- [ ] Rotar `ADMIN_TOKEN` en entrega (no usar el de desarrollo)
- [ ] Probar guardado en admin, motor `/reservas`, subida de imagen

## 11. Archivos clave de código

| Área | Ubicación |
|------|-----------|
| Auth admin | `src/lib/auth.ts`, `src/proxy.ts` |
| Uploads | `src/lib/upload.ts`, `src/lib/vercelBlob.ts` |
| Propiedades | `src/lib/properties/*` |
| Páginas CMS | `src/lib/pageContent/schemas.ts`, `pageActions.ts` |
| Marketing | `src/lib/marketing/*` |

## 12. Soporte

Ante dudas de negocio (copy, qué edificio es destacado), el cliente define criterio; la implementación está en admin y JSON/Blob.
