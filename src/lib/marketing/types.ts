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

export type ScrollPopupConfig = {
  enabled: boolean;
  title: string;
  description: string;
  /** URL interna (/images/…, /api/media/…) o absoluta. Vacío = imagen por defecto. */
  imageUrl: string;
  /** Dato destacado bajo la descripción (ej. «Más de 45 edificios»). */
  highlight: string;
  ctaLabel: string;
  ctaHref: string;
  audience: MarketingAudience;
  /** Píxeles de scroll vertical antes de mostrar el popup. */
  scrollThreshold: number;
  startAt: string;
  endAt: string;
};

export type MarketingConfigFile = {
  stickyReserve: StickyReserveConfig;
  announcementBar: AnnouncementBarConfig;
  scrollPopup: ScrollPopupConfig;
};
