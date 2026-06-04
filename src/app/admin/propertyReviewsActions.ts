"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  normalizeReviewInput,
  replaceAllPropertyReviews,
} from "@/lib/properties/reviews";
import type { PropertyReviewStored } from "@/lib/properties/reviewsTypes";
import type { ActionResult } from "./actions";

function parseReviewsPayload(raw: string): PropertyReviewStored[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out: PropertyReviewStored[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const normalized = normalizeReviewInput(entry as PropertyReviewStored);
      if (normalized) out.push(normalized);
    }
    return out;
  } catch {
    return null;
  }
}

export async function savePropertyReviews(
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const reviews = parseReviewsPayload(
      String(formData.get("reviews") ?? ""),
    );
    if (reviews === null) {
      return { ok: false, error: "Datos de comentarios inválidos." };
    }

    await replaceAllPropertyReviews(reviews);

    revalidatePath("/propiedades");
    for (const r of reviews) {
      revalidatePath(`/propiedades/${r.propertySlug}`);
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar comentarios",
    };
  }
}
