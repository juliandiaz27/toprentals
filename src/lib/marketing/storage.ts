import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type {
  AnnouncementBarConfig,
  MarketingConfigFile,
  ScrollPopupConfig,
  StickyReserveConfig,
} from "./types";

const DEFAULT_STICKY: StickyReserveConfig = {
  enabled: true,
  label: "Reservar ahora",
  labelEn: "Book now",
  href: "/reservas",
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBarConfig = {
  enabled: false,
  message: "",
  linkLabel: "",
  messageEn: "",
  linkLabelEn: "",
  href: "",
  backgroundColor: "#111111",
  textColor: "#ffffff",
  dismissible: true,
  audience: "b2c",
  startAt: "",
  endAt: "",
};

const DEFAULT_SCROLL_POPUP: ScrollPopupConfig = {
  enabled: false,
  title: "",
  description: "",
  imageUrl: "",
  highlight: "",
  ctaLabel: "Ver propiedades",
  titleEn: "",
  descriptionEn: "",
  highlightEn: "",
  ctaLabelEn: "",
  ctaHref: "/propiedades",
  audience: "b2c",
  scrollThreshold: 480,
  startAt: "",
  endAt: "",
};

const DEFAULT: MarketingConfigFile = {
  stickyReserve: DEFAULT_STICKY,
  announcementBar: DEFAULT_ANNOUNCEMENT,
  scrollPopup: DEFAULT_SCROLL_POPUP,
};

const filePath = () => dataFilePath("marketing-config.json");

export async function readMarketingConfig(): Promise<MarketingConfigFile> {
  const raw = await readJsonFile<MarketingConfigFile>(filePath(), DEFAULT);
  const sticky = raw.stickyReserve ?? DEFAULT_STICKY;
  const bar = raw.announcementBar ?? DEFAULT_ANNOUNCEMENT;
  const popup = raw.scrollPopup ?? DEFAULT_SCROLL_POPUP;

  const threshold = Number(popup.scrollThreshold);
  const scrollThreshold =
    Number.isFinite(threshold) && threshold >= 0 ? Math.round(threshold) : 480;

  return {
    stickyReserve: {
      enabled: sticky.enabled !== false,
      label:
        String(sticky.label ?? DEFAULT_STICKY.label).trim() || DEFAULT_STICKY.label,
      labelEn: String(sticky.labelEn ?? "").trim(),
      href: String(sticky.href ?? DEFAULT_STICKY.href).trim() || DEFAULT_STICKY.href,
    },
    announcementBar: {
      enabled: bar.enabled === true,
      message: String(bar.message ?? "").trim(),
      linkLabel: String(bar.linkLabel ?? "").trim(),
      messageEn: String(bar.messageEn ?? "").trim(),
      linkLabelEn: String(bar.linkLabelEn ?? "").trim(),
      href: String(bar.href ?? "").trim(),
      backgroundColor:
        String(bar.backgroundColor ?? DEFAULT_ANNOUNCEMENT.backgroundColor).trim() ||
        DEFAULT_ANNOUNCEMENT.backgroundColor,
      textColor:
        String(bar.textColor ?? DEFAULT_ANNOUNCEMENT.textColor).trim() ||
        DEFAULT_ANNOUNCEMENT.textColor,
      dismissible: bar.dismissible !== false,
      audience: bar.audience === "all" ? "all" : "b2c",
      startAt: String(bar.startAt ?? "").trim(),
      endAt: String(bar.endAt ?? "").trim(),
    },
    scrollPopup: {
      enabled: popup.enabled === true,
      title: String(popup.title ?? "").trim(),
      description: String(popup.description ?? "").trim(),
      imageUrl: String(popup.imageUrl ?? "").trim(),
      highlight: String(popup.highlight ?? "").trim(),
      ctaLabel:
        String(popup.ctaLabel ?? DEFAULT_SCROLL_POPUP.ctaLabel).trim() ||
        DEFAULT_SCROLL_POPUP.ctaLabel,
      titleEn: String(popup.titleEn ?? "").trim(),
      descriptionEn: String(popup.descriptionEn ?? "").trim(),
      highlightEn: String(popup.highlightEn ?? "").trim(),
      ctaLabelEn: String(popup.ctaLabelEn ?? "").trim(),
      ctaHref:
        String(popup.ctaHref ?? DEFAULT_SCROLL_POPUP.ctaHref).trim() ||
        DEFAULT_SCROLL_POPUP.ctaHref,
      audience: popup.audience === "all" ? "all" : "b2c",
      scrollThreshold,
      startAt: String(popup.startAt ?? "").trim(),
      endAt: String(popup.endAt ?? "").trim(),
    },
  };
}

export async function writeMarketingConfig(data: MarketingConfigFile): Promise<void> {
  await writeJsonFile(filePath(), data);
}
