import Link from "next/link";
import { AdminPageNav } from "./AdminPageNav";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex flex-col bg-[var(--admin-bg)]">
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand__mark" aria-hidden>
            TR
          </span>
          <p className="admin-brand__text">
            <strong>Top Rentals</strong>
            <span className="hidden sm:inline"> — Panel de administración</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/imagenes" className="admin-btn-secondary">
            Imágenes
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
          >
            Ver sitio ↗
          </Link>
          <LogoutButton />
        </div>
      </header>

      <AdminPageNav />

      <main className="admin-main">
        <div className="admin-main__inner">{children}</div>
      </main>
    </div>
  );
}
