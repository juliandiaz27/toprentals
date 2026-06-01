"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/lib/pageContent/adminNav";

const LEGACY_CATALOG = [
  { href: "/admin/profesores", label: "Profesores" },
  { href: "/admin/egresados", label: "Egresados" },
  { href: "/admin/carreras", label: "Carreras" },
  { href: "/admin/postitulos", label: "Postítulos" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/beneficios", label: "Beneficios" },
] as const;

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname() ?? "";
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={`admin-nav-item ${active ? "admin-nav-item--active" : ""}`}>
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar flex w-[260px] shrink-0 flex-col bg-[#0f1114]">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Top Rentals
        </p>
        <p className="mt-1 text-[15px] font-semibold text-white">Panel de contenido</p>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
            Sitio web
          </p>
          <ul className="space-y-0.5">
            {ADMIN_NAV_ITEMS.map((page) => (
              <li key={page.slug}>
                <NavItem href={`/admin/paginas/${page.slug}`} label={page.title} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
            Medios
          </p>
          <NavItem href="/admin/imagenes" label="Imágenes globales" />
        </div>

        <details className="group px-1">
          <summary className="cursor-pointer list-none px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between">
              Catálogo heredado
              <span className="text-zinc-600 transition group-open:rotate-180">▾</span>
            </span>
          </summary>
          <ul className="mt-2 space-y-0.5">
            {LEGACY_CATALOG.map((item) => (
              <li key={item.href}>
                <NavItem href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </details>
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] text-zinc-600">Contenido en archivos JSON locales</p>
      </div>
    </aside>
  );
}
