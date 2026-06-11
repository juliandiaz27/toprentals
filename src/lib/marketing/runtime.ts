import { isB2cConsumerPath } from "./b2cPaths";
import type {
  AnnouncementBarConfig,
  MarketingConfigFile,
  ScrollPopupConfig,
  StickyReserveConfig,
} from "./types";

function isWithinSchedule(startAt: string, endAt: string, now = new Date()): boolean {
  if (startAt) {
    const start = new Date(startAt);
    if (!Number.isNaN(start.getTime()) && now < start) return false;
  }
  if (endAt) {
    const end = new Date(endAt);
    if (!Number.isNaN(end.getTime()) && now > end) return false;
  }
  return true;
}

export function pathMatchesAudience(
  pathname: string,
  audience: AnnouncementBarConfig["audience"],
): boolean {
  if (audience === "all") {
    return !pathname.startsWith("/admin");
  }
  return isB2cConsumerPath(pathname);
}

export function getActiveAnnouncement(
  config: MarketingConfigFile,
  pathname: string,
  now = new Date(),
): AnnouncementBarConfig | null {
  const bar = config.announcementBar;
  if (!bar.enabled || !bar.message.trim()) return null;
  if (!isWithinSchedule(bar.startAt, bar.endAt, now)) return null;
  if (!pathMatchesAudience(pathname, bar.audience)) return null;
  return bar;
}

export function getStickyReserveForPath(
  config: MarketingConfigFile,
  pathname: string,
): StickyReserveConfig | null {
  const sticky = config.stickyReserve;
  if (!sticky.enabled || !sticky.label.trim()) return null;
  if (!isB2cConsumerPath(pathname)) return null;
  return sticky;
}

export function getActiveScrollPopup(
  config: MarketingConfigFile,
  pathname: string,
  now = new Date(),
): ScrollPopupConfig | null {
  const popup = config.scrollPopup;
  if (!popup.enabled || !popup.title.trim() || !popup.ctaLabel.trim()) return null;
  if (!isWithinSchedule(popup.startAt, popup.endAt, now)) return null;
  if (!pathMatchesAudience(pathname, popup.audience)) return null;
  return popup;
}
