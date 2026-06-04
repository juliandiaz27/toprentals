import type { DifferentialCard } from "./differentialCards";
import {
  DEFAULT_DIFFERENTIAL_CARDS,
  DIFFERENTIALS_MAX,
  DIFFERENTIALS_MIN,
} from "./differentialCards";

export function parseCardListFormValue(
  raw: string,
  min: number,
  max: number,
): { ok: true; cards: DifferentialCard[] } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, error: "Formato de tarjetas inválido." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Las tarjetas deben ser una lista." };
  }

  const cards: DifferentialCard[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? "").trim();
    const text = String(row.text ?? "").trim();
    if (!title && !text) continue;
    cards.push({ title, text });
  }

  if (cards.length < min) {
    return {
      ok: false,
      error: `Agregá al menos ${min} diferencial${min === 1 ? "" : "es"} con título o texto.`,
    };
  }

  if (cards.length > max) {
    return { ok: false, error: `Máximo ${max} diferenciales.` };
  }

  return { ok: true, cards };
}

export function cardListFieldBounds(field: {
  listMin?: number;
  listMax?: number;
}): { min: number; max: number } {
  const min = field.listMin ?? DIFFERENTIALS_MIN;
  const max = field.listMax ?? DIFFERENTIALS_MAX;
  return { min: Math.max(1, min), max: Math.max(min, max) };
}

export const DIFFERENTIALS_CARD_LIST_DEFAULTS = DEFAULT_DIFFERENTIAL_CARDS;
