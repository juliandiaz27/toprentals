import Link from "next/link";
import { readAdminAudit } from "@/lib/adminAudit";
import { formatAuditDate } from "@/lib/adminAuditFormat";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ usuario?: string | string[] }>;
};

/** Historial de cambios del panel: quién guardó qué y cuándo. */
export default async function AdminActivityPage({ searchParams }: Props) {
  const sp = await searchParams;
  const userFilter = typeof sp.usuario === "string" ? sp.usuario : "";
  const entries = await readAdminAudit();
  const people = [...new Map(entries.map((e) => [e.userId, e.userName])).entries()];
  const visible = userFilter ? entries.filter((e) => e.userId === userFilter) : entries;

  return (
    <div className="page-editor w-full">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Administración</p>
          <h1 className="mt-1">Actividad</h1>
          <p>
            Cada vez que alguien guarda algo en el panel o inicia sesión, queda anotado acá con su
            nombre. Se conservan los últimos 1000 eventos.
          </p>
        </div>
      </header>

      {people.length > 1 ? (
        <div className="admin-chips mb-4" role="group" aria-label="Filtrar por persona">
          <Link href="/admin/actividad" className="admin-chip" aria-pressed={!userFilter}>
            Todas las personas
          </Link>
          {people.map(([id, name]) => (
            <Link
              key={id}
              href={`/admin/actividad?usuario=${encodeURIComponent(id)}`}
              className="admin-chip"
              aria-pressed={userFilter === id}
            >
              {name}
            </Link>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="admin-empty">
          Todavía no hay actividad registrada. Los próximos guardados van a aparecer acá.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cuándo</th>
                <th>Quién</th>
                <th>Qué hizo</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((entry, i) => (
                <tr key={`${entry.at}-${i}`}>
                  <td className="whitespace-nowrap">{formatAuditDate(entry.at)}</td>
                  <td className="whitespace-nowrap">{entry.userName}</td>
                  <td>
                    <span className="font-semibold text-[var(--admin-text)]">{entry.action}</span>{" "}
                    {entry.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
