"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/imagenes", label: "Imágenes", icon: "🖼" },
  { href: "/admin/profesores", label: "Profesores", icon: "👤" },
  { href: "/admin/egresados", label: "Egresados", icon: "🎓" },
  { href: "/admin/carreras", label: "Carreras", icon: "📋" },
  { href: "/admin/postitulos", label: "Postítulos", icon: "📄" },
  { href: "/admin/cursos", label: "Cursos", icon: "📚" },
  { href: "/admin/beneficios", label: "Beneficios", icon: "✦" },
] as const;

function isTabActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="admin-tabs" aria-label="Secciones del panel">
      {TABS.map((tab) => {
        const active = isTabActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`admin-tab ${active ? "admin-tab--active" : ""}`}
          >
            <span aria-hidden>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
