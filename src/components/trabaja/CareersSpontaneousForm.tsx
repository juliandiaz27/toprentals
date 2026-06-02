"use client";

import { useState } from "react";
import type { TrabajaPageContent } from "@/lib/pageContent/trabajaTypes";

type Props = { content: TrabajaPageContent["spontaneous"] };

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-white px-3 py-2.5 text-[14px] text-neutral-950 shadow-sm outline-none ring-1 ring-neutral-200/80 focus:ring-neutral-400";

export function CareersSpontaneousForm({ content }: Props) {
  const [sent, setSent] = useState(false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  const submit = content.submitLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section className="bg-[#F8F8F8] px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <div data-reveal>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-neutral-950">
            {content.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
            {content.subtitle}
          </p>
        </div>

        {sent ? (
          <p
            data-reveal
            data-reveal-delay="80"
            className="mt-8 text-[15px] text-neutral-600"
          >
            Gracias. Recibimos tu postulación y nos pondremos en contacto si hay
            una vacante compatible.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            data-reveal
            data-reveal-delay="80"
            className="mt-8 max-w-3xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="career-nombre"
                  className="text-[13px] font-medium text-neutral-700"
                >
                  Nombre
                </label>
                <input
                  id="career-nombre"
                  name="nombre"
                  type="text"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="career-apellido"
                  className="text-[13px] font-medium text-neutral-700"
                >
                  Apellido
                </label>
                <input
                  id="career-apellido"
                  name="apellido"
                  type="text"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="career-email"
                  className="text-[13px] font-medium text-neutral-700"
                >
                  Email
                </label>
                <input
                  id="career-email"
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="career-telefono"
                  className="text-[13px] font-medium text-neutral-700"
                >
                  Teléfono
                </label>
                <input
                  id="career-telefono"
                  name="telefono"
                  type="tel"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <input
                id="career-cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="peer sr-only"
                onChange={(e) =>
                  setCvFileName(e.target.files?.[0]?.name ?? null)
                }
              />
              <label
                htmlFor="career-cv"
                className="mt-1 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-md bg-neutral-200/60 px-4 py-3 text-center text-[14px] font-medium text-neutral-700 transition hover:bg-neutral-200/80 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-400"
              >
                {cvFileName ?? content.attachLabel}
              </label>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-btn px-6 text-[14px] font-semibold text-white hover:bg-btn-hover"
              >
                {submit} →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
