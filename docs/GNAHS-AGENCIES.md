# Módulo de agencias GNAHS — Top Rentals

Referencia oficial: [Integración del módulo de agencias](https://docs.gnahs.com/2.0/agencies/agencies-app)

Portal para **agencias de viaje**: acceso, gestión y flujos propios de agencias (complementario al motor de reservas B2C).

---

## Dónde está en el proyecto

| Qué | Archivo / ruta |
|-----|----------------|
| Ruta pública | `/agencias` |
| Página | `src/app/agencias/page.tsx` |
| Componente | `src/components/gnahs/AgenciesModule.tsx` |
| Config | `getGnahsAgenciesConfig()` en `src/lib/gnahs/config.ts` |
| HTML de referencia | `docs/gnahs-snippets/agencies.html` |

---

## Antes de empezar (gestión con GNAHS)

Contactar al **Account Manager** con:

| Dato | Top Rentals (ejemplo) |
|------|-------------------------|
| Cliente | Top Rentals |
| Dominio web | `https://[dominio-producción]` (+ staging si aplica) |
| Establecimientos | TODOS, o lista concreta de ids `1..11` |

Si el **motor y el widget** ya están integrados y el dominio fue autorizado, el **mismo UUID** sirve para agencias. Solo hace falta dar de alta el **módulo de agencias** si aún no está activo.

En cadenas con varias webs: indicar **todos los dominios** y qué establecimientos muestra cada uno.

---

## Integración HTML (documentación GNAHS)

```html
<div id="GNAHS-agencies"></div>
<script>
  window.GNAHS_Agencies = {
    uuid: "", // UUID del account manager
    locale: "es_ES",
    establishments: [], // [] = todos; o [1,2,3,...] para filtrar
  };
</script>
<script
  src="https://assets.gnahs.com/services/agencies/v1/launcher.js"
  type="module"
  defer
></script>
```

### Parámetros `window.GNAHS_Agencies`

| Parámetro | Descripción | Top Rentals (actual) |
|-----------|-------------|----------------------|
| `uuid` | UUID de cliente | `a74723e1-187c-44d3-8c2d-948c2685e77e` |
| `locale` | Idioma del módulo | `es_ES` |
| `establishments` | IDs a mostrar; `[]` = todos | `[]` (los 11 establecimientos) |

Para limitar torres concretas, usar por ejemplo `[1, 3, 5]` según `src/lib/gnahs/hotels.ts`.

> El color principal del módulo coincide con el del motor. Cambios de marca: pedirlos al Account Manager (motor + agencias a la vez).

---

## Equivalente en Next.js

**`AgenciesModule.tsx`** (resumen):

1. Al montar: `window.GNAHS_Agencies = getGnahsAgenciesConfig()`
2. Cargar una sola vez:  
   `https://assets.gnahs.com/services/agencies/v1/launcher.js`  
   (`type="module"`, `defer`) vía `loadScript()` en `src/lib/gnahs/scripts.ts`
3. Renderizar `<div id="GNAHS-agencies" />`

No requiere metabuscador ni scripts del motor (`rho-init`, `fetch.min.js`) en la misma página.

---

## Variables de entorno

Hereda el UUID del widget/motor:

```env
NEXT_PUBLIC_GNAHS_WIDGET_UUID=a74723e1-187c-44d3-8c2d-948c2685e77e
```

Opcional futuro: filtrar establecimientos vía código en `getGnahsAgenciesConfig()` (hoy `establishments: []`).

---

## Dominio no autorizado

Igual que el widget: si el dominio no está dado de alta en GNAHS, las peticiones pueden fallar (p. ej. errores en consola o módulo en blanco).

**Desarrollo:** pedir autorización de `http://localhost:3000` si probás en local.

---

## Relación con otras integraciones

| Módulo | Ruta | Doc |
|--------|------|-----|
| Motor | `/reservas` | `docs/GNAHS-INTEGRACION.md` |
| Widget | `/` (home) | `docs/GNAHS-WIDGET.md` |
| Mis reservas | `/mis-reservas` | `docs/GNAHS-INTEGRACION.md` (paso 3) |
| Loyalty / Club | `/club-top-rentals` | `docs/gnahs-snippets/loyalty.html` |

---

## Checklist Top Rentals

- [x] Página `/agencias` + `#GNAHS-agencies`
- [x] `GNAHS_Agencies` con UUID y `locale: es_ES`
- [x] Launcher `agencies/v1/launcher.js`
- [ ] Confirmar con GNAHS que el **módulo de agencias** está activo para Top Rentals
- [ ] Dominio de producción (y localhost si aplica) autorizado
