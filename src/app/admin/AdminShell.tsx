import { AdminPageNav } from "./AdminPageNav";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex flex-col">
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand__mark" aria-hidden>
            TR
          </span>
          <p className="admin-brand__text">
            <strong>Top Rentals</strong>
          </p>
        </div>

        <AdminTopNav />

        <div className="admin-topbar__actions">
          <LogoutButton />
        </div>
      </header>

      <div className="admin-mobile-nav">
        <AdminPageNav />
      </div>

      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <div className="admin-main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
