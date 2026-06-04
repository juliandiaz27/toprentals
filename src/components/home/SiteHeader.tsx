"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { HomeHeaderContent } from "@/lib/pageContent/homeTypes";
import { reservasLinkProps } from "@/lib/reservasLink";

type Props = {
  header: HomeHeaderContent;
  variant?: "default" | "muted";
  activeHref?: string;
};

function normalizePath(path: string): string {
  const base = (path.split("?")[0] ?? path).replace(/\/$/, "");
  return base || "/";
}

function isLinkActive(
  itemHref: string,
  pathname: string,
  activeHref?: string,
): boolean {
  const current = normalizePath(pathname);
  const href = normalizePath(itemHref);
  if (activeHref) {
    return href === normalizePath(activeHref);
  }
  return current === href;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${
          open ? "top-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${
          open ? "top-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function SiteHeader({
  header,
  variant = "default",
  activeHref,
}: Props) {
  const pathname = usePathname() ?? "";
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const links = header.navLinks;

  useEffect(() => {
    setMounted(true);
  }, []);

  const headerBg =
    variant === "muted"
      ? "border-neutral-200/80 bg-[#F8F8F8]"
      : "border-neutral-200 bg-white";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const menuPortal =
    mounted &&
    createPortal(
      <>
        {menuOpen ? (
          <button
            type="button"
            className="fixed inset-0 top-[72px] z-[90] bg-black/40"
            aria-label="Cerrar menú"
            onClick={closeMenu}
          />
        ) : null}

        <nav
          id={menuId}
          aria-label="Principal"
          className={`fixed right-0 top-[72px] z-[100] flex h-[calc(100dvh-72px)] w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300 ease-out sm:max-w-md ${
            menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="flex flex-col gap-1">
              {links.map((item) => {
                const active = isLinkActive(item.href, pathname, activeHref);
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`block rounded-lg px-4 py-3.5 text-[16px] transition ${
                        active
                          ? "bg-neutral-100 font-semibold text-neutral-950"
                          : "font-normal text-neutral-800 hover:bg-neutral-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center gap-2 border-t border-neutral-100 pt-6 text-[14px] text-neutral-950 md:hidden">
              <span className="font-medium">ES</span>
              <span className="font-light text-neutral-300">|</span>
              <Link
                href="?lang=en"
                onClick={closeMenu}
                className="font-normal text-neutral-500 hover:text-neutral-950"
              >
                EN
              </Link>
            </div>
          </div>
        </nav>
      </>,
      document.body,
    );

  return (
    <>
      <header
        className={`site-header sticky top-0 z-[110] border-b ${headerBg}`}
      >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-12">
        <Link href="/" className="shrink-0" onClick={closeMenu}>
          {header.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={header.logoSrc}
              alt={header.logoText}
              className="h-8 max-w-[200px] object-contain object-left"
            />
          ) : (
            <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-neutral-950">
              {header.logoText}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="hidden items-center gap-2 text-[14px] text-neutral-950 md:flex"
            aria-label="Idioma"
          >
            <span className="font-medium">ES</span>
            <span className="font-light text-neutral-300">|</span>
            <Link
              href="?lang=en"
              className="font-normal text-neutral-500 transition-colors hover:text-neutral-950"
            >
              EN
            </Link>
          </div>

          <Link
            href={header.ctaHref}
            {...reservasLinkProps(header.ctaHref)}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-btn px-4 text-[13px] font-medium text-white transition-colors hover:bg-btn-hover sm:px-5 sm:text-[14px]"
          >
            {header.ctaLabel}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-950 transition hover:bg-neutral-50"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
      </header>
      {menuPortal}
    </>
  );
}
