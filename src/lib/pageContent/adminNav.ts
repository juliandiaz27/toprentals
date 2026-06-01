/** Orden del menú lateral del panel (no coincide con PAGE_DEFINITIONS). */
export const ADMIN_NAV_ITEMS = [
  { slug: "home-header", title: "Header" },
  { slug: "home", title: "Home" },
  { slug: "nosotros", title: "Nosotros" },
  { slug: "corporate", title: "Corporate" },
  { slug: "propiedades", title: "Propiedades" },
  { slug: "propietarios", title: "Propietarios" },
  { slug: "real-estate", title: "Real Estate" },
  { slug: "home-footer", title: "Footer" },
] as const;

/** Slugs que guardan en `home-content.json`. */
export function resolveStorageSlug(slug: string): string {
  if (slug === "home-header" || slug === "home-footer") return "home";
  return slug;
}
