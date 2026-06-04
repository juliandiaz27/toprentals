/** Orden alineado al menú público (headerNav) + chrome del sitio. */
export type AdminNavItem = {
  slug: string;
  title: string;
  /** Si no se define, usa `/admin/paginas/{slug}`. */
  href?: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { slug: "home-header", title: "Header" },
  { slug: "home", title: "Home" },
  { slug: "propiedades", title: "Propiedades" },
  { slug: "corporate", title: "Corporate" },
  { slug: "propietarios", title: "Propietarios" },
  { slug: "real-estate", title: "Real Estate" },
  { slug: "nosotros", title: "Quiénes somos" },
  { slug: "trabaja", title: "Trabajá con nosotros" },
  { slug: "blog", title: "Blog", href: "/admin/blog" },
  { slug: "contacto", title: "Contacto" },
  { slug: "home-footer", title: "Footer" },
];

/** Slugs que guardan en `home-content.json`. */
export function resolveStorageSlug(slug: string): string {
  if (slug === "home-header" || slug === "home-footer") return "home";
  return slug;
}

export function adminNavHref(item: AdminNavItem): string {
  return item.href ?? `/admin/paginas/${item.slug}`;
}
