"use client";

import { useState, useTransition } from "react";
import { submitCareerApplication } from "@/app/trabaja-con-nosotros/actions";
import { FormattedText } from "@/components/content/FormattedText";
import type { TrabajaPageContent } from "@/lib/pageContent/trabajaTypes";

type Props = { content: TrabajaPageContent["spontaneous"] };

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-white px-3 py-2.5 text-[14px] text-neutral-950 shadow-sm outline-none ring-1 ring-neutral-200/80 focus:ring-neutral-400";

export function CareersSpontaneousForm({ content }: Props) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      const res = await submitCareerApplication(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSent(true);
      form.reset();
      setCvFileName(null);
    });
  }

  const submit = content.submitLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section
      id="postulacion"
      className="scroll-mt-24 bg-[#F8F8F8] px-6 py-14 lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div data-reveal>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <FormattedText
            value={content.subtitle}
            className="mt-3 block max-w-2xl text-[15px] leading-relaxed text-neutral-600"
          />
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
            <input
              type="hidden"
              name="recipientEmail"
              value={content.recipientEmail}
            />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="sr-only"
              aria-hidden
            />

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
                  disabled={pending}
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
                  disabled={pending}
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
                  disabled={pending}
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
                  disabled={pending}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <input
                id="career-cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required
                disabled={pending}
                className="peer sr-only"
                onChange={(e) =>
                  setCvFileName(e.target.files?.[0]?.name ?? null)
                }
              />
              <label
                htmlFor="career-cv"
                className="mt-1 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-md bg-neutral-200/60 px-4 py-3 text-center text-[14px] font-medium text-neutral-700 transition hover:bg-neutral-200/80 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
              >
                {cvFileName ?? content.attachLabel}
              </label>
            </div>

            {error ? (
              <p className="mt-4 text-[14px] text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-btn px-6 text-[14px] font-semibold text-white hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Enviando…" : `${submit} →`}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
