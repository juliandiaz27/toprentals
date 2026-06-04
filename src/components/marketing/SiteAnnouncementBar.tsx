"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnnouncementBarConfig } from "@/lib/marketing/types";

type Props = {
  config: AnnouncementBarConfig;
  /** Identificador estable para recordar cierre en localStorage. */
  storageKey: string;
};

export function SiteAnnouncementBar({ config, storageKey }: Props) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!config.dismissible) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(localStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [config.dismissible, storageKey]);

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    if (config.dismissible) {
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
    }
  }

  const hasLink = Boolean(config.href && config.linkLabel);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] px-4 py-2.5 text-center text-[13px] leading-snug sm:text-[14px]"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
      role="region"
      aria-label="Anuncio"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 pr-8">
        <p className="min-w-0 flex-1">
          <span>{config.message}</span>
          {hasLink ? (
            <>
              {" "}
              <Link
                href={config.href}
                className="font-semibold underline underline-offset-2"
              >
                {config.linkLabel}
              </Link>
            </>
          ) : null}
        </p>
        {config.dismissible ? (
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 opacity-80 transition hover:opacity-100"
            aria-label="Cerrar anuncio"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
