/** Rutas internas del sitio — no editables como texto libre en el panel. */
export type SiteRouteOption = {
  id: string;
  label: string;
  href: string;
};

export const MENU_SITE_ROUTES: SiteRouteOption[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "propiedades", label: "Propiedades", href: "/propiedades" },
  { id: "corporate", label: "Corporativo", href: "/corporate" },
  { id: "propietarios", label: "Propietarios", href: "/propietarios" },
  { id: "real-estate", label: "Real Estate", href: "/real-estate" },
  { id: "club", label: "Club Top Rentals", href: "/club-top-rentals" },
  { id: "loyalty", label: "Club — acceso / loyalty", href: "/loyalty" },
  { id: "nosotros", label: "Quiénes somos", href: "/nosotros" },
  { id: "trabaja", label: "Trabajá con nosotros", href: "/trabaja-con-nosotros" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contacto", label: "Contacto", href: "/contacto" },
  { id: "reservas", label: "Reservas (motor)", href: "/reservas" },
  { id: "reservas-ba", label: "Reservas — Buenos Aires", href: "/reservas/buenos-aires" },
  { id: "reservas-quito", label: "Reservas — Quito", href: "/reservas/quito" },
  { id: "desarrolladores", label: "Desarrolladores", href: "/desarrolladores" },
  { id: "inversores", label: "Inversores", href: "/inversores" },
];

export const DESTINATION_ROUTES: SiteRouteOption[] = [
  {
    id: "reservas-ba",
    label: "Buenos Aires — motor de reservas",
    href: "/reservas/buenos-aires",
  },
  {
    id: "reservas-quito",
    label: "Quito — motor de reservas",
    href: "/reservas/quito",
  },
];

const MENU_HREFS = new Set(MENU_SITE_ROUTES.map((r) => r.href));

export function normalizeInternalHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  if (trimmed.startsWith("#")) return trimmed;
  try {
    const u = new URL(trimmed, "https://toprentals.local");
    const path = u.pathname.replace(/\/$/, "") || "/";
    return `${path}${u.hash}`;
  } catch {
    return trimmed;
  }
}

export function routesForPreset(
  preset?: "menu" | "destinations" | "investor",
): SiteRouteOption[] {
  if (preset === "destinations") return DESTINATION_ROUTES;
  if (preset === "investor") {
    return MENU_SITE_ROUTES.filter((r) =>
      ["desarrolladores", "inversores", "real-estate"].includes(r.id),
    );
  }
  return MENU_SITE_ROUTES;
}

export function isAllowedInternalHref(
  href: string,
  preset?: "menu" | "destinations" | "investor",
): boolean {
  const normalized = normalizeInternalHref(href);
  return routesForPreset(preset).some((r) => r.href === normalized);
}

export function resolveRoutePickerValue(
  raw: string,
  preset: "menu" | "destinations" | "investor" | undefined,
  fallback: string,
): string {
  const normalized = normalizeInternalHref(raw);
  if (isAllowedInternalHref(normalized, preset)) return normalized;
  if (isAllowedInternalHref(fallback, preset)) return normalizeInternalHref(fallback);
  const options = routesForPreset(preset);
  return options[0]?.href ?? "/";
}

/** Campos que siguen siendo URL externa (redes, mailto, etc.). */
export function isExternalUrlFieldKey(key: string): boolean {
  return (
    /footer\.(instagram|facebook|whatsapp)Url$/i.test(key) ||
    key === "finalCta.ctaHref" ||
    /brochureHref$/i.test(key) ||
    /\.videoUrl$/i.test(key) ||
    key === "hero.whatsappUrl"
  );
}

/** Botón flotante B2C — siempre al motor general. */
export const STICKY_RESERVE_HREF = "/reservas";
