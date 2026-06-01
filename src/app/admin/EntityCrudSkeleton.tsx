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
  description?: string;
  entityLabel: string;
  items: T[];
  fields: FieldDef[];
  saveAction: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  deleteAction: (id: string) => Promise<{ ok: boolean; error?: string }>;
  listColumns: { key: keyof T; label: string }[];
};

export function EntityCrudSkeleton<T extends { id: string }>({
  title,
  description,
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

  const primaryColumn = listColumns[0]?.key;

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

  function listMeta(item: T): string {
    return listColumns
      .slice(1)
      .map((col) => String(item[col.key] ?? ""))
      .filter(Boolean)
      .join(" · ");
  }

  return (
    <div className="admin-crud flex flex-col gap-6">
      <header className="admin-page-header !mb-0">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--admin-text-dim)]">
          {initialItems.length} registro{initialItems.length === 1 ? "" : "s"}
        </p>
        <button type="button" onClick={openCreate} className="admin-btn-primary">
          + Nuevo {entityLabel}
        </button>
      </div>

      {error && !open ? (
        <p className="admin-alert-error" role="alert">
          {error}
        </p>
      ) : null}

      {initialItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--admin-border)] py-12 text-center text-sm text-[var(--admin-text-dim)]">
          Sin registros. Creá el primero con el botón de arriba.
        </p>
      ) : (
        <ul className="admin-list">
          {initialItems.map((item) => {
            const titleText = primaryColumn
              ? String(item[primaryColumn] ?? item.id)
              : item.id;
            const visible =
              "visible" in item ? Boolean((item as Record<string, unknown>).visible) : null;
            return (
              <li key={item.id} className="admin-list-card">
                <div className="min-w-0 flex-1">
                  <p className="admin-list-card__title">{titleText}</p>
                  {visible === true ? (
                    <span className="admin-list-card__badge">Visible en el sitio</span>
                  ) : null}
                  {listMeta(item) ? (
                    <p className="admin-list-card__meta">{listMeta(item)}</p>
                  ) : null}
                </div>
                <div className="admin-list-card__actions">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="admin-btn-ghost"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={pending}
                    className="admin-btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {open && editing ? (
        <div className="admin-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="admin-modal w-full max-w-lg">
            <p className="admin-form-section-label">
              {editing.id ? "Editar" : "Nuevo"}
            </p>
            <h2 className="mt-1">
              {editing.id ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={String(editing.id ?? "")} />
              {"imageSrc" in editing ? (
                <input
                  type="hidden"
                  name="imageSrc"
                  value={String((editing as Record<string, unknown>).imageSrc ?? "")}
                />
              ) : null}
              {fields.map((f) => {
                const span =
                  f.type === "textarea" || f.type === "file"
                    ? "sm:col-span-2"
                    : "";
                if (f.type === "checkbox") {
                  return (
                    <label
                      key={f.name}
                      className={`flex items-center gap-2 text-sm text-[var(--admin-text-muted)] ${span}`}
                    >
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
                    <label key={f.name} className={`flex flex-col gap-1.5 ${span}`}>
                      <span className="admin-field-label">{f.label}</span>
                      <textarea
                        name={f.name}
                        rows={3}
                        defaultValue={String(
                          (editing as Record<string, unknown>)[f.name] ?? "",
                        )}
                        className="admin-textarea"
                      />
                    </label>
                  );
                }
                if (f.type === "file") {
                  return (
                    <label key={f.name} className={`flex flex-col gap-1.5 ${span}`}>
                      <span className="admin-field-label">{f.label}</span>
                      <input name={f.name} type="file" accept="image/*" />
                    </label>
                  );
                }
                return (
                  <label key={f.name} className={`flex flex-col gap-1.5 ${span}`}>
                    <span className="admin-field-label">{f.label}</span>
                    <input
                      name={f.name}
                      type={f.type === "number" ? "number" : "text"}
                      required={f.required}
                      defaultValue={String(
                        (editing as Record<string, unknown>)[f.name] ?? "",
                      )}
                      className="admin-input"
                    />
                  </label>
                );
              })}
              {error ? <p className="admin-alert-error sm:col-span-2">{error}</p> : null}
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditing(null);
                  }}
                  className="admin-btn-secondary"
                >
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
