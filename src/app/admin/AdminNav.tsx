"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Imágenes", exact: true },
  { href: "/admin/profesores", label: "Profesores" },
  { href: "/admin/egresados", label: "Egresados" },
  { href: "/admin/carreras", label: "Carreras" },
  { href: "/admin/postitulos", label: "Postítulos" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/beneficios", label: "Beneficios" },
] as const;

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="admin-nav flex flex-wrap gap-1 border-b border-neutral-200 px-4">
      {TABS.map((tab) => {
        const active =
          "exact" in tab && tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`admin-nav-tab px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
