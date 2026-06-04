"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import type { HeaderEditorNavRow } from "@/lib/pageContent/headerNav";
import { MEDIA_UPLOAD_GUIDES } from "@/lib/mediaUploadGuide";
import { MediaUploadGuide } from "./MediaUploadGuide";
import { saveHeaderContent } from "./headerActions";

type Props = {
  initial: {
    logoSrc: string;
    logoText: string;
    ctaLabel: string;
    ctaHref: string;
    nav: HeaderEditorNavRow[];
  };
};

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  const tmp = next[index]!;
  next[index] = next[target]!;
  next[target] = tmp;
  return next;
}

export function HeaderPageEditor({ initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const [logoSrc, setLogoSrc] = useState(initial.logoSrc);
  const [logoText, setLogoText] = useState(initial.logoText);
  const [ctaLabel, setCtaLabel] = useState(initial.ctaLabel);
  const [nav, setNav] = useState(initial.nav);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    fd.set("header.nav", JSON.stringify(nav));
    fd.set("header.logoSrc", logoSrc);
    fd.set("header.logoText", logoText);
    fd.set("header.ctaLabel", ctaLabel);

    startTransition(async () => {
      const res = await saveHeaderContent(fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="page-editor w-full">
      <div className="admin-sticky-toolbar flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1>Header</h1>
          <p className="mt-1 text-sm">
            Logo, orden del menú y visibilidad de páginas. Las rutas del menú son fijas.
          </p>
          <p className="mt-1 text-xs text-[var(--admin-text-dim)]">
            Vista previa:{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-2 hover:underline"
            >
              /
            </a>
          </p>
        </div>
        <button type="submit" disabled={pending} className="admin-btn-primary shrink-0">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      {error ? (
        <p className="admin-alert-error mb-6" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="admin-alert-success mb-6">Cambios guardados correctamente.</p>
      ) : null}

      <div className="grid gap-6">
        <section className="admin-section-card">
          <h2 className="admin-section-card__head">Logo</h2>
          <div className="admin-section-card__body grid gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-2 lg:col-span-2">
              <span className="admin-field-label">Imagen del logo</span>
              <MediaUploadGuide guide={MEDIA_UPLOAD_GUIDES.siteLogo} />
              <span className="admin-field-hint">
                Si no subís imagen, se muestra el texto del logo.
              </span>
              {logoSrc ? (
                <div className="flex max-w-xs items-center rounded-lg border border-[var(--admin-border)] bg-white px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoSrc} alt="" className="h-8 max-w-full object-contain" />
                </div>
              ) : (
                <p className="text-sm text-[var(--admin-text-dim)]">Sin imagen — se usa texto.</p>
              )}
              <input type="hidden" name="header.logoSrc" value={logoSrc} readOnly />
              <input
                type="file"
                name="__file__header.logoSrc"
                accept="image/*"
                className="text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
            </div>
            <label className="flex flex-col">
              <span className="admin-field-label">Texto alternativo / fallback *</span>
              <span className="admin-field-hint">
                Se usa si no hay imagen y como texto accesible (alt).
              </span>
              <input
                type="text"
                name="header.logoText"
                required
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="admin-input"
              />
            </label>
          </div>
        </section>

        <section className="admin-section-card xl:col-span-2">
          <h2 className="admin-section-card__head">Menú principal</h2>
          <div className="admin-section-card__body flex flex-col gap-3">
            <p className="text-sm text-[var(--admin-text-muted)]">
              Marcá qué páginas mostrar, cambiá el texto visible y reordená con las flechas. La URL
              de cada ítem no se puede editar.
            </p>
            <NavList nav={nav} setNav={setNav} />
          </div>
        </section>

        <section className="admin-section-card">
          <h2 className="admin-section-card__head">Botón de reserva</h2>
          <div className="admin-section-card__body grid gap-5 lg:grid-cols-2">
            <label className="flex flex-col">
              <span className="admin-field-label">Texto del botón *</span>
              <input
                type="text"
                name="header.ctaLabel"
                required
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                className="admin-input"
              />
            </label>
            <div className="flex flex-col">
              <span className="admin-field-label">Destino</span>
              <span className="admin-field-hint">Ruta fija del motor de reservas.</span>
              <p className="admin-input mt-1 cursor-not-allowed bg-[var(--admin-surface-raised)] text-[var(--admin-text-dim)]">
                {initial.ctaHref}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end border-t border-[var(--admin-border)] pt-6">
        <button type="submit" disabled={pending} className="admin-btn-primary">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

function NavList({
  nav,
  setNav,
}: {
  nav: HeaderEditorNavRow[];
  setNav: (rows: HeaderEditorNavRow[]) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {nav.map((row, index) => (
        <NavRow
          key={row.id}
          row={row}
          index={index}
          total={nav.length}
          onChange={(patch) =>
            setNav(nav.map((item, i) => (i === index ? { ...item, ...patch } : item)))
          }
          onMove={(dir) => setNav(moveItem(nav, index, dir))}
        />
      ))}
    </ul>
  );
}

function NavRow({
  row,
  index,
  total,
  onChange,
  onMove,
}: {
  row: HeaderEditorNavRow;
  index: number;
  total: number;
  onChange: (patch: Partial<HeaderEditorNavRow>) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const controls: ReactNode = (
    <div className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        className="admin-btn-ghost px-2 py-1 text-xs"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        aria-label={`Subir ${row.label}`}
      >
        ↑
      </button>
      <button
        type="button"
        className="admin-btn-ghost px-2 py-1 text-xs"
        disabled={index >= total - 1}
        onClick={() => onMove(1)}
        aria-label={`Bajar ${row.label}`}
      >
        ↓
      </button>
    </div>
  );

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] px-4 py-3">
      {controls}
      <label className="flex shrink-0 items-center gap-2">
        <input
          type="checkbox"
          checked={row.visible}
          onChange={(e) => onChange({ visible: e.target.checked })}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium text-[var(--admin-text-muted)]">Mostrar</span>
      </label>
      <label className="flex min-w-[140px] flex-1 flex-col sm:min-w-[200px]">
        <span className="sr-only">Texto en menú para {row.id}</span>
        <input
          type="text"
          value={row.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="admin-input"
          disabled={!row.visible}
        />
      </label>
      <code className="shrink-0 text-xs text-[var(--admin-text-dim)]">{row.href}</code>
    </li>
  );
}
