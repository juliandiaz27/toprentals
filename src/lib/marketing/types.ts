export type MarketingAudience = "b2c" | "all";

export type StickyReserveConfig = {
  enabled: boolean;
  label: string;
  href: string;
};

export type AnnouncementBarConfig = {
  enabled: boolean;
  message: string;
  linkLabel: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
  audience: MarketingAudience;
  /** ISO 8601; vacío = sin límite inferior. */
  startAt: string;
  /** ISO 8601; vacío = sin límite superior. */
  endAt: string;
};

export type MarketingConfigFile = {
  stickyReserve: StickyReserveConfig;
  announcementBar: AnnouncementBarConfig;
};
