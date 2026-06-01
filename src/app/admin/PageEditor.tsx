"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import type { PageDefinition, PageField } from "@/lib/pageContent/types";
import type { PageContent } from "@/lib/pageContent/types";
import { getNested } from "@/lib/pageContent/nested";
import { shouldUseRichEditor } from "@/lib/pageContent/richEditor";
import { savePageContent } from "./pageActions";
import { WysiwygField } from "./WysiwygField";

type Props = {
  definition: PageDefinition;
  content: PageContent;
};

function isPairableLabel(field: PageField): boolean {
  return (
    /\.(link\d+Label|ctaPrimary|ctaSecondary|ctaLabel|bullet\d+|card\d+Title)$/.test(
      field.key,
    ) && field.type === "text"
  );
}

function isPairableHref(field: PageField): boolean {
  return (
    /\.(link\d+Href|ctaPrimaryHref|ctaSecondaryHref|ctaHref|card\d+Href|card\d+Subtitle|card\d+Text)$/.test(
      field.key,
    ) &&
    (field.type === "text" || field.type === "url" || field.type === "textarea")
  );
}

function fieldSpan(field: PageField): string {
  if (
    field.type === "textarea" ||
    field.type === "rich" ||
    shouldUseRichEditor(field) ||
    field.type === "image" ||
    field.type === "video"
  ) {
    return "lg:col-span-2";
  }
  return "";
}

function FieldControl({
  field,
  content,
}: {
  field: PageField;
  content: PageContent;
}) {
  const value = getNested(content, field.key);
  const strValue = value === undefined || value === null ? "" : String(value);

  if (field.type === "image" || field.type === "video") {
    const src = strValue || field.fallback || "/images/placeholders/home-hero.svg";
    return (
      <div className={`flex flex-col gap-2 ${fieldSpan(field)}`}>
        <span className="admin-field-label">{field.label}</span>
        {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
        {field.type === "image" ? (
          <div className="relative aspect-[21/9] max-w-xl overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ) : strValue ? (
          <p className="font-mono text-xs text-[var(--admin-text-dim)]">{strValue}</p>
        ) : null}
        <input type="hidden" name={field.key} defaultValue={strValue} />
        <input
          type="file"
          name={`__file__${field.key}`}
          accept={field.type === "video" ? "video/mp4,video/webm" : "image/*"}
          className="text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
      </div>
    );
  }

  if (shouldUseRichEditor(field)) {
    return (
      <WysiwygField
        name={field.key}
        label={field.label}
        hint={field.hint}
        required={field.required}
        defaultValue={strValue}
        placeholder={field.fallback}
        className={fieldSpan(field)}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <label className={`flex flex-col ${fieldSpan(field)}`}>
        <span className="admin-field-label">
          {field.label}
          {field.required ? " *" : ""}
        </span>
        {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
        <textarea
          name={field.key}
          rows={4}
          required={field.required}
          defaultValue={strValue}
          className="admin-textarea"
        />
      </label>
    );
  }

  if (field.type === "boolean") {
    return (
      <label
        className={`flex items-center gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] px-4 py-3 ${fieldSpan(field)}`}
      >
        <input
          type="checkbox"
          name={field.key}
          defaultChecked={value === true}
          value="on"
          className="h-4 w-4"
        />
        <span className="text-sm font-medium text-[var(--admin-text-muted)]">{field.label}</span>
      </label>
    );
  }

  return (
    <label className={`flex flex-col ${fieldSpan(field)}`}>
      <span className="admin-field-label">
        {field.label}
        {field.required ? " *" : ""}
      </span>
      {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
      <input
        type={field.type === "url" ? "url" : "text"}
        name={field.key}
        required={field.required}
        defaultValue={strValue}
        className="admin-input"
        placeholder={field.fallback}
      />
    </label>
  );
}

function renderSectionFields(fields: PageField[], content: PageContent) {
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];
    const next = fields[i + 1];

    if (field && next && isPairableLabel(field) && isPairableHref(next)) {
      nodes.push(
        <div key={field.key} className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
          <FieldControl field={field} content={content} />
          <FieldControl field={next} content={content} />
        </div>,
      );
      i += 2;
      continue;
    }

    nodes.push(<FieldControl key={field.key} field={field} content={content} />);
    i += 1;
  }

  return nodes;
}

export function PageEditor({ definition, content }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const sections = useMemo(() => {
    const map = new Map<string, PageField[]>();
    for (const field of definition.fields) {
      const list = map.get(field.section) ?? [];
      list.push(field);
      map.set(field.section, list);
    }
    return [...map.entries()];
  }, [definition.fields]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await savePageContent(definition.slug, fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="page-editor w-full">
      <div className="admin-sticky-toolbar flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1>{definition.title}</h1>
          {definition.description ? (
            <p className="mt-1 text-sm">{definition.description}</p>
          ) : null}
          <p className="mt-1 text-xs text-[var(--admin-text-dim)]">
            Ruta:{" "}
            <a
              href={definition.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-2 hover:underline"
            >
              {definition.publicPath}
            </a>
          </p>
        </div>
        <button type="submit" disabled={pending} className="admin-btn-primary shrink-0">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      {error ? (
        <p
          className="admin-alert-error mb-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="admin-alert-success mb-6">
          Cambios guardados correctamente.
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map(([sectionTitle, fields]) => (
          <section
            key={sectionTitle}
            className={`admin-section-card ${fields.length > 4 ? "xl:col-span-2" : ""}`}
          >
            <h2 className="admin-section-card__head">{sectionTitle}</h2>
            <div className="admin-section-card__body grid gap-5 lg:grid-cols-2">
              {renderSectionFields(fields, content)}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-end border-t border-[var(--admin-border)] pt-6">
        <button type="submit" disabled={pending} className="admin-btn-primary">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
