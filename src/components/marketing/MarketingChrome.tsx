"use client";

import { usePathname } from "next/navigation";
import {
  getActiveAnnouncement,
  getStickyReserveForPath,
} from "@/lib/marketing/runtime";
import type { MarketingConfigFile } from "@/lib/marketing/types";
import { SiteAnnouncementBar } from "./SiteAnnouncementBar";
import { StickyReserveFab } from "./StickyReserveFab";

type Props = {
  config: MarketingConfigFile;
};

function announcementStorageKey(config: MarketingConfigFile): string {
  const bar = config.announcementBar;
  const slug = `${bar.message}|${bar.href}|${bar.startAt}|${bar.endAt}`;
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

  return (
    <>
      {announcement ? (
        <SiteAnnouncementBar
          config={announcement}
          storageKey={announcementStorageKey(config)}
        />
      ) : null}
      {sticky ? <StickyReserveFab config={sticky} /> : null}
    </>
  );
}
