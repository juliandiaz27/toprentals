"use client";

import { useState } from "react";

type Props = {
  ctaLabel: string;
};

export function DevelopmentNewsletterForm({ ctaLabel }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const trimmed = email.trim();
    if (!trimmed) {
      setMessage("Ingresá tu email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "propiedades:en-desarrollo",
          // Honeypot: el backend lo ignora si viene vacío.
          website: "",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "No pudimos registrar tu email. Probá de nuevo.");
        return;
      }

      setStatus("success");
      setMessage("¡Gracias! Te avisaremos cuando haya novedades.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("No pudimos registrar tu email. Probá de nuevo.");
    }
  }

  const disabled = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
      aria-label="Formulario para recibir novedades sobre desarrollos"
    >
      <div className="flex-1">
        <label className="sr-only" htmlFor="development-email">
          Email
        </label>
        <input
          id="development-email"
          type="email"
          autoComplete="email"
          placeholder="Dejá tu email para recibir novedades"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        {/* Honeypot, oculto para usuarios reales */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-950 px-4 text-[13px] font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70"
      >
        {status === "submitting" ? "Enviando…" : ctaLabel.replace(/\s*→\s*$/, "")}
      </button>
      {message ? (
        <p
          className={`text-[12px] sm:text-[13px] ${
            status === "success" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

