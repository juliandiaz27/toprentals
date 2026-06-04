import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type { AnnouncementBarConfig, MarketingConfigFile, StickyReserveConfig } from "./types";

const DEFAULT_STICKY: StickyReserveConfig = {
  enabled: true,
  label: "Reservar ahora",
  href: "/reservas",
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBarConfig = {
  enabled: false,
  message: "",
  linkLabel: "",
  href: "",
  backgroundColor: "#111111",
  textColor: "#ffffff",
  dismissible: true,
  audience: "b2c",
  startAt: "",
  endAt: "",
};

const DEFAULT: MarketingConfigFile = {
  stickyReserve: DEFAULT_STICKY,
  announcementBar: DEFAULT_ANNOUNCEMENT,
};

const filePath = () => dataFilePath("marketing-config.json");

export async function readMarketingConfig(): Promise<MarketingConfigFile> {
  const raw = await readJsonFile<MarketingConfigFile>(filePath(), DEFAULT);
  const sticky = raw.stickyReserve ?? DEFAULT_STICKY;
  const bar = raw.announcementBar ?? DEFAULT_ANNOUNCEMENT;

  return {
    stickyReserve: {
      enabled: sticky.enabled !== false,
      label: String(sticky.label ?? DEFAULT_STICKY.label).trim() || DEFAULT_STICKY.label,
      href: String(sticky.href ?? DEFAULT_STICKY.href).trim() || DEFAULT_STICKY.href,
    },
    announcementBar: {
      enabled: bar.enabled === true,
      message: String(bar.message ?? "").trim(),
      linkLabel: String(bar.linkLabel ?? "").trim(),
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
  };
}

export async function writeMarketingConfig(data: MarketingConfigFile): Promise<void> {
  await writeJsonFile(filePath(), data);
}
