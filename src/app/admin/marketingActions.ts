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
  StickyReserveConfig,
} from "@/lib/marketing/types";
import type { ActionResult } from "./actions";

function parseSticky(formData: FormData): StickyReserveConfig {
  return {
    enabled: formData.get("sticky.enabled") === "on",
    label: String(formData.get("sticky.label") ?? "").trim() || "Reservar ahora",
    href: STICKY_RESERVE_HREF,
  };
}

function parseAnnouncement(formData: FormData): AnnouncementBarConfig {
  const audience = formData.get("announcement.audience");
  return {
    enabled: formData.get("announcement.enabled") === "on",
    message: String(formData.get("announcement.message") ?? "").trim(),
    linkLabel: String(formData.get("announcement.linkLabel") ?? "").trim(),
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
