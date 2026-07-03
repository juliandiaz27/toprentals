"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import type { HomeHeaderContent } from "@/lib/pageContent/homeTypes";
import {
  HEADER_NAV_CATALOG,
  type HeaderNavId,
} from "@/lib/pageContent/headerNav";
import { reservasLinkProps } from "@/lib/reservasLink";
import { MobileMenuNavIcon } from "./MobileMenuNavIcons";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const NAV_ID_BY_HREF = new Map<string, HeaderNavId>(
  HEADER_NAV_CATALOG.map((item) => [item.href, item.id]),
);

function navIdFromHref(href: string): HeaderNavId {
  return NAV_ID_BY_HREF.get(href) ?? "home";
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  open: boolean;
  menuId: string;
  header: HomeHeaderContent;
  onClose: () => void;
  isLinkActive: (href: string) => boolean;
};

/**
 * Menú off-canvas: mobile sube desde abajo (fullscreen); desktop entra desde la derecha.
 */
export function SiteMenuDrawer({
  open,
  menuId,
  header,
  onClose,
  isLinkActive,
}: Props) {
  if (typeof document === "undefined") return null;

  const panelMotion = open
    ? "translate-y-0 lg:translate-x-0"
    : "pointer-events-none translate-y-full lg:translate-y-0 lg:translate-x-full";

  return createPortal(
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[125] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out lg:top-[72px] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Cerrar menú"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <nav
        id={menuId}
        aria-label="Menú principal"
        aria-hidden={!open}
        className={`fixed inset-0 z-[130] flex flex-col bg-white transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] lg:inset-y-auto lg:left-auto lg:right-0 lg:top-[72px] lg:h-[calc(100dvh-72px)] lg:w-full lg:max-w-[380px] lg:border-l lg:border-neutral-200/80 lg:shadow-[-8px_0_40px_rgba(15,23,42,0.08)] ${panelMotion}`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-100 px-5 lg:h-[60px] lg:px-6">
          <Link href="/" onClick={onClose} className="min-w-0 shrink pr-4 lg:hidden">
            {header.logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={header.logoSrc}
                alt={header.logoText}
                className="h-8 max-w-[180px] object-contain object-left"
              />
            ) : (
              <span className="text-[14px] font-bold uppercase tracking-[0.04em] text-neutral-950">
                {header.logoText}
              </span>
            )}
          </Link>
          <p className="hidden text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-500 lg:block">
            Menú
          </p>
          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
          <ul className="flex flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-4 lg:px-5 lg:py-5">
            {header.navLinks.map((item) => {
              const active = isLinkActive(item.href);
              const navId = navIdFromHref(item.href);
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3.5 rounded-xl px-3 py-3 text-[15px] transition-colors lg:py-3.5 ${
                      active
                        ? "bg-neutral-100 font-semibold text-neutral-950"
                        : "font-medium text-neutral-800 hover:bg-neutral-50"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200/80"
                          : "bg-neutral-50 text-neutral-700 group-hover:bg-white group-hover:ring-1 group-hover:ring-neutral-200/60"
                      }`}
                    >
                      <MobileMenuNavIcon id={navId} />
                    </span>
                    <span className="leading-snug">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="shrink-0 border-t border-neutral-100 px-5 py-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] lg:px-6 lg:py-6">
            <LanguageSwitcher className="mb-4" onNavigate={onClose} />
            <Link
              href={header.ctaHref}
              {...reservasLinkProps(header.ctaHref)}
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center rounded-full bg-btn text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(18,18,18,0.18)] transition-colors hover:bg-btn-hover"
            >
              {header.ctaLabel}
            </Link>
          </div>
        </div>
      </nav>
    </>,
    document.body,
  );
}
