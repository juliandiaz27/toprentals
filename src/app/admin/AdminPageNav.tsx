"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, adminNavHref } from "@/lib/pageContent/adminNav";

export function AdminPageNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="admin-page-tabs" aria-label="Páginas del sitio">
      {ADMIN_NAV_ITEMS.map((page) => {
        const href = adminNavHref(page);
        const active =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={page.slug}
            href={href}
            className={`admin-page-tab ${active ? "admin-page-tab--active" : ""}`}
          >
            {page.title}
          </Link>
        );
      })}
    </nav>
  );
}
