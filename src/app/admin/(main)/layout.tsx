import Link from "next/link";
import { AdminSidebar } from "../AdminSidebar";
import { LogoutButton } from "../LogoutButton";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex bg-[#f0f0f1] text-neutral-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="admin-topbar flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-2">
          <span className="text-sm text-neutral-600">Panel de administración</span>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#2271b1] hover:underline"
            >
              Ver sitio
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="admin-main flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
