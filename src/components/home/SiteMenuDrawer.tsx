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

const NAV_ID_BY_HREF = new Map<string, HeaderNavId>(
  HEADER_NAV_CATALOG.map((item) => [item.href, item.id]),
);

function navIdFromHref(href: string): HeaderNavId {
  return NAV_ID_BY_HREF.get(href) ?? "home";
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
        className={`fixed inset-0 z-[125] bg-black/45 transition-opacity duration-300 ease-out lg:top-[72px] ${
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
        className={`fixed inset-0 z-[130] flex flex-col bg-white transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] lg:inset-y-auto lg:left-auto lg:right-0 lg:top-[72px] lg:h-[calc(100dvh-72px)] lg:w-full lg:max-w-md lg:border-l lg:border-neutral-200 lg:shadow-xl ${panelMotion}`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-neutral-200 px-5 lg:h-16">
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
          <p className="hidden text-[15px] font-semibold text-neutral-950 lg:block">
            Menú
          </p>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-950 transition hover:bg-neutral-100"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto overscroll-contain">
          {header.navLinks.map((item) => {
            const active = isLinkActive(item.href);
            const navId = navIdFromHref(item.href);
            return (
              <li key={item.href + item.label} className="border-b border-neutral-200">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-5 py-4 text-[16px] transition-colors ${
                    active
                      ? "bg-neutral-50 font-semibold text-neutral-950"
                      : "font-medium text-slate-800 hover:bg-neutral-50"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <MobileMenuNavIcon id={navId} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="shrink-0 border-t border-neutral-200 px-5 pb-5 pt-4 lg:pb-6">
          <div className="mb-4 flex items-center gap-2 text-[14px] text-neutral-950 lg:mb-0">
            <span className="font-medium">ES</span>
            <span className="font-light text-neutral-300">|</span>
            <Link
              href="?lang=en"
              onClick={onClose}
              className="font-normal text-neutral-500 hover:text-neutral-950"
            >
              EN
            </Link>
          </div>
          <Link
            href={header.ctaHref}
            {...reservasLinkProps(header.ctaHref)}
            onClick={onClose}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-btn text-[15px] font-semibold text-white transition-colors hover:bg-btn-hover lg:mt-4"
          >
            {header.ctaLabel}
          </Link>
        </div>
      </nav>
    </>,
    document.body,
  );
}
