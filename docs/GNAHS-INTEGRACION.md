# Integración motor GNAHS — Top Rentals

Referencias:

- [Integración básica del motor](https://docs.gnahs.com/2.0/booking-engine/basic-integration-booking-engine) (pasos 1–3 abajo)
- PDF «Integración motor Top Rentals» (GNAHS, dic. 2025)
- **[Widget (buscador)](docs/GNAHS-WIDGET.md)** · [docs GNAHS](https://docs.gnahs.com/2.0/widget/integration)
- **[Agencias](docs/GNAHS-AGENCIES.md)** · [docs GNAHS](https://docs.gnahs.com/2.0/agencies/agencies-app)

> **HTTPS:** GNAHS exige sitio con certificado válido en producción. En local (`http://localhost`) el widget puede devolver **401** hasta que autoricen el dominio.

---

## Parámetros Top Rentals (account manager)

| Parámetro | Valor |
|-----------|--------|
| `uuid` | `a74723e1-187c-44d3-8c2d-948c2685e77e` |
| `establishments` | `[1,2,3,4,5,6,7,8,9,10,11]` |
| `api` / Api URL | `https://hostalric.gnahs.app` |
| `assets` | `https://hostalric.gnahs.app/dist/` |
| `language` / `locale` | `es` |
| `slug` (mis reservas) | `top-rentals` → URL `https://hostalric.gnahs.app/top-rentals` |

Establishments: `GNAHS_ESTABLISHMENT_IDS` = `[1..11]` en `src/lib/gnahs/config.ts`. Nombres: `src/lib/gnahs/hotels.ts`.

Variables en `.env.local`: ver `.env.example`.

---

## Guía oficial (3 pasos) ↔ este proyecto

### Paso 1 — Metasearch tracker (todo el sitio)

**Documentación GNAHS:**

```html
<script src="https://assets.gnahs.com/services/booking-engine/metasearch-tracker/v1/launcher.js" defer></script>
```

**En Next.js:**

| Qué | Dónde |
|-----|--------|
| Componente | `src/components/gnahs/GnahsMetasearchTracker.tsx` |
| Montaje global | `src/app/layout.tsx` (dentro de `<body>`) |

---

### Paso 2 — Página del motor de reservas

**Documentación GNAHS:**

1. Contenedor `<div id="GNAHSEngine"></div>`
2. `window.BookingParams = { uuid, establishments, language, api, assets }`
3. Solo en esta página:
   - `gnahs-get-rho-initial-settings-v2.js` → `onload="(new GNAHSGetRhoInitialSettings())"`
   - `booking-engine/fetch.min.js`

**En Next.js:**

| Qué | Dónde |
|-----|--------|
| Ruta pública | `/reservas` |
| Página | `src/app/reservas/page.tsx` |
| Componente | `src/components/gnahs/BookingEngine.tsx` |
| Parámetros | `getGnahsEngineConfig()` en `src/lib/gnahs/config.ts` |

**Equivalente React (resumen):**

```ts
// BookingEngine.tsx — useEffect al montar
window.BookingParams = {
  uuid: "a74723e1-187c-44d3-8c2d-948c2685e77e",
  establishments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  language: "es",
  api: "https://hostalric.gnahs.app",
  assets: "https://hostalric.gnahs.app/dist/",
};
// + carga de los dos scripts GNAHS (rho-init y fetch.min.js)
```

El widget del home redirige aquí con `bookingRoute: "/reservas"` y parámetros GET (`checkin`, `checkout`, etc.). El script `GNAHSGetRhoInitialSettings` los lee automáticamente.

Snippet HTML de referencia: `docs/gnahs-snippets/engine.html`.

---

### Paso 3 — Confirmación y gestión de reservas (My Booking)

**Documentación GNAHS:**

```html
<div id="GNAHS-my-booking"></div>
<script>
  window.GNAHS_MyBooking = {
    url: "https://{API}.gnahs.app/{SLUG}",
    locale: "es",
  };
</script>
<script defer src="https://{API}.gnahs.app/my-booking/launcher.js"></script>
```

**Top Rentals:** `url` = `https://hostalric.gnahs.app/top-rentals`

**En Next.js:**

| Qué | Dónde |
|-----|--------|
| Ruta pública | `/mis-reservas` |
| Página | `src/app/mis-reservas/page.tsx` |
| Componente | `src/components/gnahs/MyBooking.tsx` |
| Config | `getGnahsMyBookingConfig()` en `config.ts` |

Snippet HTML: `docs/gnahs-snippets/my-booking.html`.

---

## Checklist Alejo (mail dic. 2025) ↔ proyecto

| Pedido | Snippet | Ruta / componente | Estado |
|--------|---------|-------------------|--------|
| Buscador | `widget.html` | `/` → `BookingWidget` | ✅ |
| Listado / motor (todos) | `engine.html` | `/reservas` | ✅ |
| Motor Buenos Aires | `engine-buenos-aires.html` | `/reservas/buenos-aires` — ids `1,2,3,5,6,7,8,9,10,11` | ✅ |
| Motor Quito | `engine-quito.html` | `/reservas/quito` — ids `4,12` | ✅ |
| Mis reservas | `my-booking.html` | `/mis-reservas` → `MyBooking` | ✅ |
| Loyalty | `loyalty.html` | `/club-top-rentals` → `LoyaltyModule` | ✅ |
| Agencias | `agencies.html` | `/agencias` → `AgenciesModule` | ✅ |
| Tracking motor | [docs tracking](https://docs.gnahs.com/2.0/tracking/booking-engine-tracking) | `/reservas` → `pushGnahsStepLoaded` | ✅ |
| Metasearch (sitio) | paso 1 guía básica | `layout.tsx` → `GnahsMetasearchTracker` | ✅ |

**Establishments:** siempre `[1,2,3,4,5,6,7,8,9,10,11]` (`GNAHS_ESTABLISHMENT_IDS` en `config.ts`). No usar códigos PMS en el embed.

## Otras piezas

| Ruta | Componente | Docs |
|------|------------|------|
| `/` (buscador) | `BookingWidget` | **`docs/GNAHS-WIDGET.md`** |
| `/agencias` | `AgenciesModule` | **`docs/GNAHS-AGENCIES.md`** |
| `/club-top-rentals` | `LoyaltyModule` | loyalty |
| `/reservar` | redirect 301 | → `/reservas` |
| `/misreservas` | redirect 301 | → `/mis-reservas` |

---

## Tracking del motor (Alejo / GTM)

En `#GNAHSEngine` el motor dispara `GNAHS:step-loaded`. Implementado en `BookingEngine.tsx` + `src/lib/gnahs/tracking.ts`:

```js
dataLayer.push({ event: "GNAHS:step-loaded", data: ev.detail });
```

En GTM: activador de evento personalizado **`GNAHS:step-loaded`** (ver [booking-engine-tracking](https://docs.gnahs.com/2.0/tracking/booking-engine-tracking)).

Tras completar la reserva, el seguimiento continúa en la página de detalle (My Booking / Booking Details).

---

## Claves que NO van en el embed

| Clave | Uso |
|-------|-----|
| `secretkey` | API servidor (`GNAHS_SECRET_KEY`) — no en widget/motor |
| `downloadkey` | Descarga reservas (`GNAHS_DOWNLOAD_KEY`) |
| Establishment ids | `[1..11]` en `GNAHS_ESTABLISHMENT_IDS` |
| `ADMIN_TOKEN` | Solo panel `/admin` — no es de GNAHS |

---

## Error 401 en `POST /api/widget`

GNAHS valida el **origen** del navegador. Sin dominio autorizado → 401 → el widget no recibe destinos → error `reading 'length'`.

**Pedir a GNAHS:**

- `http://localhost:3000` (desarrollo)
- URL de staging / producción (Vercel o dominio final)

---

## Pendiente con GNAHS (checklist)

GNAHS pide enviar las **URLs finales** del motor y mis reservas (todos los idiomas) para darlas de alta y probar antes de activar:

- [ ] `https://[TU-DOMINIO]/reservas`
- [ ] `https://[TU-DOMINIO]/mis-reservas` (no `/misreservas`; hay redirect por si acaso)
- [ ] Dominios autorizados (localhost + producción)
- [ ] Color corporativo del motor (vía account manager)
- [x] Push `dataLayer` / evento `GNAHS:step-loaded` (código listo; falta contenedor GTM en producción si usan Analytics)

**Ya implementado en código:**

- [x] Paso 1 — Metasearch tracker
- [x] Paso 2 — Motor `/reservas`
- [x] Paso 3 — My Booking `/mis-reservas`
- [x] Widget → `/reservas`
- [x] Parámetros PDF Top Rentals

---

## Estructura de archivos GNAHS

```
src/
  app/
    layout.tsx              ← GnahsMetasearchTracker
    reservas/page.tsx       ← BookingEngine
    mis-reservas/page.tsx   ← MyBooking
    page.tsx                ← BookingWidget (home)
  components/gnahs/
    GnahsMetasearchTracker.tsx
    BookingEngine.tsx
    MyBooking.tsx
    BookingWidget.tsx
    AgenciesModule.tsx
    LoyaltyModule.tsx
  lib/gnahs/
    config.ts
    hotels.ts
    scripts.ts
    tracking.ts
    serverCredentials.ts
docs/gnahs-snippets/       ← HTML de referencia (widget, engine, my-booking, …)
docs/GNAHS-WIDGET.md       ← documentación del buscador v3
docs/GNAHS-AGENCIES.md     ← módulo agencias (/agencias)
```
