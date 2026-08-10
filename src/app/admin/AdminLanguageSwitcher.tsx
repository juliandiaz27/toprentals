"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";

type Props = {
  language: SiteLanguage;
  className?: string;
};

const LANGUAGES: { id: SiteLanguage; label: string }[] = [
  { id: "es", label: "ES" },
  { id: "en", label: "EN" },
];

/**
 * Switch de idioma del editor de páginas (solo admin).
 * Usa `?lang=` en la URL; no toca la cookie pública `site-lang`.
 */
export function AdminLanguageSwitcher({ language, className = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin";
  function selectLanguage(lang: SiteLanguage) {
    if (lang === language) return;
    const href =
      lang === DEFAULT_SITE_LANGUAGE ? pathname : `${pathname}?lang=${lang}`;
    router.push(href);
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] px-3 py-1.5 text-[13px] ${className}`.trim()}
      role="group"
      aria-label="Idioma del editor"
    >
      {LANGUAGES.map((lang, index) => (
        <span key={lang.id} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="font-light text-[var(--admin-text-dim)]" aria-hidden>
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => selectLanguage(lang.id)}
            aria-pressed={language === lang.id}
            className={`transition-colors ${
              language === lang.id
                ? "font-semibold text-[var(--admin-text)]"
                : "font-normal text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]"
            }`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  );
}
