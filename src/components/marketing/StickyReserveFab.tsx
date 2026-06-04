"use client";

import Link from "next/link";
import { reservasLinkProps } from "@/lib/reservasLink";
import type { StickyReserveConfig } from "@/lib/marketing/types";

type Props = {
  config: StickyReserveConfig;
};

export function StickyReserveFab({ config }: Props) {
  return (
    <Link
      href={config.href}
      {...reservasLinkProps(config.href)}
      className="fixed bottom-24 right-6 z-40 inline-flex h-12 max-w-[min(100vw-3rem,280px)] items-center justify-center rounded-full bg-btn px-6 text-[14px] font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.22)] transition hover:bg-btn-hover hover:scale-[1.02] lg:right-10"
      aria-label={config.label}
    >
      <span className="truncate">{config.label}</span>
    </Link>
  );
}
