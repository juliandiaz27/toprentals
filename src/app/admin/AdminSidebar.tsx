"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGE_DEFINITIONS } from "@/lib/pageContent/schemas";

const CATALOG_LINKS = [
  { href: "/admin/profesores", label: "Profesores" },
  { href: "/admin/egresados", label: "Egresados" },
  { href: "/admin/carreras", label: "Carreras" },
  { href: "/admin/postitulos", label: "Postítulos" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/beneficios", label: "Beneficios" },
] as const;

function NavLink({
  href,
  label,
  exact,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`block rounded px-3 py-2 text-sm ${
        active
          ? "bg-[#2271b1] text-white"
          : "text-neutral-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="admin-sidebar flex w-56 shrink-0 flex-col bg-[#1d2327] text-neutral-100">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Top Rentals
        </p>
        <p className="text-sm font-medium text-white">Panel de contenido</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500">
          Páginas
        </p>
        <ul className="mb-4 space-y-0.5">
          {PAGE_DEFINITIONS.map((page) => {
            const href = `/admin/paginas/${page.slug}`;
            const active = pathname === href;
            return (
              <li key={page.slug}>
                <Link
                  href={href}
                  className={`block rounded px-3 py-2 text-sm ${
                    active
                      ? "bg-[#2271b1] text-white"
                      : "text-neutral-200 hover:bg-white/10"
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500">
          Medios
        </p>
        <ul className="mb-4 space-y-0.5">
          <li>
            <NavLink href="/admin/imagenes" label="Imágenes globales" />
          </li>
        </ul>

        <p className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500">
          Catálogo
        </p>
        <ul className="space-y-0.5">
          {CATALOG_LINKS.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
