"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, adminNavHref } from "@/lib/pageContent/adminNav";

function NavIcon({ slug }: { slug: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "home-header":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "propiedades":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6" />
        </svg>
      );
    case "corporate":
      return (
        <svg {...common}>
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M6 7h12v14H6V7z" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      );
    case "contacto":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4zM4 8l8 5 8-5" />
        </svg>
      );
    case "home-footer":
      return (
        <svg {...common}>
          <path d="M6 18V6M12 18V10M18 18V14" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function NavItem({
  href,
  label,
  slug,
}: {
  href: string;
  label: string;
  slug: string;
}) {
  const pathname = usePathname() ?? "";
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`admin-sidebar__link ${active ? "admin-sidebar__link--active" : ""}`}
    >
      <span className="admin-sidebar__icon">
        <NavIcon slug={slug} />
      </span>
      <span className="admin-sidebar__label">{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="Páginas del sitio">
      <nav className="admin-sidebar__nav">
        <ul className="admin-sidebar__list">
          {ADMIN_NAV_ITEMS.map((page) => (
            <li key={page.slug}>
              <NavItem
                href={adminNavHref(page)}
                label={page.title}
                slug={page.slug}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
