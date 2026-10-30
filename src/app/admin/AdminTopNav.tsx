"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findAdminMenuItem } from "@/lib/pageContent/adminNav";

type Props = {
  onOpenMenu: () => void;
};

/** Barra superior: ruta actual (grupo › sección) y acceso a la página pública. */
export function AdminTopNav({ onOpenMenu }: Props) {
  const pathname = usePathname() ?? "";
  const match = findAdminMenuItem(pathname);

  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-topbar__menu"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <nav className="admin-breadcrumb" aria-label="Ubicación">
        <Link href="/admin">Panel</Link>
        {match && match.item.href !== "/admin" ? (
          <>
            <span aria-hidden>/</span>
            <span className="admin-breadcrumb__group">{match.group.title}</span>
            <span aria-hidden>/</span>
            <Link href={match.item.href} aria-current="page">
              {match.item.label}
            </Link>
          </>
        ) : null}
      </nav>

      {match?.item.publicPath ? (
        <a
          href={match.item.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar__view"
        >
          Ver en el sitio <span aria-hidden>↗</span>
        </a>
      ) : null}
    </header>
  );
}
