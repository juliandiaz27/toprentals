"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { PageDefinition } from "@/lib/pageContent/types";
import type { PageContent } from "@/lib/pageContent/types";
import { getNested } from "@/lib/pageContent/nested";
import { savePageContent } from "./pageActions";

type Props = {
  definition: PageDefinition;
  content: PageContent;
};

export function PageEditor({ definition, content }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const sections = useMemo(() => {
    const map = new Map<string, typeof definition.fields>();
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
    <form onSubmit={handleSubmit} className="page-editor max-w-3xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Editar: {definition.title}
          </h1>
          {definition.description ? (
            <p className="mt-1 text-sm text-neutral-500">{definition.description}</p>
          ) : null}
          <p className="mt-1 text-xs text-neutral-400">
            Ruta pública:{" "}
            <a
              href={definition.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {definition.publicPath}
            </a>
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="admin-btn-primary shrink-0 rounded bg-[#2271b1] px-5 py-2 text-sm font-medium text-white hover:bg-[#135e96] disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Cambios guardados correctamente.
        </p>
      ) : null}

      <div className="flex flex-col gap-8">
        {sections.map(([sectionTitle, fields]) => (
          <section
            key={sectionTitle}
            className="rounded border border-neutral-200 bg-white shadow-sm"
          >
            <h2 className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800">
              {sectionTitle}
            </h2>
            <div className="flex flex-col gap-4 p-4">
              {fields.map((field) => {
                const value = getNested(content, field.key);
                const strValue =
                  value === undefined || value === null ? "" : String(value);

                if (field.type === "image" || field.type === "video") {
                  const src =
                    strValue || field.fallback || "/images/placeholders/home-hero.svg";
                  return (
                    <div key={field.key} className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-neutral-700">
                        {field.label}
                      </span>
                      {field.hint ? (
                        <span className="text-xs text-neutral-500">{field.hint}</span>
                      ) : null}
                      {field.type === "image" ? (
                        <div className="relative aspect-[21/9] max-w-md overflow-hidden rounded border bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : strValue ? (
                        <p className="text-xs font-mono text-neutral-500">{strValue}</p>
                      ) : null}
                      <input type="hidden" name={field.key} defaultValue={strValue} />
                      <input
                        type="file"
                        name={`__file__${field.key}`}
                        accept={field.type === "video" ? "video/mp4,video/webm" : "image/*"}
                        className="text-sm"
                      />
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label key={field.key} className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-700">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      {field.hint ? (
                        <span className="text-xs text-neutral-500">{field.hint}</span>
                      ) : null}
                      <textarea
                        name={field.key}
                        rows={4}
                        required={field.required}
                        defaultValue={strValue}
                        className="rounded border border-neutral-300 px-3 py-2 text-sm"
                      />
                    </label>
                  );
                }

                if (field.type === "boolean") {
                  return (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name={field.key}
                        defaultChecked={value === true}
                        value="on"
                      />
                      {field.label}
                    </label>
                  );
                }

                return (
                  <label key={field.key} className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {field.hint ? (
                      <span className="text-xs text-neutral-500">{field.hint}</span>
                    ) : null}
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      name={field.key}
                      required={field.required}
                      defaultValue={strValue}
                      className="rounded border border-neutral-300 px-3 py-2 text-sm"
                      placeholder={field.fallback}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#2271b1] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
