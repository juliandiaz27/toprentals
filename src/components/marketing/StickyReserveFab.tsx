"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { reservasLinkProps } from "@/lib/reservasLink";
import type { StickyReserveConfig } from "@/lib/marketing/types";

type Props = {
  config: StickyReserveConfig;
};

export function StickyReserveFab({ config }: Props) {
  const { lang, ui } = useLanguage();
  const label =
    lang === "en"
      ? config.labelEn.trim() ||
        (config.label.trim().toLowerCase() === "reservar ahora"
          ? ui.common.bookNow
          : config.label.trim()) ||
        ui.common.bookNow
      : config.label.trim() || ui.common.bookNow;

  return (
    <Link
      href={config.href}
      {...reservasLinkProps(config.href)}
      className="fixed right-6 z-40 inline-flex h-12 max-w-[min(100vw-3rem,280px)] items-center justify-center rounded-full bg-btn px-6 text-[14px] font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.22)] transition hover:bg-btn-hover hover:scale-[1.02] max-lg:bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+4.75rem)] lg:bottom-24 lg:right-10"
      aria-label={label}
    >
      <span className="truncate">{label}</span>
    </Link>
  );
}
