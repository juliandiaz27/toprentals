"use client";

import { useState } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateAccessContent } from "@/lib/pageContent/corporateTypes";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = { content: CorporateAccessContent };

const inputClass =
  "mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-950 outline-none focus:border-neutral-400";

export function CorporateAccessForm({ content }: Props) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ui } = useLanguage();
  const labels = ui.corporateForm;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch("/api/corporate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: String(fd.get("empresa") ?? ""),
          nombre: String(fd.get("nombre") ?? ""),
          apellido: String(fd.get("apellido") ?? ""),
          email: String(fd.get("email") ?? ""),
          cargo: String(fd.get("cargo") ?? ""),
          telefono: String(fd.get("telefono") ?? ""),
          website: String(fd.get("website") ?? ""),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || ui.common.errorGeneric);
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError(ui.common.errorGeneric);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="h-full rounded-lg bg-white p-6 text-neutral-950 lg:p-8">
      <h3 className="text-lg font-bold">
        <FormattedText value={content.formTitle} as="inline" />
      </h3>
      {sent ? (
        <p className="mt-6 text-[15px] text-neutral-600">{labels.success}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute h-0 w-0 opacity-0"
            aria-hidden
          />
          <div>
            <label htmlFor="corp-empresa" className="text-[13px] font-medium text-neutral-700">
              {labels.company}
            </label>
            <input
              id="corp-empresa"
              name="empresa"
              type="text"
              required
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="corp-nombre" className="text-[13px] font-medium text-neutral-700">
                {labels.firstName}
              </label>
              <input
                id="corp-nombre"
                name="nombre"
                type="text"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="corp-apellido" className="text-[13px] font-medium text-neutral-700">
                {labels.lastName}
              </label>
              <input
                id="corp-apellido"
                name="apellido"
                type="text"
                required
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="corp-email" className="text-[13px] font-medium text-neutral-700">
              {labels.email}
            </label>
            <input
              id="corp-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="corp-cargo" className="text-[13px] font-medium text-neutral-700">
                {labels.jobTitle}
              </label>
              <input id="corp-cargo" name="cargo" type="text" className={inputClass} />
            </div>
            <div>
              <label htmlFor="corp-telefono" className="text-[13px] font-medium text-neutral-700">
                {labels.phone}
              </label>
              <input
                id="corp-telefono"
                name="telefono"
                type="tel"
                required
                className={inputClass}
              />
            </div>
          </div>
          {error ? (
            <p className="text-[14px] text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-md bg-btn px-6 text-[14px] font-medium text-white hover:bg-btn-hover disabled:opacity-60"
            >
              {pending
                ? ui.common.sending
                : `${content.formSubmitLabel.replace(/\s*→\s*$/, "").trim()} →`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
