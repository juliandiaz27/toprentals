"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import type { HomeHeaderContent } from "@/lib/pageContent/homeTypes";
import { reservasLinkProps } from "@/lib/reservasLink";
import { MobileBottomNav } from "@/components/home/MobileBottomNav";
import { SiteMenuDrawer } from "@/components/home/SiteMenuDrawer";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { BrandWordmark } from "@/components/brand/BrandShapes";

/** Links visibles en la barra (Figma); el resto queda en el menú lateral. */
const INLINE_NAV_HREFS = ["/propiedades", "/corporate", "/club-top-rentals"];

const COLOR_HEADER_BG = {
  green: "bg-tr-green",
  red: "bg-tr-red",
  orange: "bg-tr-orange",
  ink: "bg-tr-ink",
};

type Props = {
  header: HomeHeaderContent;
  /** Header de color (texto blanco): verde en Propiedades/Corporate, color del edificio en la ficha. */
  variant?: "default" | "muted" | keyof typeof COLOR_HEADER_BG;
  /** Botón «Reservar ahora» sobre header de color: rojo (Propiedades) o blanco (Corporate). */
  ctaTone?: "red" | "white";
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
  ctaTone = "red",
}: Props) {
  const pathname = usePathname() ?? "";
  const { ui } = useLanguage();
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

  /* Rebranding: fondo crema en todas las páginas */
  const green = variant in COLOR_HEADER_BG;
  const headerBg = green
    ? `border-transparent text-white ${COLOR_HEADER_BG[variant as keyof typeof COLOR_HEADER_BG]}`
    : variant === "muted"
      ? "border-black/5 bg-tr-cream text-tr-ink"
      : "border-transparent bg-tr-cream text-tr-ink";

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
          {header.logoSrc && !header.logoSrc.includes("placeholders") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={header.logoSrc}
              alt={header.logoText}
              className="h-8 max-w-[200px] object-contain object-left"
            />
          ) : (
            <span aria-label={header.logoText}>
              <BrandWordmark className="text-[26px]" />
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="mr-4 hidden items-center gap-12 lg:flex" aria-label="Principal">
            {header.navLinks
              .filter((item) => INLINE_NAV_HREFS.includes(item.href))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isNavActive(item.href) ? "page" : undefined}
                  className={`text-[15px] transition hover:opacity-70 ${
                    isNavActive(item.href) ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <LanguageSwitcher
            className={`mr-2 hidden md:flex ${
              green
                ? "[&_button]:text-white/70 [&_button:hover]:text-white [&_button[aria-pressed=true]]:text-white"
                : ""
            }`}
          />

          <Link
            href={header.ctaHref}
            {...reservasLinkProps(header.ctaHref)}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-[3px] px-4 text-[13px] font-semibold text-white transition-colors sm:px-6 sm:text-[14px] ${
              !green
                ? "bg-tr-ink hover:bg-black"
                : ctaTone === "white"
                  ? "bg-white !text-tr-ink hover:bg-tr-cream"
                  : "bg-tr-red hover:brightness-110"
            }`}
          >
            {header.ctaLabel}
          </Link>

          <button
            type="button"
            className={`hidden h-10 w-10 items-center justify-center rounded-[3px] transition lg:inline-flex ${
              green ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? ui.nav.closeMenu : ui.nav.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
      </header>
      {mounted ? (
        <SiteMenuDrawer
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
