"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { resolveUploadGuide, validateFileAgainstGuide } from "@/lib/mediaUploadGuide";
import { saveUpload } from "@/lib/upload";
import { getPageDefinition } from "@/lib/pageContent/schemas";
import { readPageContent, writePageContent } from "@/lib/pageContent/storage";
import { setNested } from "@/lib/pageContent/nested";
import { shouldUseRichEditor } from "@/lib/pageContent/richEditor";
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
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar la página",
    };
  }
}
