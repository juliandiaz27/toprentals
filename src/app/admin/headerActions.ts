"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  MEDIA_UPLOAD_GUIDES,
  validateFileAgainstGuide,
} from "@/lib/mediaUploadGuide";
import { saveUpload } from "@/lib/upload";
import {
  HEADER_NAV_CATALOG,
  type HeaderNavStored,
  headerNavItemById,
} from "@/lib/pageContent/headerNav";
import { readPageContent, writePageContent } from "@/lib/pageContent/storage";
import type { ActionResult } from "./actions";

const LEGACY_LINK_KEYS = [
  "link1Label",
  "link1Href",
  "link2Label",
  "link2Href",
  "link3Label",
  "link3Href",
  "link4Label",
  "link4Href",
  "link5Label",
  "link5Href",
  "ctaHref",
] as const;

function parseNavPayload(raw: string): HeaderNavStored[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;

    const items: HeaderNavStored[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const id = String(row.id ?? "").trim();
      const catalog = headerNavItemById(id);
      if (!catalog) continue;

      items.push({
        id: catalog.id,
        label:
          String(row.label ?? catalog.defaultLabel).trim() || catalog.defaultLabel,
        visible: row.visible === true || row.visible === "true",
      });
    }

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export async function saveHeaderContent(formData: FormData): Promise<ActionResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const navRaw = String(formData.get("header.nav") ?? "");
    const nav = parseNavPayload(navRaw);
    if (!nav) {
      return { ok: false, error: "Menú inválido. Recargá la página e intentá de nuevo." };
    }

    const knownIds = new Set(HEADER_NAV_CATALOG.map((item) => item.id));
    for (const item of nav) {
      if (!knownIds.has(item.id)) {
        return { ok: false, error: "Hay ítems de menú no permitidos." };
      }
    }

    const logoText = String(formData.get("header.logoText") ?? "").trim();
    if (!logoText) {
      return { ok: false, error: "El texto alternativo del logo es obligatorio." };
    }

    const ctaLabel = String(formData.get("header.ctaLabel") ?? "").trim();
    if (!ctaLabel) {
      return { ok: false, error: "El texto del botón de reserva es obligatorio." };
    }

    const content = await readPageContent("home-header");
    const header = (content.header ?? {}) as Record<string, unknown>;

    let logoSrc = String(formData.get("header.logoSrc") ?? "").trim();
    const logoFile = formData.get("__file__header.logoSrc");
    if (logoFile instanceof File && logoFile.size > 0) {
      const guide = MEDIA_UPLOAD_GUIDES.siteLogo;
      const sizeError = validateFileAgainstGuide(logoFile, guide);
      if (sizeError) {
        return { ok: false, error: `Logo: ${sizeError}` };
      }
      logoSrc = await saveUpload(logoFile, "header-logo", {
        maxSizeMb: guide.maxSizeMb,
      });
    }

    const nextHeader: Record<string, unknown> = {
      logoSrc,
      logoText,
      ctaLabel,
      nav,
    };

    for (const key of LEGACY_LINK_KEYS) {
      delete header[key];
    }

    content.header = { ...header, ...nextHeader };

    await writePageContent("home-header", content);
    revalidatePath("/");
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar el header",
    };
  }
}
