# Top Rentals — Sitio web

Sitio público y panel de administración en **Next.js 16** (React 19, TypeScript, Tailwind CSS v4).

- Sitio en producción (referencia): [thetoprentals.com](https://thetoprentals.com/)
- Motor de reservas: integración **GNAHS** (externa)
- Contenido editable: JSON en repo + **Vercel Blob** en producción

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/HANDOFF.md](docs/HANDOFF.md) | Entrega a otro desarrollador: arquitectura, variables, contenido |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel, dominio, Blob, checklist |
| [docs/GNAHS-INTEGRACION.md](docs/GNAHS-INTEGRACION.md) | Motor de reservas y widget |
| [docs/CLIENTE-FAQ.md](docs/CLIENTE-FAQ.md) | Respuestas para el cliente (hosting, migración, Laravel) |

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Completar ADMIN_TOKEN y variables GNAHS en .env.local
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). Panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

En local, los cambios del admin se guardan en archivos JSON del repo y en `public/uploads/` (sin Blob).

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir build
npm run lint     # ESLint
```

## Estructura breve

```
src/app/              # Rutas (páginas públicas + /admin)
src/components/       # UI
src/lib/              # Contenido (JSON), propiedades, blog, GNAHS, uploads
*-content.json        # Textos por página (semilla en repo)
properties-catalog.json
blog-data.json
docs/                 # Integración GNAHS y entrega
```

## Repositorio y despliegue

El código debe vivir en un repositorio Git del **cliente** (GitHub recomendado). El despliegue recomendado es **Vercel** con dominio personalizado (`thetoprentals.com`). Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
