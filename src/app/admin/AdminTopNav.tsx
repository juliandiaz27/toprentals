"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOP_LINKS = [
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/propiedades/comentarios", label: "Comentarios" },
  { href: "/admin/marketing", label: "Marketing" },
] as const;

function isTopLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin/propiedades") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminTopNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="admin-topnav" aria-label="Herramientas del panel">
      {TOP_LINKS.map((link) => {
        const active = isTopLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-topnav__link ${active ? "admin-topnav__link--active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="admin-topnav__link admin-topnav__link--external"
      >
        Ver sitio
        <span aria-hidden>↗</span>
      </Link>
    </nav>
  );
}
