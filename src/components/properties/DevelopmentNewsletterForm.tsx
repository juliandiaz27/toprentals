"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  ctaLabel: string;
  /** Títulos de los proyectos "En desarrollo" (texto plano). */
  projects: string[];
};

export function DevelopmentNewsletterForm({ ctaLabel, projects }: Props) {
  const { ui } = useLanguage();
  const [email, setEmail] = useState("");
  const [project, setProject] = useState(projects[0] ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const trimmed = email.trim();
    if (!trimmed) {
      setMessage(ui.newsletter.invalidEmail);
      setStatus("error");
      return;
    }
    if (projects.length > 0 && !project.trim()) {
      setMessage(ui.newsletter.chooseProjectError);
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
          project: project.trim() || undefined,
          source: "propiedades:en-desarrollo",
          website: "",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || ui.common.errorGeneric);
        return;
      }

      setStatus("success");
      setMessage(ui.newsletter.success);
      setEmail("");
      setProject(projects[0] ?? "");
    } catch {
      setStatus("error");
      setMessage(ui.common.errorGeneric);
    }
  }

  const disabled = status === "submitting";
  const fieldClass =
    "h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-[14px] text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex w-full flex-col gap-3"
      aria-label={ui.newsletter.aria}
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        {projects.length > 0 ? (
          <div className="sm:w-[min(100%,240px)] sm:shrink-0">
            <label className="sr-only" htmlFor="development-project">
              {ui.newsletter.project}
            </label>
            <select
              id="development-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              disabled={disabled}
              required
              className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23737373%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9`}
            >
              <option value="" disabled>
                {ui.newsletter.chooseProject}
              </option>
              {projects.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="development-email">
            {ui.newsletter.email}
          </label>
          <input
            id="development-email"
            type="email"
            autoComplete="email"
            placeholder={ui.newsletter.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            required
            className={`${fieldClass} placeholder:text-neutral-400`}
          />
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
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-neutral-950 px-4 text-[13px] font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70"
        >
          {status === "submitting"
            ? ui.common.sending
            : ctaLabel.replace(/\s*→\s*$/, "")}
        </button>
      </div>

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
