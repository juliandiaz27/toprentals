# Preguntas frecuentes — Cliente / stakeholders

Documento para responder consultas sobre hosting, propiedad, migración y comparación con el sitio anterior.  
Sitio de referencia en producción: [thetoprentals.com](https://thetoprentals.com/)

---

## 1. ¿Dónde está alojado el código? ¿GitHub, GitLab? ¿Quién es el propietario del repositorio?

**Situación actual (transitoria)**  
El código está en un repositorio **Git** alojado en **GitHub** (`github.com/juliandiaz27/toprentals`), bajo la cuenta del desarrollador que implementó la nueva versión.

**Situación objetivo (recomendada y acordada)**  
El cliente crea su propia **organización o cuenta en GitHub** y el código se **transfiere o se vuelve a publicar** en un repositorio de su propiedad. A partir de ese momento, **el propietario del repositorio es el cliente** (o la empresa que designen: ej. Bellini Apartments / Top Rentals).

No se utiliza GitLab en este proyecto.

---

## 2. ¿Está todo versionado en Git o queda algo solo en la máquina del programador?

**Respuesta para el cliente:**  
Todo el código fuente y los archivos de configuración/contenido base del proyecto **quedan versionados en Git** y se suben al repositorio del cliente. **No depende de tener una copia en la PC del desarrollador** para recuperar el proyecto: cualquier persona con acceso al repo puede clonarlo y trabajar.

**Detalle técnico (transparencia):**  
- Los archivos `.env` con contraseñas **no** van al repositorio (por seguridad; están en `.gitignore`).  
- En **producción**, los textos e imágenes editados desde el panel pueden vivir además en **Vercel Blob** (almacenamiento del hosting). Eso no reemplaza a Git: el repo sigue siendo la base del código y una copia de respaldo del contenido inicial.  
- Tras cada entrega, se hace **commit + push** de los cambios pendientes para que el repo refleje el estado actual del desarrollo.

---

## 3. ¿La cuenta de Vercel se puede migrar a una cuenta del cliente?

**Sí. Es el plan previsto.**

Flujo acordado:

1. El **cliente** crea su cuenta (o Team) en [Vercel](https://vercel.com).  
2. Conecta su repositorio de GitHub al nuevo proyecto Vercel.  
3. Configura las **variables de entorno** y el **Blob Store** (ver [DEPLOYMENT.md](./DEPLOYMENT.md)).  
4. Asocia el dominio **thetoprentals.com** en Vercel y delega el DNS desde su registrador.

No es obligatorio “transferir” el proyecto Vercel existente del desarrollador: lo habitual es **crear un proyecto nuevo en la cuenta del cliente** con el mismo código del repo. Así el cliente tiene control total de facturación, accesos y dominios.

---

## 4. ¿Qué configuración específica de Vercel utiliza el proyecto?

Resumen ejecutivo:

| Aspecto | Configuración |
|---------|----------------|
| **Tipo de app** | Next.js 16 (Node.js) |
| **Build** | `npm run build` |
| **Base de datos Vercel** | **No se usa** (no hay Postgres/MySQL en este sitio) |
| **Almacenamiento** | **Vercel Blob** — necesario para que el panel admin guarde textos e imágenes en producción |
| **Variables de entorno** | Token del admin, token de Blob, credenciales y URLs de **GNAHS** (motor de reservas) |
| **Dominio** | Personalizado: `thetoprentals.com` (DNS del cliente → Vercel) |
| **SSL** | Automático en Vercel |
| **Redirects** | Definidos en código (`/reservar` → `/reservas`, etc.) |

Detalle operativo: [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 5. Si mañana migran la web a otro proveedor, ¿hay dependencia fuerte o es migración estándar?

**En líneas generales es una migración estándar de una aplicación Next.js**, con **dos puntos a planificar**:

| Componente | ¿Migrable? | Notas |
|------------|------------|--------|
| **Aplicación web (Next.js)** | Sí | Corre en cualquier hosting con Node (VPS, AWS, Azure, Docker, etc.) |
| **Vercel Blob** | Reemplazable | Hay que migrar archivos a S3, disco o similar y adaptar la capa de guardado (código acotado en `fsJson.ts` / `upload.ts`) |
| **GNAHS (reservas)** | Independiente del hosting | Sigue en servidores de GNAHS; solo hay que mantener dominio autorizado y credenciales |
| **Base de datos** | No aplica | Este sitio **no usa** base de datos relacional |

No hay “vendor lock-in” de base de datos. La dependencia más visible de Vercel hoy es el **Blob** para el CMS en producción, no el framework en sí.

---

## 6. ¿Hay otros servicios además de Vercel? ¿Quién es propietario de cada uno?

| Servicio | Para qué sirve | Propietario recomendado |
|----------|----------------|-------------------------|
| **GitHub** | Código fuente | **Cliente** |
| **Vercel** | Hosting, builds, SSL, dominio | **Cliente** |
| **Vercel Blob** | JSON e imágenes editados desde el panel en producción | **Cliente** (misma cuenta Vercel) |
| **GNAHS** (`hostalric.gnahs.app`) | Motor de reservas, buscador, club, mis reservas | **Cliente** (contrato con GNAHS; credenciales del account manager) |
| **Dominio thetoprentals.com** | Marca y URL pública | **Cliente** (registrador DNS) |
| **WhatsApp / redes** | Enlaces en contenido | Cliente (solo URLs en textos, sin API propia) |

**No hay** base de datos contratada (MySQL/PostgreSQL) en esta versión.  
**No hay** Auth0/Firebase: el panel admin usa una contraseña configurada en Vercel (`ADMIN_TOKEN`).

---

## 7. Si otro desarrollador toma el proyecto, ¿qué documentación necesita? ¿Solo clonar y pushear?

**Base mínima:** sí — clonar el repo del cliente, instalar dependencias, configurar `.env.local` y trabajar con Git (rama, commit, push). Si Vercel está conectado al repo, cada push a `main` puede desplegar automáticamente.

**Además debe leer:**

- [README.md](../README.md) — arranque rápido  
- [HANDOFF.md](./HANDOFF.md) — arquitectura, contenido, admin, GNAHS  
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel, Blob, dominio  
- [GNAHS-INTEGRACION.md](./GNAHS-INTEGRACION.md) — motor de reservas  

**Pasos manuales documentados** (no están “solo en la cabeza” del desarrollador anterior):

- Crear Blob en Vercel y variables de entorno  
- Autorizar dominio en GNAHS  
- Configurar DNS de `thetoprentals.com`  
- Rotar contraseña del panel admin en entrega  

---

## 8. ¿Cuál es la diferencia respecto a la web anterior en Laravel? ¿Es “mejor”?

No se trata solo de “más código o menos código”, sino de **otra arquitectura** acorde a cómo se opera hoy el sitio.

### Comparación técnica (resumida)

| | Sitio anterior (Laravel) | Sitio actual (Next.js) |
|---|--------------------------|-------------------------|
| **Stack** | PHP, Laravel, típicamente MySQL | TypeScript, Next.js, React |
| **Contenido** | Base de datos + back office Laravel | JSON + panel propio + Blob en producción |
| **Reservas** | Integración GNAHS (también externa) | Integración GNAHS (widget + motor embebido) |
| **Hosting** | Servidor PHP tradicional | Vercel (serverless/Node) + CDN |
| **Rendimiento / UX** | Modelo clásico servidor | Páginas modernas, componentes React, mejor control de UI/UX del rediseño |
| **Mantenimiento** | Requiere stack PHP en servidor | Ecosistema front actual; deploys desde Git |

### ¿Es “mejor”?

**Para el negocio actual, la nueva versión está pensada para:**

- Reflejar el **rediseño** y la estructura de páginas acordada (corporate, propiedades, blog, real estate, etc.).  
- Permitir que el equipo edite **textos, propiedades, blog y marketing** desde un panel sin tocar código.  
- Mantener **GNAHS** como motor de reservas (igual que antes en espíritu: reservas fuera del CMS).  
- Desplegar con **menos fricción** (Git + Vercel + dominio propio).  
- Escalar el front con estándares actuales (SEO técnico, performance, componentes reutilizables).

**No significa** que Laravel sea “malo”: significa que **se reemplazó el monolito PHP** por una **aplicación web moderna** alineada al nuevo producto. La comparación justa con el cliente es: *mismo negocio (alquileres + GNAHS), nueva plataforma de sitio y de gestión de contenido*.

### Sitio en vivo hoy

La web pública que muchos usuarios conocen sigue siendo [thetoprentals.com](https://thetoprentals.com/) hasta completar el corte al nuevo deploy en la cuenta Vercel del cliente con el dominio apuntado al proyecto nuevo.

---

## Resumen para una reunión (30 segundos)

> El código pasa a un GitHub del cliente. Vercel del cliente hospeda el sitio con dominio thetoprentals.com. No hay base de datos: contenido en panel + almacenamiento Blob. Las reservas siguen en GNAHS. Todo queda documentado para que otro desarrollador clone, configure variables y despliegue. Es un reemplazo del sitio Laravel por Next.js, no una actualización menor del mismo PHP.
