"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Profesor } from "@/lib/profesoresData";
import { deleteProfesor, saveProfesor } from "./actions";

type Props = {
  initialItems: Profesor[];
};

const EMPTY: Omit<Profesor, "id"> & { id: string } = {
  id: "",
  name: "",
  role: "",
  imageSrc: "/images/placeholders/person.svg",
};

export function ProfesoresManager({ initialItems }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Profesor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing({ ...EMPTY });
    setError(null);
    setOpen(true);
  };

  const openEdit = (item: Profesor) => {
    setEditing({ ...item });
    setError(null);
    setOpen(true);
  };

  const closePanel = () => {
    setOpen(false);
    setEditing(null);
    setError(null);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await saveProfesor(fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        return;
      }
      closePanel();
      router.refresh();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar a "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteProfesor(id);
      if (!res.ok) {
        setError(res.error ?? "Error al eliminar");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="admin-crud flex flex-col gap-6">
      <header className="admin-page-header !mb-0">
        <h1>Profesores</h1>
        <p>Gestioná el listado de profesores y sus fotos.</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--admin-text-dim)]">
          {initialItems.length} profesor{initialItems.length === 1 ? "" : "es"}
        </p>
        <button type="button" onClick={openCreate} className="admin-btn-primary">
          + Nuevo profesor
        </button>
      </div>

      {error && !open ? (
        <p className="admin-alert-error" role="alert">
          {error}
        </p>
      ) : null}

      {initialItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--admin-border)] py-12 text-center text-sm text-[var(--admin-text-dim)]">
          No hay profesores. Agregá el primero.
        </p>
      ) : (
        <ul className="admin-list">
          {initialItems.map((p) => (
            <li key={p.id} className="admin-list-card">
              <div className="min-w-0 flex-1">
                <p className="admin-list-card__title">{p.name}</p>
                <p className="admin-list-card__meta">
                  {p.role} · <span className="font-mono text-xs">{p.id}</span>
                </p>
              </div>
              <div className="admin-list-card__actions">
                <button type="button" onClick={() => openEdit(p)} className="admin-btn-ghost">
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={pending}
                  className="admin-btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && editing ? (
        <div className="admin-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="admin-modal w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prof-form-title"
          >
            <p className="admin-form-section-label">
              {editing.id ? "Editar" : "Nuevo"}
            </p>
            <h2 id="prof-form-title" className="mt-1">
              {editing.id ? "Editar profesor" : "Nuevo profesor"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <input type="hidden" name="id" value={editing.id} />
              <input type="hidden" name="imageSrc" value={editing.imageSrc} />
              <label className="flex flex-col gap-1.5">
                <span className="admin-field-label">Nombre</span>
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="admin-field-label">Rol / cargo</span>
                <input
                  name="role"
                  required
                  defaultValue={editing.role}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="admin-field-label">Foto (opcional)</span>
                <input name="image" type="file" accept="image/*" />
              </label>
              {error ? (
                <p className="admin-alert-error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closePanel} className="admin-btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={pending} className="admin-btn-primary">
                  {pending ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
