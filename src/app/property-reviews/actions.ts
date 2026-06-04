"use server";

import { revalidatePath } from "next/cache";
import { appendPropertyReview } from "@/lib/properties/reviews";
import { loadPropertyListings } from "@/lib/properties/catalog";

export type SubmitReviewResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitPropertyReview(
  formData: FormData,
): Promise<SubmitReviewResult> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  const propertySlug = String(formData.get("propertySlug") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();

  if (!propertySlug) {
    return { ok: false, error: "Propiedad no válida." };
  }
  if (authorName.length < 2 || authorName.length > 80) {
    return { ok: false, error: "Indicá tu nombre (2 a 80 caracteres)." };
  }
  if (body.length < 10 || body.length > 2000) {
    return {
      ok: false,
      error: "El comentario debe tener entre 10 y 2000 caracteres.",
    };
  }

  const listings = await loadPropertyListings();
  const property = listings.find(
    (p) => p.slug === propertySlug && !p.comingSoon && !p.hidden,
  );
  if (!property) {
    return { ok: false, error: "Esta propiedad no acepta comentarios." };
  }

  let rating: number | undefined;
  if (ratingRaw) {
    const n = Number(ratingRaw);
    if (n >= 1 && n <= 5) rating = Math.round(n);
  }

  try {
    await appendPropertyReview({
      propertySlug,
      authorName,
      body,
      rating,
      visible: false,
    });

    revalidatePath(`/propiedades/${propertySlug}`);
    revalidatePath("/propiedades");

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo guardar el comentario.",
    };
  }
}
