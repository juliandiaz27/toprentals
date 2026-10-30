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
  { slug: "club", title: "Club Top Rentals" },
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

/** Ítem del menú lateral del panel (agrupado por tipo de tarea). */
export type AdminMenuItem = {
  href: string;
  label: string;
  icon: AdminMenuIcon;
  /** Página pública que se abre con «Ver en el sitio». */
  publicPath?: string;
};

export type AdminMenuIcon =
  | "dashboard"
  | "building"
  | "comments"
  | "home"
  | "page"
  | "header"
  | "footer"
  | "blog"
  | "marketing"
  | "activity"
  | "team";

export type AdminMenuGroup = {
  title: string;
  items: AdminMenuItem[];
};

function pageItem(slug: string, label: string, publicPath: string): AdminMenuItem {
  return { href: `/admin/paginas/${slug}`, label, icon: "page", publicPath };
}

/** Menú del panel: lo que más se usa arriba, la estructura del sitio abajo. */
export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    title: "General",
    items: [{ href: "/admin", label: "Inicio", icon: "dashboard", publicPath: "/" }],
  },
  {
    title: "Edificios",
    items: [
      { href: "/admin/propiedades", label: "Fichas de edificios", icon: "building", publicPath: "/propiedades" },
      { href: "/admin/propiedades/comentarios", label: "Comentarios", icon: "comments" },
    ],
  },
  {
    title: "Páginas del sitio",
    items: [
      { ...pageItem("home", "Home", "/"), icon: "home" },
      pageItem("propiedades", "Propiedades", "/propiedades"),
      pageItem("corporate", "Corporate", "/corporate"),
      pageItem("club", "Club Top Rentals", "/club-top-rentals"),
      pageItem("propietarios", "Propietarios", "/propietarios"),
      pageItem("real-estate", "Real Estate", "/real-estate"),
      pageItem("nosotros", "Quiénes somos", "/nosotros"),
      pageItem("trabaja", "Trabajá con nosotros", "/trabaja-con-nosotros"),
      pageItem("contacto", "Contacto", "/contacto"),
    ],
  },
  {
    title: "Estructura",
    items: [
      { ...pageItem("home-header", "Header y menú", "/"), icon: "header" },
      { ...pageItem("home-footer", "Footer", "/"), icon: "footer" },
    ],
  },
  {
    title: "Contenido y marketing",
    items: [
      { href: "/admin/blog", label: "Blog", icon: "blog", publicPath: "/blog" },
      { href: "/admin/marketing", label: "Marketing", icon: "marketing" },
    ],
  },
  {
    title: "Administración",
    items: [
      { href: "/admin/actividad", label: "Actividad", icon: "activity" },
      { href: "/admin/equipo", label: "Equipo", icon: "team" },
    ],
  },
];

/** Ítem activo para una ruta (el más específico gana). */
export function findAdminMenuItem(
  pathname: string,
): { group: AdminMenuGroup; item: AdminMenuItem } | null {
  let best: { group: AdminMenuGroup; item: AdminMenuItem } | null = null;
  for (const group of ADMIN_MENU) {
    for (const item of group.items) {
      const exact = pathname === item.href;
      const nested = item.href !== "/admin" && pathname.startsWith(`${item.href}/`);
      if ((exact || nested) && (!best || item.href.length > best.item.href.length)) {
        best = { group, item };
      }
    }
  }
  return best;
}
