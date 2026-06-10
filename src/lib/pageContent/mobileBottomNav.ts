export type MobileBottomNavIcon =
  | "home"
  | "properties"
  | "club"
  | "about"
  | "more";

export type MobileBottomNavTab =
  | {
      kind: "link";
      id: string;
      href: string;
      label: string;
      icon: MobileBottomNavIcon;
      /** Activo si la ruta coincide o empieza con este prefijo. */
      matchPrefixes?: string[];
    }
  | {
      kind: "menu";
      id: "more";
      label: string;
      icon: "more";
    };

/** Pestañas visibles en mobile (< lg). El resto del menú va en «Más». */
export const MOBILE_BOTTOM_NAV_TABS: MobileBottomNavTab[] = [
  {
    kind: "link",
    id: "home",
    href: "/",
    label: "Inicio",
    icon: "home",
    matchPrefixes: ["/"],
  },
  {
    kind: "link",
    id: "propiedades",
    href: "/propiedades",
    label: "Propiedades",
    icon: "properties",
    matchPrefixes: ["/propiedades"],
  },
  {
    kind: "link",
    id: "club",
    href: "/club-top-rentals",
    label: "Club",
    icon: "club",
    matchPrefixes: ["/club-top-rentals", "/loyalty", "/acceso"],
  },
  {
    kind: "link",
    id: "nosotros",
    href: "/nosotros",
    label: "Nosotros",
    icon: "about",
    matchPrefixes: ["/nosotros"],
  },
  { kind: "menu", id: "more", label: "Más", icon: "more" },
];

export function isMobileBottomTabActive(
  tab: Extract<MobileBottomNavTab, { kind: "link" }>,
  pathname: string,
  activeHref?: string,
): boolean {
  const current = pathname.replace(/\/$/, "") || "/";
  if (activeHref) {
    const active = activeHref.replace(/\/$/, "") || "/";
    const tabPath = tab.href.replace(/\/$/, "") || "/";
    if (tabPath === active) return true;
  }
  const prefixes = tab.matchPrefixes ?? [tab.href];
  return prefixes.some((prefix) => {
    const p = prefix.replace(/\/$/, "") || "/";
    if (p === "/") return current === "/";
    return current === p || current.startsWith(`${p}/`);
  });
}
