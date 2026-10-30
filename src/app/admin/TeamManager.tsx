"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminUserPublic } from "@/lib/adminUsers";
import type { AdminRole } from "@/lib/adminSession";
import {
  changeOwnPassword,
  createTeamMember,
  removeTeamMember,
  updateTeamMember,
  type TeamActionResult,
} from "./teamActions";

type Props = {
  users: AdminUserPublic[];
  currentUserId: string;
  isOwner: boolean;
  usingGeneralPassword: boolean;
};

const ROLE_LABEL: Record<AdminRole, string> = { owner: "Dueño", editor: "Editor" };
const ROLE_HINT: Record<AdminRole, string> = {
  owner: "Edita todo y administra el equipo",
  editor: "Edita el contenido del sitio",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Feedback({ result }: { result: TeamActionResult | null }) {
  if (!result) return null;
  return result.ok ? (
    <p className="admin-alert-success" role="status">{result.message}</p>
  ) : (
    <p className="admin-alert-error" role="alert">{result.error}</p>
  );
}

export function TeamManager({ users, currentUserId, isOwner, usingGeneralPassword }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<TeamActionResult | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  function run(action: () => Promise<TeamActionResult>, onOk?: () => void) {
    setResult(null);
    startTransition(async () => {
      const res = await action();
      setResult(res);
      if (res.ok) {
        onOk?.();
        router.refresh();
      }
    });
  }

  return (
    <div className="page-editor w-full">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Administración</p>
          <h1 className="mt-1">Equipo</h1>
          <p>
            Cada persona entra con su email y contraseña, y todo lo que guarda queda registrado en
            Actividad con su nombre.
          </p>
        </div>
      </header>

      {usingGeneralPassword ? (
        <p className="admin-notice mb-6">
          Entraste con la <strong>contraseña general</strong>, así que tus cambios figuran como
          «Administrador». Creá tu usuario abajo y empezá a ingresar con tu email.
        </p>
      ) : null}

      <div className="mb-6">
        <Feedback result={result} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Personas con acceso</h2>
              <p className="admin-panel__desc">
                {users.length === 0
                  ? "Todavía no hay usuarios: hoy se entra solo con la contraseña general."
                  : `${users.length} usuario(s) + la contraseña general.`}
              </p>
            </div>
          </div>
          <ul className="admin-team">
            {users.map((user) => (
              <li key={user.id} className="admin-team__row">
                <span className="admin-team__avatar" aria-hidden>
                  {initials(user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="admin-team__name">
                    {user.name}
                    {user.id === currentUserId ? <span className="admin-team__you">vos</span> : null}
                  </p>
                  <p className="admin-team__email">{user.email}</p>
                </div>
                <span className={`admin-list-card__badge ${user.role === "owner" ? "admin-list-card__badge--live" : ""}`}>
                  {ROLE_LABEL[user.role]}
                </span>
                {isOwner ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="admin-btn-ghost"
                      onClick={() => setEditing(editing === user.id ? null : user.id)}
                    >
                      {editing === user.id ? "Cerrar" : "Editar"}
                    </button>
                    {user.id !== currentUserId ? (
                      <button
                        type="button"
                        className="admin-btn-danger"
                        disabled={pending}
                        onClick={() => {
                          if (window.confirm(`¿Quitarle el acceso a ${user.name}?`)) {
                            run(() => removeTeamMember(user.id));
                          }
                        }}
                      >
                        Quitar
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {editing === user.id ? (
                  <form
                    className="admin-team__edit"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      run(() => updateTeamMember(fd), () => setEditing(null));
                    }}
                  >
                    <input type="hidden" name="id" value={user.id} />
                    <label className="flex flex-col">
                      <span className="admin-field-label">Rol</span>
                      <select name="role" defaultValue={user.role} className="admin-input">
                        <option value="editor">Editor — {ROLE_HINT.editor}</option>
                        <option value="owner">Dueño — {ROLE_HINT.owner}</option>
                      </select>
                    </label>
                    <label className="flex flex-col">
                      <span className="admin-field-label">Nueva contraseña (opcional)</span>
                      <input
                        name="password"
                        type="password"
                        minLength={8}
                        autoComplete="new-password"
                        className="admin-input"
                        placeholder="Dejala vacía para no cambiarla"
                      />
                    </label>
                    <button type="submit" disabled={pending} className="admin-btn-primary self-end">
                      Guardar
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
            <li className="admin-team__row admin-team__row--muted">
              <span className="admin-team__avatar" aria-hidden>
                ★
              </span>
              <div className="min-w-0 flex-1">
                <p className="admin-team__name">Contraseña general</p>
                <p className="admin-team__email">
                  Figura como «Administrador». Se cambia en Vercel (ADMIN_TOKEN).
                </p>
              </div>
              <span className="admin-list-card__badge admin-list-card__badge--live">Dueño</span>
            </li>
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          {isOwner ? (
            <section className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2 className="admin-panel__title">Agregar persona</h2>
                  <p className="admin-panel__desc">
                    Pasale el email y la contraseña por un canal seguro; puede cambiarla al entrar.
                  </p>
                </div>
              </div>
              <form
                className="flex flex-col gap-4 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const fd = new FormData(form);
                  run(() => createTeamMember(fd), () => form.reset());
                }}
              >
                <label className="flex flex-col">
                  <span className="admin-field-label">Nombre</span>
                  <input name="name" required className="admin-input" placeholder="Ej. Jessica (Magnama)" />
                </label>
                <label className="flex flex-col">
                  <span className="admin-field-label">Email</span>
                  <input name="email" type="email" required className="admin-input" autoComplete="off" />
                </label>
                <label className="flex flex-col">
                  <span className="admin-field-label">Contraseña inicial</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="admin-input"
                    placeholder="Mínimo 8 caracteres"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="admin-field-label">Rol</span>
                  <select name="role" defaultValue="editor" className="admin-input">
                    <option value="editor">Editor — {ROLE_HINT.editor}</option>
                    <option value="owner">Dueño — {ROLE_HINT.owner}</option>
                  </select>
                </label>
                <button type="submit" disabled={pending} className="admin-btn-primary">
                  {pending ? "Guardando…" : "Agregar al equipo"}
                </button>
              </form>
            </section>
          ) : null}

          {!usingGeneralPassword ? (
            <section className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2 className="admin-panel__title">Mi contraseña</h2>
                  <p className="admin-panel__desc">Cambiá la contraseña con la que ingresás.</p>
                </div>
              </div>
              <form
                className="flex flex-col gap-4 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const fd = new FormData(form);
                  run(() => changeOwnPassword(fd), () => form.reset());
                }}
              >
                <label className="flex flex-col">
                  <span className="admin-field-label">Contraseña actual</span>
                  <input name="current" type="password" required autoComplete="current-password" className="admin-input" />
                </label>
                <label className="flex flex-col">
                  <span className="admin-field-label">Nueva contraseña</span>
                  <input
                    name="next"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="admin-input"
                  />
                </label>
                <button type="submit" disabled={pending} className="admin-btn-secondary">
                  Cambiar contraseña
                </button>
              </form>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
