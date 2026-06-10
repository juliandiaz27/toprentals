"use client";

import Link from "next/link";
import {
  MOBILE_BOTTOM_NAV_TABS,
  isMobileBottomTabActive,
} from "@/lib/pageContent/mobileBottomNav";
import { MobileBottomNavIconSvg } from "./MobileBottomNavIcons";

type Props = {
  pathname: string;
  activeHref?: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function MobileBottomNav({
  pathname,
  activeHref,
  menuOpen,
  onToggleMenu,
}: Props) {
  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-[105] border-t border-neutral-200 bg-white lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex h-[3.75rem] max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom,0px)]">
        {MOBILE_BOTTOM_NAV_TABS.map((tab) => {
          if (tab.kind === "menu") {
            const active = menuOpen;
            return (
              <li key={tab.id} className="flex min-w-0 flex-1">
                <button
                  type="button"
                  onClick={onToggleMenu}
                  className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium leading-tight transition-colors"
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  <MobileBottomNavIconSvg name="more" active={active} />
                  <span className={active ? "text-neutral-950" : "text-neutral-500"}>
                    {tab.label}
                  </span>
                </button>
              </li>
            );
          }

          const active = isMobileBottomTabActive(tab, pathname, activeHref);
          return (
            <li key={tab.id} className="flex min-w-0 flex-1">
              <Link
                href={tab.href}
                className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium leading-tight transition-colors"
                aria-current={active ? "page" : undefined}
              >
                <MobileBottomNavIconSvg name={tab.icon} active={active} />
                <span
                  className={`max-w-full truncate ${
                    active ? "font-semibold text-neutral-950" : "text-neutral-500"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
