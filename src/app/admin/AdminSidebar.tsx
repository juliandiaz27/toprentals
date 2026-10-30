"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_MENU,
  findAdminMenuItem,
  type AdminMenuIcon,
} from "@/lib/pageContent/adminNav";
import { LogoutButton } from "./LogoutButton";

const ICON_PATHS: Record<AdminMenuIcon, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
    </>
  ),
  building: <path d="M5 20.5V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M15 9.5h3a1 1 0 0 1 1 1v10M3 20.5h18M8.5 8h3M8.5 11.5h3M8.5 15h3" />,
  comments: <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4zM8 9.5h8M8 12.5h5" />,
  home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  page: <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20zM14 3.5V8h4M9 12h6M9 15.5h6" />,
  header: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9h17" />
    </>
  ),
  footer: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 15h17" />
    </>
  ),
  blog: <path d="M5 4.5h14v15H5zM8 8.5h8M8 12h8M8 15.5h5" />,
  marketing: <path d="M4 10v4h3l6 4V6L7 10zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" />,
  activity: <path d="M12 7v5l3 2M20 12a8 8 0 1 1-2.3-5.6M20 4.5v3.5h-3.5" />,
  team: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a5.5 5.5 0 0 1 3 5" />,
};

export function AdminMenuIconSvg({ icon }: { icon: AdminMenuIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}

export type AdminShellUser = {
  name: string;
  role: "owner" | "editor";
  /** true = entró con la contraseña general (sin usuario propio). */
  general: boolean;
};

type Props = {
  user: AdminShellUser;
  /** Cierra el menú en mobile al navegar. */
  onNavigate?: () => void;
};

/** Menú lateral oscuro (colores invertidos respecto del sitio). */
export function AdminSidebar({ user, onNavigate }: Props) {
  const pathname = usePathname() ?? "";
  const active = findAdminMenuItem(pathname)?.item.href;

  return (
    <aside className="admin-sidebar" aria-label="Menú del panel">
      <Link href="/admin" className="admin-sidebar__brand" onClick={onNavigate}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-footer.png" alt="Top Rentals" width={186} height={91} />
        <span>Panel de gestión</span>
      </Link>

      <nav className="admin-sidebar__nav">
        {ADMIN_MENU.map((group) => (
          <div key={group.title} className="admin-sidebar__group">
            <p className="admin-sidebar__group-title">{group.title}</p>
            <ul className="admin-sidebar__list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active === item.href ? "page" : undefined}
                    className={`admin-sidebar__link ${
                      active === item.href ? "admin-sidebar__link--active" : ""
                    }`}
                  >
                    <span className="admin-sidebar__icon">
                      <AdminMenuIconSvg icon={item.icon} />
                    </span>
                    <span className="admin-sidebar__label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <Link href="/admin/equipo" className="admin-sidebar__user" onClick={onNavigate}>
          <span className="admin-sidebar__avatar" aria-hidden>
            {user.name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("")}
          </span>
          <span className="min-w-0">
            <span className="admin-sidebar__user-name">{user.name}</span>
            <span className="admin-sidebar__user-role">
              {user.general ? "Contraseña general" : user.role === "owner" ? "Dueño" : "Editor"}
            </span>
          </span>
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__site">
          Ver sitio publicado <span aria-hidden>↗</span>
        </a>
        <LogoutButton />
      </div>
    </aside>
  );
}
