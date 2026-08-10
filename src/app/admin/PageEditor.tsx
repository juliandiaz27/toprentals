"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { MediaUploadGuide } from "./MediaUploadGuide";
import type { MediaUploadGuide as MediaUploadGuideSpec } from "@/lib/mediaUploadGuide";
import {
  resolveUploadGuide,
  validateFileAgainstGuide,
} from "@/lib/mediaUploadGuide";
import type { PageDefinition, PageField } from "@/lib/pageContent/types";
import type { PageContent } from "@/lib/pageContent/types";
import { getNested } from "@/lib/pageContent/nested";
import {
  fieldIsLockedRoute,
  fieldUsesRoutePicker,
} from "@/lib/pageContent/pageFieldValue";
import { shouldUseRichEditor } from "@/lib/pageContent/richEditor";
import {
  isExternalUrlFieldKey,
  normalizeInternalHref,
  routesForPreset,
} from "@/lib/pageContent/siteRoutes";
import { CardListField } from "./CardListField";
import { CityFiltersField } from "./CityFiltersField";
import { parseClubHowItWorksSteps } from "@/lib/pageContent/clubTypes";
import { parseDifferentialCards } from "@/lib/pageContent/differentialCards";
import { cardListFieldBounds } from "@/lib/pageContent/cardListField";
import {
  PROPERTY_CITY_FILTERS_MAX,
  PROPERTY_CITY_FILTERS_MIN,
  parsePropertyCityFilters,
} from "@/lib/pageContent/propertyCityFilters";
import { parseDevelopmentCards } from "@/lib/pageContent/propiedadesTypes";
import { AdminStickyAlerts } from "./AdminStickyAlerts";
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import { savePageContent } from "./pageActions";
import { WysiwygField } from "./WysiwygField";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";

