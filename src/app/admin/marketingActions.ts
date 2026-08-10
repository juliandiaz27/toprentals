"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { writeMarketingConfig } from "@/lib/marketing/storage";
import {
  resolveRoutePickerValue,
  STICKY_RESERVE_HREF,
} from "@/lib/pageContent/siteRoutes";
import type {
  AnnouncementBarConfig,
  MarketingConfigFile,
  ScrollPopupConfig,
  StickyReserveConfig,
} from "@/lib/marketing/types";
import type { ActionResult } from "./actions";

function parseSticky(formData: FormData): StickyReserveConfig {
  return {
    enabled: formData.get("sticky.enabled") === "on",
    label: String(formData.get("sticky.label") ?? "").trim() || "Reservar ahora",
    labelEn: String(formData.get("sticky.labelEn") ?? "").trim(),
    href: STICKY_RESERVE_HREF,
  };
}

function parseAnnouncement(formData: FormData): AnnouncementBarConfig {
  const audience = formData.get("announcement.audience");
  return {
    enabled: formData.get("announcement.enabled") === "on",
    message: String(formData.get("announcement.message") ?? "").trim(),
    linkLabel: String(formData.get("announcement.linkLabel") ?? "").trim(),
    messageEn: String(formData.get("announcement.messageEn") ?? "").trim(),
    linkLabelEn: String(formData.get("announcement.linkLabelEn") ?? "").trim(),
    href: resolveRoutePickerValue(
      String(formData.get("announcement.href") ?? ""),
      "menu",
      "/reservas",
    ),
    backgroundColor:
      String(formData.get("announcement.backgroundColor") ?? "").trim() ||
      "#111111",
    textColor:
      String(formData.get("announcement.textColor") ?? "").trim() || "#ffffff",
    dismissible: formData.get("announcement.dismissible") === "on",
    audience: audience === "all" ? "all" : "b2c",
    startAt: String(formData.get("announcement.startAt") ?? "").trim(),
    endAt: String(formData.get("announcement.endAt") ?? "").trim(),
  };
}

function parseScrollPopup(formData: FormData): ScrollPopupConfig {
  const audience = formData.get("popup.audience");
  const thresholdRaw = Number(formData.get("popup.scrollThreshold"));
  const scrollThreshold =
    Number.isFinite(thresholdRaw) && thresholdRaw >= 0
      ? Math.round(thresholdRaw)
      : 480;

  return {
    enabled: formData.get("popup.enabled") === "on",
    title: String(formData.get("popup.title") ?? "").trim(),
    description: String(formData.get("popup.description") ?? "").trim(),
    imageUrl: String(formData.get("popup.imageUrl") ?? "").trim(),
    highlight: String(formData.get("popup.highlight") ?? "").trim(),
    ctaLabel:
      String(formData.get("popup.ctaLabel") ?? "").trim() || "Ver propiedades",
    titleEn: String(formData.get("popup.titleEn") ?? "").trim(),
    descriptionEn: String(formData.get("popup.descriptionEn") ?? "").trim(),
    highlightEn: String(formData.get("popup.highlightEn") ?? "").trim(),
    ctaLabelEn: String(formData.get("popup.ctaLabelEn") ?? "").trim(),
    ctaHref: resolveRoutePickerValue(
      String(formData.get("popup.ctaHref") ?? ""),
      "menu",
      "/propiedades",
    ),
    audience: audience === "all" ? "all" : "b2c",
    scrollThreshold,
    startAt: String(formData.get("popup.startAt") ?? "").trim(),
    endAt: String(formData.get("popup.endAt") ?? "").trim(),
  };
}

export async function saveMarketingConfig(
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const data: MarketingConfigFile = {
      stickyReserve: parseSticky(formData),
      announcementBar: parseAnnouncement(formData),
      scrollPopup: parseScrollPopup(formData),
    };

    await writeMarketingConfig(data);

    revalidatePath("/", "layout");

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar marketing",
    };
  }
}
