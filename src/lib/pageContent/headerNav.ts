/** Páginas del menú principal — rutas fijas, no editables desde el panel. */
export const HEADER_NAV_CATALOG = [
  {
    id: "home",
    href: "/",
    defaultLabel: "Home",
  },
  {
    id: "propiedades",
    href: "/propiedades",
    defaultLabel: "Propiedades",
  },
  {
    id: "corporate",
    href: "/corporate",
    defaultLabel: "Corporativo",
  },
  {
    id: "real-estate",
    href: "/real-estate",
    defaultLabel: "Real Estate",
  },
  {
    id: "club-top-rentals",
    href: "/club-top-rentals",
    defaultLabel: "Club Top Rentals",
  },
  {
    id: "nosotros",
    href: "/nosotros",
    defaultLabel: "Quiénes somos",
  },
  {
    id: "trabaja-con-nosotros",
    href: "/trabaja-con-nosotros",
    defaultLabel: "Trabajá con nosotros",
  },
  {
    id: "blog",
    href: "/blog",
    defaultLabel: "Blog",
  },
  {
    id: "contacto",
    href: "/contacto",
    defaultLabel: "Contacto",
  },
] as const;

export type HeaderNavId = (typeof HEADER_NAV_CATALOG)[number]["id"];

export const HEADER_CTA_HREF = "/reservas";

export type HeaderNavStored = {
  id: HeaderNavId;
  label?: string;
  visible?: boolean;
};

const CATALOG_BY_ID = new Map(
  HEADER_NAV_CATALOG.map((item) => [item.id, item]),
);

const CATALOG_BY_HREF = new Map<string, (typeof HEADER_NAV_CATALOG)[number]>(
  HEADER_NAV_CATALOG.map((item) => [item.href, item]),
);

export function headerNavItemById(id: string) {
  return CATALOG_BY_ID.get(id as HeaderNavId);
}

/** Orden y visibilidad por defecto (todas visibles, orden del catálogo). */
export function defaultHeaderNavStored(): HeaderNavStored[] {
  return HEADER_NAV_CATALOG.map((item) => ({
    id: item.id,
    label: item.defaultLabel,
    visible: true,
  }));
}

function legacyNavFromHeader(h: Record<string, unknown>): HeaderNavStored[] | null {
  const items: HeaderNavStored[] = [];

  for (let i = 1; i <= 5; i++) {
    const href = String(h[`link${i}Href`] ?? "").trim();
    const label = String(h[`link${i}Label`] ?? "").trim();
    if (!href && !label) continue;

    const catalog = CATALOG_BY_HREF.get(href);
    if (!catalog) continue;

    items.push({
      id: catalog.id,
      label: label || catalog.defaultLabel,
      visible: Boolean(label),
    });
  }

  return items.length > 0 ? items : null;
}

function normalizeNavArray(raw: unknown): HeaderNavStored[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const items: HeaderNavStored[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const id = String(row.id ?? "").trim();
    const catalog = headerNavItemById(id);
    if (!catalog) continue;

    const visible = row.visible;
    items.push({
      id: catalog.id,
      label: String(row.label ?? catalog.defaultLabel).trim() || catalog.defaultLabel,
      visible: visible === false || visible === "false" ? false : true,
    });
  }

  return items.length > 0 ? items : null;
}

/** Combina datos guardados con el catálogo (añade ítems nuevos; ignora ids obsoletos). */
export function resolveHeaderNavStored(
  h: Record<string, unknown>,
): HeaderNavStored[] {
  const fromNav = normalizeNavArray(h.nav);
  const fromLegacy = legacyNavFromHeader(h);
  const stored = fromNav ?? fromLegacy ?? defaultHeaderNavStored();

  const byId = new Map(stored.map((item) => [item.id, item]));
  const ordered: HeaderNavStored[] = [];
  const seen = new Set<HeaderNavId>();

  for (const item of stored) {
    const catalog = headerNavItemById(item.id);
    if (!catalog) continue;
    seen.add(catalog.id);
    ordered.push({
      id: catalog.id,
      label: item.label?.trim() || catalog.defaultLabel,
      visible: item.visible !== false,
    });
  }

  for (const catalog of HEADER_NAV_CATALOG) {
    if (seen.has(catalog.id)) continue;
    ordered.push({
      id: catalog.id,
      label: catalog.defaultLabel,
      visible: true,
    });
  }

  return ordered;
}

export type HeaderNavLink = { label: string; href: string };

export function headerNavLinksFromStored(
  stored: HeaderNavStored[],
): HeaderNavLink[] {
  return stored
    .filter((item) => item.visible !== false)
    .map((item) => {
      const catalog = headerNavItemById(item.id)!;
      return {
        label: item.label?.trim() || catalog.defaultLabel,
        href: catalog.href,
      };
    });
}

export type HeaderEditorNavRow = {
  id: HeaderNavId;
  href: string;
  label: string;
  visible: boolean;
};

export function buildHeaderEditorState(raw: Record<string, unknown>): {
  logoSrc: string;
  logoText: string;
  ctaLabel: string;
  ctaHref: string;
  nav: HeaderEditorNavRow[];
} {
  const h = (raw.header ?? {}) as Record<string, unknown>;
  const stored = resolveHeaderNavStored(h);

  return {
    logoSrc: String(h.logoSrc ?? "").trim(),
    logoText: String(h.logoText ?? "TOP RENTALS").trim() || "TOP RENTALS",
    ctaLabel: String(h.ctaLabel ?? "Reservar ahora").trim() || "Reservar ahora",
    ctaHref: HEADER_CTA_HREF,
    nav: stored.map((item) => {
      const catalog = headerNavItemById(item.id)!;
      return {
        id: catalog.id,
        href: catalog.href,
        label: item.label?.trim() || catalog.defaultLabel,
        visible: item.visible !== false,
      };
    }),
  };
}
