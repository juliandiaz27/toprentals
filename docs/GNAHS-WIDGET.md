# Widget de reservas GNAHS — Top Rentals

Referencia oficial: [Integración básica del widget](https://docs.gnahs.com/2.0/widget/integration)

El widget es el buscador (destinos, fechas, ocupación, código promo). Al reservar, redirige al **motor** (`/reservas`) con parámetros en la URL.

---

## Dónde está en el proyecto

| Qué | Archivo / ruta |
|-----|----------------|
| Página | Home `/` — sección `#buscador` |
| Componente React | `src/components/gnahs/BookingWidget.tsx` |
| Configuración | `getGnahsWidgetConfig()` en `src/lib/gnahs/config.ts` |
| HTML de referencia | `docs/gnahs-snippets/widget.html` |
| Motor destino | `/reservas` (`BookingEngine` + `#GNAHSEngine`) |

---

## Assets (v3)

| Recurso | URL |
|---------|-----|
| CSS | `https://assets.gnahs.com/modules/booking-widget/v3/app.css` |
| JS | `https://assets.gnahs.com/modules/booking-widget/v3/app.js` (ES module, `defer`) |

En React se cargan con `loadScript()` (no `next/script`) para evitar conflictos de preload.

---

## Parámetros `settings` — Top Rentals

Valores actuales en `getGnahsWidgetConfig()`:

```javascript
{
  uuid: "a74723e1-187c-44d3-8c2d-948c2685e77e",
  apiUrl: "https://hostalric.gnahs.app",
  establishments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  language: "es",
  bookingRoute: "/reservas",
  saveLastSeach: false,  // typo oficial de GNAHS
  appearance: { gap: 0 },
}
```

Variables de entorno opcionales: `NEXT_PUBLIC_GNAHS_WIDGET_UUID`, `NEXT_PUBLIC_GNAHS_API_URL`, `NEXT_PUBLIC_GNAHS_BOOKING_ROUTE`.

### Tabla completa (documentación GNAHS)

| Parámetro | Descripción | Top Rentals |
|-----------|-------------|-------------|
| `settings.uuid` | UUID de cliente | Ver arriba |
| `settings.apiUrl` | URL API GNAHS | `https://hostalric.gnahs.app` |
| `settings.establishments` | IDs a mostrar; `[]` = todos | `[1..11]` |
| `settings.language` | Idioma del widget | `es` |
| `settings.bookingRoute` | Ruta/URL del motor | `/reservas` |
| `settings.saveLastSearch` | Guardar última búsqueda | `false` (`saveLastSeach` en API) |
| `settings.appearance.gap` | Píxeles al hacer scroll sticky | `0` |
| `settings.appearance.scrollHide` | Ocultar al scroll | no configurado (default `false`) |
| `settings.appearance.occupancy.orientation` | Selector ocupación | no configurado (`auto`) |
| `settings.appearance.destinations.orientation` | Selector destinos | no configurado |
| `settings.appearance.dates.orientation` | Selector fechas | no configurado |

### Idiomas admitidos (`settings.language`)

`es`, `ca`, `en`, `fr`, `de`, `it`, `nl`, `pt`, `ru`

---

## Variante de markup: con / sin selector de destino

### Ejemplo simple (sin destinos)

Solo fechas, ocupación, promo y botón reservar.

```html
<div class="c-booking-widget__item dates-component dates-component-wrapper"></div>
<div class="c-booking-widget__item occupancy-component occupancy-component-container"></div>
<div class="c-booking-widget__item promo-code"></div>
<div class="c-booking-widget__item booking-button"></div>
```

### Ejemplo con destinos (Top Rentals)

Incluye `destination-component` para elegir torre/establecimiento.

```html
<div class="c-booking-widget__item destination-component" widget-label-destination="Destinos"></div>
<!-- + dates, occupancy, promo, booking-button -->
```

**Este proyecto usa la variante con destinos** (como `widget.html` del cliente).

### Destino por defecto al cargar (opcional)

Si hace falta preseleccionar el primer establecimiento:

```javascript
document.querySelector(".c-booking-widget").addEventListener("initWidget", () => {
  Widget.$destination.setDestination(Widget.configuration.destinations[0]);
});
```

No está implementado en `BookingWidget.tsx`; se puede añadir si el cliente lo pide.

---

## Colores (CSS custom properties)

```css
:root {
  --booking-color-primary: 42, 42, 42;      /* RGB sin rgb() */
  --booking-color-secondary: 217, 217, 217;
}
```

Definido en `BookingWidget.tsx` (inline). Ajustar valores para alinear con marca Top Rentals.

---

## Etiquetas en español (atributos HTML)

Atributos `widget-label-*` en los nodos del markup:

| Atributo | Valor en el proyecto |
|----------|----------------------|
| `widget-label-destination` | Destinos |
| `widget-label-promocode` | Código promo |
| (fechas / ocupación / botón) | Por defecto del widget en `es` |

Ejemplo en React: `{...{ "widget-label-destination": "Destinos" }}`

---

## Flujo: widget → motor

1. Usuario completa el buscador y pulsa reservar.
2. Navegación a `bookingRoute` + query string, por ejemplo:

   `/reservas?checkin=2026-06-17&checkout=2026-06-18&rooms=1&room1_adults=2&cpromo=...`

3. En `/reservas`, `GNAHSGetRhoInitialSettings` lee esos GET y rellena `BookingParams`.

Documentación: [Widget + motor](https://docs.gnahs.com/2.0/widget/booking-engine)

| Parámetro GET | Descripción |
|---------------|-------------|
| `checkin` | Entrada |
| `checkout` | Salida |
| `rooms` | Nº habitaciones |
| `roomX_adults` | Adultos habitación X |
| `roomX_children` | Edades niños |
| `cpromo` | Código promocional |

---

## Inicialización (HTML oficial vs React)

**HTML GNAHS:**

```html
<script>
  function loadWidget() {
    new GNAHS_BookingWidget({ settings: { /* ... */ } });
  }
</script>
<script defer src=".../app.js" onload="loadWidget()"></script>
```

**React (`BookingWidget.tsx`):**

1. Inyecta CSS en `<head>`.
2. Renderiza markup `.c-booking-widget`.
3. `loadScript(app.js, { module, defer, onLoad })` → `new GNAHS_BookingWidget({ settings })`.

---

## Errores frecuentes

### 401 en `POST …/api/widget`

El navegador llama a la API con el **origen** de tu sitio. GNAHS debe autorizar `localhost` y el dominio de producción. No se soluciona con `secretkey` en `.env`.

### `Cannot read properties of undefined (reading 'length')`

Consecuencia del 401: no llega la lista de destinos.

---

## Relación con otras integraciones

| Pieza | Doc |
|-------|-----|
| Motor `/reservas` | `docs/GNAHS-INTEGRACION.md` |
| Metasearch (todo el sitio) | Paso 1 en integración del motor |
| My Booking | Paso 3 en integración del motor |
