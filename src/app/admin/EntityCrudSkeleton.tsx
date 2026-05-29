"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { slugify } from "@/lib/slug";

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "checkbox" | "textarea" | "file";
  required?: boolean;
  autoSlugFrom?: string;
};

type Props<T extends { id: string }> = {
  title: string;
  entityLabel: string;
  items: T[];
  fields: FieldDef[];
  saveAction: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; error?: string }>;
  listColumns: { key: keyof T; label: string }[];
};

export function EntityCrudSkeleton<T extends { id: string }>({
  title,
  entityLabel,
  items: initialItems,
  fields,
  saveAction,
  deleteAction,
  listColumns,
}: Props<T>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => {
    const blank: Record<string, unknown> = { id: "" };
    for (const f of fields) {
      if (f.type === "checkbox") blank[f.name] = true;
      else if (f.type === "number") blank[f.name] = new Date().getFullYear();
      else blank[f.name] = "";
    }
    setEditing(blank as Partial<T>);
    setError(null);
    setOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing({ ...item });
    setError(null);
    setOpen(true);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const titleField = fields.find((f) => f.autoSlugFrom);
    if (titleField?.autoSlugFrom) {
      const titleVal = String(fd.get(titleField.autoSlugFrom) ?? "");
      const slugVal = String(fd.get("slug") ?? "");
      if (!slugVal && titleVal) fd.set("slug", slugify(titleVal));
    }
    startTransition(async () => {
      const res = await saveAction(fd);
      if (!res.ok) {
        setError(res.error ?? "Error");
        return;
      }
      setOpen(false);
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm(`¿Eliminar este ${entityLabel}?`)) return;
    startTransition(async () => {
      const res = await deleteAction(id);
      if (!res.ok) setError(res.error ?? "Error");
      else router.refresh();
    });
  }

  return (
    <div className="admin-crud flex flex-col gap-4">
      <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        CRUD base para <strong>{title}</strong>. Podés extenderlo como en Profesores.
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          {initialItems.length} registro{initialItems.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="rounded bg-neutral-800 px-4 py-2 text-sm font-medium text-white"
        >
          Agregar
        </button>
      </div>
      {error && !open ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="border-b bg-neutral-50 text-neutral-600">
            <tr>
              {listColumns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialItems.length === 0 ? (
              <tr>
                <td
                  colSpan={listColumns.length + 1}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Sin registros
                </td>
              </tr>
            ) : (
              initialItems.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100">
                  {listColumns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {String(item[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="mr-2 text-sm underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={pending}
                      className="text-sm text-red-600 underline"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              {editing.id ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="id" value={String(editing.id ?? "")} />
              {"imageSrc" in editing ? (
                <input
                  type="hidden"
                  name="imageSrc"
                  value={String((editing as Record<string, unknown>).imageSrc ?? "")}
                />
              ) : null}
              {fields.map((f) => {
                if (f.type === "checkbox") {
                  return (
                    <label key={f.name} className="flex items-center gap-2 text-sm">
                      <input
                        name={f.name}
                        type="checkbox"
                        defaultChecked={Boolean(
                          (editing as Record<string, unknown>)[f.name],
                        )}
                        value="on"
                      />
                      {f.label}
                    </label>
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <label key={f.name} className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">{f.label}</span>
                      <textarea
                        name={f.name}
                        rows={3}
                        defaultValue={String(
                          (editing as Record<string, unknown>)[f.name] ?? "",
                        )}
                        className="rounded border border-neutral-300 px-3 py-2"
                      />
                    </label>
                  );
                }
                if (f.type === "file") {
                  return (
                    <label key={f.name} className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">{f.label}</span>
                      <input name={f.name} type="file" accept="image/*" />
                    </label>
                  );
                }
                return (
                  <label key={f.name} className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">{f.label}</span>
                    <input
                      name={f.name}
                      type={f.type === "number" ? "number" : "text"}
                      required={f.required}
                      defaultValue={String(
                        (editing as Record<string, unknown>)[f.name] ?? "",
                      )}
                      className="rounded border border-neutral-300 px-3 py-2"
                    />
                  </label>
                );
              })}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditing(null);
                  }}
                  className="rounded border px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded bg-neutral-800 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
