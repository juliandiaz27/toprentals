"use client";

import { usePathname } from "next/navigation";
import {
  getActiveAnnouncement,
  getActiveScrollPopup,
  getStickyReserveForPath,
} from "@/lib/marketing/runtime";
import { scrollPopupStorageKey } from "@/lib/marketing/scrollPopupStorage";
import type {
  AnnouncementBarConfig,
  MarketingConfigFile,
} from "@/lib/marketing/types";
import { SiteAnnouncementBar } from "./SiteAnnouncementBar";
import { SiteScrollPopup } from "./SiteScrollPopup";
import { StickyReserveFab } from "./StickyReserveFab";

type Props = {
  config: MarketingConfigFile;
};

/** Cambia si editás la campaña en admin → la barra vuelve a mostrarse aunque la hayan cerrado antes. */
export function announcementStorageKey(bar: AnnouncementBarConfig): string {
  const slug = [
    bar.message,
    bar.linkLabel,
    bar.href,
    bar.backgroundColor,
    bar.textColor,
    bar.startAt,
    bar.endAt,
    bar.audience,
  ].join("|");
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return `tr-announce-${Math.abs(hash)}`;
}

export function MarketingChrome({ config }: Props) {
  const pathname = usePathname() ?? "";
  const sticky = getStickyReserveForPath(config, pathname);
  const announcement = getActiveAnnouncement(config, pathname);
  const scrollPopup = getActiveScrollPopup(config, pathname);

  return (
    <>
      {announcement ? (
        <SiteAnnouncementBar
          config={announcement}
          storageKey={announcementStorageKey(announcement)}
        />
      ) : null}
      {scrollPopup ? (
        <SiteScrollPopup
          config={scrollPopup}
          storageKey={scrollPopupStorageKey(scrollPopup)}
        />
      ) : null}
      {sticky ? <StickyReserveFab config={sticky} /> : null}
    </>
  );
}
