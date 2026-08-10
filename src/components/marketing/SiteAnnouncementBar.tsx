"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { AnnouncementBarConfig } from "@/lib/marketing/types";

type Props = {
  config: AnnouncementBarConfig;
  /** Identificador estable para recordar cierre en localStorage. */
  storageKey: string;
};

function readDismissed(storageKey: string): boolean {
  try {
    return localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

export function SiteAnnouncementBar({ config, storageKey }: Props) {
  const { ui } = useLanguage();
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (!config.dismissible) {
      setVisible(true);
      return;
    }
    setVisible(!readDismissed(storageKey));
  }, [config.dismissible, storageKey]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
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
      className="relative z-[120] w-full shrink-0 px-4 py-2.5 text-center text-[13px] leading-snug sm:text-[14px]"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
      role="region"
      aria-label={ui.marketing.announcementAria}
    >
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-center gap-3 pr-8">
        <p className="min-w-0 flex-1">
          <FormattedText value={config.message} as="inline" />
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
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-1 opacity-80 transition hover:opacity-100"
            aria-label={ui.marketing.closeAnnouncement}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
