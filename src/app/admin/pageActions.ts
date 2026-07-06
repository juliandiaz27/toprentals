"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { resolveUploadGuide, validateFileAgainstGuide } from "@/lib/mediaUploadGuide";
import { saveUpload } from "@/lib/upload";
import { getPageDefinition } from "@/lib/pageContent/schemas";
import { readPageContent, writePageContent } from "@/lib/pageContent/storage";
import { setNested } from "@/lib/pageContent/nested";
import { shouldUseRichEditor } from "@/lib/pageContent/richEditor";
import {
  cardListFieldBounds,
  parseCardListFormValue,
} from "@/lib/pageContent/cardListField";
import {
  parseCityFiltersFormValue,
  PROPERTY_CITY_FILTERS_MAX,
  PROPERTY_CITY_FILTERS_MIN,
} from "@/lib/pageContent/propertyCityFilters";
import { resolveAdminFieldValue } from "@/lib/pageContent/pageFieldValue";
import { normalizeStoredRichHtml } from "@/lib/richText/sanitize";
import type { ActionResult } from "./actions";

export async function savePageContent(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const def = getPageDefinition(slug);
    if (!def) return { ok: false, error: "Página no encontrada" };

    const content = await readPageContent(slug);

    for (const field of def.fields) {
      if (field.type === "cityFilterList") {
        const parsed = parseCityFiltersFormValue(
          String(formData.get(field.key) ?? "[]"),
          field.listMin ?? PROPERTY_CITY_FILTERS_MIN,
          field.listMax ?? PROPERTY_CITY_FILTERS_MAX,
        );
        if (!parsed.ok) {
          return { ok: false, error: `${field.label}: ${parsed.error}` };
        }
        setNested(content, field.key, parsed.items);
        if (field.key === "filters.items") {
          const filters = (content.filters ?? {}) as Record<string, unknown>;
          delete filters.buenosAires;
          delete filters.ecuador;
          content.filters = filters;
        }
        continue;
      }

      if (field.type === "cardList") {
        const { min, max } = cardListFieldBounds(field);
        const parsed = parseCardListFormValue(
          String(formData.get(field.key) ?? "[]"),
          min,
          max,
        );
        if (!parsed.ok) {
          return { ok: false, error: `${field.label}: ${parsed.error}` };
        }
        setNested(content, field.key, parsed.cards);
        if (field.key === "differentials.cards") {
          const diff = (content.differentials ?? {}) as Record<string, unknown>;
          for (let i = 1; i <= 4; i++) {
            delete diff[`card${i}Title`];
            delete diff[`card${i}Text`];
          }
          content.differentials = diff;
        }
        if (field.key === "howItWorks.steps") {
          const section = (content.howItWorks ?? {}) as Record<string, unknown>;
          for (let i = 1; i <= 4; i++) {
            delete section[`step${i}Title`];
            delete section[`step${i}Text`];
          }
          content.howItWorks = section;
        }
        if (field.key === "development.cards") {
          const dev = (content.development ?? {}) as Record<string, unknown>;
          delete dev.title;
          delete dev.description;
          content.development = dev;
        }
        continue;
      }

      if (field.type === "image" || field.type === "video") {
        const current = String(formData.get(field.key) ?? "").trim();
        const file = formData.get(`__file__${field.key}`);
        if (file instanceof File && file.size > 0) {
          const guide = resolveUploadGuide(field);
          const sizeError = validateFileAgainstGuide(file, guide);
          if (sizeError) {
            return { ok: false, error: `${field.label}: ${sizeError}` };
          }
          const url = await saveUpload(
            file,
            `page-${slug}-${field.key.replace(/\./g, "-")}`,
            { maxSizeMb: guide?.maxSizeMb },
          );
          setNested(content, field.key, url);
        } else if (current) {
          setNested(content, field.key, current);
        }
        continue;
      }

      if (field.type === "boolean") {
        setNested(
          content,
          field.key,
          formData.get(field.key) === "on" || formData.get(field.key) === "true",
        );
        continue;
      }

      let value = resolveAdminFieldValue(
        field,
        String(formData.get(field.key) ?? ""),
        slug,
      );
      if (shouldUseRichEditor(field)) {
        value = normalizeStoredRichHtml(value);
      }
      const isEmpty =
        !value ||
        (shouldUseRichEditor(field) &&
          !value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim());
      if (field.required && isEmpty) {
        return { ok: false, error: `"${field.label}" es obligatorio.` };
      }
      setNested(content, field.key, value);
    }

    await writePageContent(slug, content);
    revalidatePath(def.publicPath);
    if (slug === "propiedades") {
      revalidatePath("/admin/propiedades");
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar la página",
    };
  }
}