type Props = {
  definition: PageDefinition;
  content: PageContent;
  language?: SiteLanguage;
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

function MediaUploadField({
  field,
  src,
  strValue,
  uploadGuide,
  fieldSpanClass,
}: {
  field: PageField;
  src: string;
  strValue: string;
  uploadGuide?: MediaUploadGuideSpec;
  fieldSpanClass: string;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState(src);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setPreviewSrc(src);
  }, [src]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${fieldSpanClass}`}>
      <span className="admin-field-label">{field.label}</span>
      {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
      {uploadGuide ? <MediaUploadGuide guide={uploadGuide} /> : null}
      {field.type === "image" ? (
        <div className="relative aspect-[21/9] max-w-xl overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="" className="h-full w-full object-cover" />
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) {
            setFileError(null);
            setPreviewSrc(src);
            if (objectUrlRef.current) {
              URL.revokeObjectURL(objectUrlRef.current);
              objectUrlRef.current = null;
            }
            return;
          }
          const validationError = validateFileAgainstGuide(file, uploadGuide);
          setFileError(validationError);
          if (validationError) return;

          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
          }
          const nextUrl = URL.createObjectURL(file);
          objectUrlRef.current = nextUrl;
          if (field.type === "image") {
            setPreviewSrc(nextUrl);
          }
        }}
      />
      {fileError ? (
        <p className="text-xs text-red-400" role="alert">
          {fileError}
        </p>
      ) : null}
    </div>
  );
}

function fieldSpan(field: PageField): string {
  if (
    field.type === "textarea" ||
    field.type === "rich" ||
    field.type === "cardList" ||
    field.type === "cityFilterList" ||
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

  if (field.type === "cityFilterList") {
    const parentKey = field.key.split(".").slice(0, -1).join(".");
    const parent = parentKey
      ? (getNested(content, parentKey) as Record<string, unknown> | undefined)
      : undefined;
    const initialItems = parsePropertyCityFilters(
      parent && typeof parent === "object" ? parent : {},
    );
    return (
      <CityFiltersField
        name={field.key}
        label={field.label}
        hint={field.hint}
        min={field.listMin ?? PROPERTY_CITY_FILTERS_MIN}
        max={field.listMax ?? PROPERTY_CITY_FILTERS_MAX}
        initialItems={initialItems}
      />
    );
  }

  if (field.type === "cardList") {
    const { min, max } = cardListFieldBounds(field);
    const parentKey = field.key.split(".").slice(0, -1).join(".");
    const parent = parentKey
      ? (getNested(content, parentKey) as Record<string, unknown> | undefined)
      : undefined;
    const parentObj = parent && typeof parent === "object" ? parent : {};
    const initialCards =
      field.key === "howItWorks.steps"
        ? parseClubHowItWorksSteps(parentObj)
        : field.key === "development.cards"
          ? parseDevelopmentCards(parentObj)
          : parseDifferentialCards(parentObj);
    return (
      <CardListField
        name={field.key}
        label={field.label}
        hint={field.hint}
        min={min}
        max={max}
        initialCards={initialCards}
      />
    );
  }

  if (field.type === "image" || field.type === "video") {
    const src = strValue || field.fallback || "/images/placeholders/home-hero.svg";
    const uploadGuide = resolveUploadGuide(field);
    return (
      <MediaUploadField
        field={field}
        src={src}
        strValue={strValue}
        uploadGuide={uploadGuide}
        fieldSpanClass={fieldSpan(field)}
      />
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

  if (fieldIsLockedRoute(field)) {
    const href = field.lockedHref ?? "";
    return (
      <div className={`flex flex-col gap-2 ${fieldSpan(field)}`}>
        <span className="admin-field-label">{field.label}</span>
        {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
        <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] px-3 py-2 font-mono text-sm text-[var(--admin-text-muted)]">
          {href}
        </p>
        <span className="admin-field-hint">
          La ruta está fija para evitar enlaces rotos. Solo podés editar el texto del botón.
        </span>
        <input type="hidden" name={field.key} value={href} />
      </div>
    );
  }

  if (fieldUsesRoutePicker(field)) {
    const options = routesForPreset(field.routePreset);
    const normalized = normalizeInternalHref(
      strValue || field.fallback || options[0]?.href || "/",
    );
    const selected = options.some((o) => o.href === normalized)
      ? normalized
      : (options.find((o) => o.href === normalizeInternalHref(field.fallback ?? ""))
          ?.href ?? options[0]?.href ?? "/");

    return (
      <label className={`flex flex-col gap-2 ${fieldSpan(field)}`}>
        <span className="admin-field-label">
          {field.label}
          {field.required ? " *" : ""}
        </span>
        {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
        <span className="admin-field-hint">
          Elegí la página de destino. No hace falta escribir la URL a mano.
        </span>
        <select
          name={field.key}
          required={field.required}
          defaultValue={selected}
          className="admin-input"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.href}>
              {opt.label} ({opt.href})
            </option>
          ))}
        </select>
      </label>
    );
  }

  const isExternalLink =
    field.type === "url" && isExternalUrlFieldKey(field.key);

  return (
    <label className={`flex flex-col ${fieldSpan(field)}`}>
      <span className="admin-field-label">
        {field.label}
        {field.required ? " *" : ""}
      </span>
      {field.hint ? <span className="admin-field-hint">{field.hint}</span> : null}
      {isExternalLink ? (
        <span className="admin-field-hint">
          Enlace externo (https://, mailto:, etc.).
        </span>
      ) : null}
      <input
        type="text"
        name={field.key}
        required={field.required}
        defaultValue={strValue}
        className="admin-input"
        placeholder={field.fallback}
        inputMode={isExternalLink ? "url" : undefined}
        autoComplete="off"
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

export function PageEditor({
  definition,
  content,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {
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
    <form onSubmit={handleSubmit} noValidate className="page-editor w-full">
      <input type="hidden" name="language" value={language} />
      <div className="admin-sticky-toolbar">
        <div className="admin-sticky-toolbar__head">
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
              {" · "}
              Editando {language === "en" ? "inglés" : "español"}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <AdminLanguageSwitcher language={language} />
            <button type="submit" disabled={pending} className="admin-btn-primary">
              {pending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
        <AdminStickyAlerts error={error} success={success} />
      </div>

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
