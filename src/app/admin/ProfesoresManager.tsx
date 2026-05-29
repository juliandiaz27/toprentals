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
    <div className="admin-crud flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          {initialItems.length} profesor{initialItems.length === 1 ? "" : "es"}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="admin-btn-primary rounded bg-neutral-800 px-4 py-2 text-sm font-medium text-white"
        >
          Agregar
        </button>
      </div>

      {error && !open ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="admin-table w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Rol</th>
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  No hay profesores. Agregá el primero.
                </td>
              </tr>
            ) : (
              initialItems.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.role}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-400">{p.id}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="mr-2 text-sm text-neutral-700 underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={pending}
                      className="text-sm text-red-600 underline disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && editing ? (
        <div className="admin-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div
            className="admin-modal w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prof-form-title"
          >
            <h2 id="prof-form-title" className="text-lg font-semibold text-neutral-900">
              {editing.id ? "Editar profesor" : "Nuevo profesor"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="id" value={editing.id} />
              <input type="hidden" name="imageSrc" value={editing.imageSrc} />
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-neutral-700">Nombre</span>
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="rounded border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-neutral-700">Rol / cargo</span>
                <input
                  name="role"
                  required
                  defaultValue={editing.role}
                  className="rounded border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-neutral-700">Foto (opcional)</span>
                <input name="image" type="file" accept="image/*" className="text-xs" />
              </label>
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded border border-neutral-300 px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded bg-neutral-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
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
