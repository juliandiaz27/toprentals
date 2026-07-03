"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_SITE_LANGUAGE,
  SITE_LANGUAGE_COOKIE,
  SITE_LANGUAGE_COOKIE_MAX_AGE,
  type SiteLanguage,
} from "@/lib/i18n";

type Props = {
  /** Espaciado/estilo según dónde se use (header o drawer). */
  className?: string;
  onNavigate?: () => void;
};

function readLanguageCookie(): SiteLanguage {
  if (typeof document === "undefined") return DEFAULT_SITE_LANGUAGE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SITE_LANGUAGE_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "en" ? "en" : DEFAULT_SITE_LANGUAGE;
}

const LANGUAGES: { id: SiteLanguage; label: string }[] = [
  { id: "es", label: "ES" },
  { id: "en", label: "EN" },
];

export function LanguageSwitcher({ className = "", onNavigate }: Props) {
  const router = useRouter();
  // El primer render (SSR y cliente) usa el idioma por defecto para evitar
  // desajustes de hidratación; luego se sincroniza con la cookie.
  const [active, setActive] = useState<SiteLanguage>(DEFAULT_SITE_LANGUAGE);

  useEffect(() => {
    setActive(readLanguageCookie());
  }, []);

  function selectLanguage(lang: SiteLanguage) {
    if (lang === active) {
      onNavigate?.();
      return;
    }
    document.cookie = `${SITE_LANGUAGE_COOKIE}=${lang}; path=/; max-age=${SITE_LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
    setActive(lang);
    onNavigate?.();
    router.refresh();
  }

  return (
    <div className={`flex items-center gap-2 text-[14px] ${className}`.trim()}>
      {LANGUAGES.map((lang, index) => (
        <span key={lang.id} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="font-light text-neutral-300" aria-hidden>
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => selectLanguage(lang.id)}
            aria-pressed={active === lang.id}
            className={`transition-colors ${
              active === lang.id
                ? "font-medium text-neutral-950"
                : "font-normal text-neutral-500 hover:text-neutral-950"
            }`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  );
}
