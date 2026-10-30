import Link from "next/link";
import { readPropertiesCatalog } from "@/lib/properties/catalogStorage";
import { readPropertyReviews } from "@/lib/properties/reviewsStorage";
import { loadAllBlogPostsForAdmin } from "@/lib/blog/load";
import { propertyCompleteness } from "@/lib/properties/completeness";
import { ADMIN_MENU } from "@/lib/pageContent/adminNav";
import { AdminMenuIconSvg } from "../AdminSidebar";
import { readAdminAudit } from "@/lib/adminAudit";
import { formatAuditDate } from "@/lib/adminAuditFormat";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("es-AR", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date()),
  );
  if (hour < 12) return "Buen día";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function todayLabel(): string {
  const text = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Inicio del panel: estado del sitio, qué falta completar y accesos rápidos. */
export default async function AdminDashboard() {
  const [catalog, reviews, posts, activity, session] = await Promise.all([
    readPropertiesCatalog(),
    readPropertyReviews(),
    loadAllBlogPostsForAdmin("es"),
    readAdminAudit(6),
    getAdminSession(),
  ]);

  const buildings = catalog.listings.filter((l) => !l.comingSoon);
  const published = buildings.filter((l) => !l.hidden);
  const pendingReviews = reviews.filter((r) => !r.visible).length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - publishedPosts;

  const completeness = published
    .map((item) => ({ item, ...propertyCompleteness(item) }))
    .sort((a, b) => a.score - b.score);
  const avgScore = completeness.length
    ? Math.round(completeness.reduce((sum, c) => sum + c.score, 0) / completeness.length)
    : 0;

  const stats = [
    {
      label: "Edificios publicados",
      value: published.length,
      hint: buildings.length - published.length
        ? `${buildings.length - published.length} oculto(s)`
        : "Todos visibles",
      href: "/admin/propiedades",
    },
    {
      label: "Destacados en la home",
      value: `${catalog.featuredSlugs.length}/5`,
      hint: "Carrusel de la página de inicio",
      href: "/admin/propiedades",
    },
    {
      label: "Comentarios por revisar",
      value: pendingReviews,
      hint: pendingReviews ? "Esperan aprobación" : "Nada pendiente",
      href: "/admin/propiedades/comentarios",
      alert: pendingReviews > 0,
    },
    {
      label: "Notas del blog",
      value: publishedPosts,
      hint: drafts ? `${drafts} borrador(es)` : "Sin borradores",
      href: "/admin/blog",
    },
  ];

  const shortcuts = ADMIN_MENU.filter((g) => g.title !== "General");

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__hero">
        <div>
          <p className="admin-eyebrow">{todayLabel()}</p>
          <h1 className="admin-dashboard__title">
            {greeting()}
            {session && session.uid !== "owner" ? `, ${session.name.split(" ")[0]}` : ""}
          </h1>
          <p className="admin-dashboard__lead">
            Desde acá gestionás el contenido del sitio. Los cambios se publican al guardar.
          </p>
        </div>
        <div className="admin-dashboard__hero-actions">
          <Link href="/admin/propiedades" className="admin-btn-primary">
            Gestionar edificios
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary">
            Ver sitio ↗
          </a>
        </div>
      </header>

      <section className="admin-stats-grid" aria-label="Resumen">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`admin-stat-card ${stat.alert ? "admin-stat-card--alert" : ""}`}
          >
            <span className="admin-stat-card__label">{stat.label}</span>
            <span className="admin-stat-card__value">{stat.value}</span>
            <span className="admin-stat-card__hint">{stat.hint}</span>
          </Link>
        ))}
      </section>

      <div className="admin-dashboard__grid">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Completitud de las fichas</h2>
              <p className="admin-panel__desc">
                Qué le falta a cada edificio para verse como en el diseño. Promedio:{" "}
                <strong>{avgScore}%</strong>
              </p>
            </div>
          </div>
          <ul className="admin-completeness">
            {completeness.map(({ item, score, missing }) => (
              <li key={item.slug} className="admin-completeness__row">
                <div className="admin-completeness__info">
                  <p className="admin-completeness__name">{item.name}</p>
                  <p className="admin-completeness__missing">
                    {missing.length ? `Falta: ${missing.slice(0, 3).join(" · ")}${missing.length > 3 ? ` y ${missing.length - 3} más` : ""}` : "Ficha completa"}
                  </p>
                </div>
                <div className="admin-completeness__bar" aria-label={`${score}% completa`}>
                  <span
                    style={{ width: `${score}%` }}
                    className={score >= 80 ? "is-good" : score >= 50 ? "is-mid" : "is-low"}
                  />
                </div>
                <span className="admin-completeness__score">{score}%</span>
                <Link
                  href={`/admin/propiedades?editar=${encodeURIComponent(item.slug)}`}
                  className="admin-btn-ghost"
                >
                  {score === 100 ? "Ver" : "Completar"}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-5">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Últimos cambios</h2>
              <p className="admin-panel__desc">Quién guardó qué en el panel.</p>
            </div>
            <Link href="/admin/actividad" className="admin-btn-ghost">
              Ver todo
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[var(--admin-text-dim)]">
              Todavía no hay cambios registrados.
            </p>
          ) : (
            <ul className="admin-activity">
              {activity.map((entry, i) => (
                <li key={`${entry.at}-${i}`}>
                  <span className="admin-activity__who">{entry.userName}</span>{" "}
                  <span className="admin-activity__what">
                    {entry.action.toLowerCase()} {entry.target}
                  </span>
                  <span className="admin-activity__when">{formatAuditDate(entry.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Accesos rápidos</h2>
              <p className="admin-panel__desc">Todas las secciones editables del sitio.</p>
            </div>
          </div>
          <div className="admin-shortcuts">
            {shortcuts.map((group) => (
              <div key={group.title}>
                <p className="admin-shortcuts__group">{group.title}</p>
                <ul className="admin-shortcuts__list">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="admin-shortcuts__link">
                        <span className="admin-shortcuts__icon">
                          <AdminMenuIconSvg icon={item.icon} />
                        </span>
                        {item.label}
                        <span className="admin-shortcuts__arrow" aria-hidden>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
