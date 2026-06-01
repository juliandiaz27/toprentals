import Link from "next/link";
import { AdminSidebar } from "../AdminSidebar";
import { LogoutButton } from "../LogoutButton";
import "../admin.css";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex bg-[#f4f4f5] text-neutral-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 shadow-sm">
          <span className="text-sm font-medium text-neutral-700">Administración</span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-secondary"
            >
              Ver sitio
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="admin-main flex-1 overflow-y-auto">
          <div className="w-full px-6 py-6 md:px-10 md:py-8 lg:px-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
