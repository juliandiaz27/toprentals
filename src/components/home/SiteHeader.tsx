"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import type { HomeHeaderContent } from "@/lib/pageContent/homeTypes";
import { reservasLinkProps } from "@/lib/reservasLink";
import { MobileBottomNav } from "@/components/home/MobileBottomNav";
import { MobileMenuDrawer } from "@/components/home/MobileMenuDrawer";

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
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      document.body.classList.toggle("has-mobile-bottom-nav", mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.body.classList.remove("has-mobile-bottom-nav");
    };
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

  const isNavActive = useCallback(
    (href: string) => isLinkActive(href, pathname, activeHref),
    [pathname, activeHref],
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
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-950 transition hover:bg-neutral-50 lg:inline-flex"
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
      {mounted ? (
        <MobileMenuDrawer
          open={menuOpen}
          menuId={menuId}
          header={header}
          onClose={closeMenu}
          isLinkActive={isNavActive}
        />
      ) : null}
      <MobileBottomNav
        pathname={pathname}
        activeHref={activeHref}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
      />
    </>
  );
}
