"use client";

import { useState } from "react";
import type { CorporateAccessContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateAccessContent };

const inputClass =
  "mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-950 outline-none focus:border-neutral-400";

export function CorporateAccessForm({ content }: Props) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div
      id="acceso-corporativo"
      className="scroll-mt-24 h-full rounded-lg bg-white p-6 text-neutral-950 lg:p-8"
    >
      <h3 className="text-lg font-bold">{content.formTitle}</h3>
      {sent ? (
        <p className="mt-6 text-[15px] text-neutral-600">
          Gracias. Recibimos tu solicitud y nos pondremos en contacto a la brevedad.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="corp-empresa" className="text-[13px] font-medium text-neutral-700">
              Empresa
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
                Nombre
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
                Apellido
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="corp-cargo" className="text-[13px] font-medium text-neutral-700">
                Cargo
              </label>
              <input id="corp-cargo" name="cargo" type="text" className={inputClass} />
            </div>
            <div>
              <label htmlFor="corp-telefono" className="text-[13px] font-medium text-neutral-700">
                Teléfono
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
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-neutral-950 px-6 text-[14px] font-medium text-white hover:bg-neutral-800"
            >
              {content.formSubmitLabel.replace(/\s*→\s*$/, "").trim()} →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
