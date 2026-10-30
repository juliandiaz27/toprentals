"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar, type AdminShellUser } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

/**
 * Estructura del panel: menú lateral fijo (cajón en mobile), barra superior con la ruta
 * y el contenido con scroll propio.
 */
export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminShellUser;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="admin-shell fixed inset-0 z-[100] flex">
      <div className={`admin-sidebar-wrap ${menuOpen ? "admin-sidebar-wrap--open" : ""}`}>
        <AdminSidebar user={user} onNavigate={() => setMenuOpen(false)} />
      </div>
      {menuOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="admin-layout">
        <AdminTopNav onOpenMenu={() => setMenuOpen(true)} />
        <main className="admin-main" key={pathname}>
          <div className="admin-main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
