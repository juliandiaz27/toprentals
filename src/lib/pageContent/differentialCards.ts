export type DifferentialCard = {
  title: string;
  text: string;
};

export const DEFAULT_DIFFERENTIAL_CARDS: DifferentialCard[] = [
  {
    title: "Limpieza profesional",
    text: "Estándares de hotel en cada departamento",
  },
  {
    title: "Propuesta estandarizada",
    text: "Calidad consistente en cada propiedad",
  },
  {
    title: "Ubicaciones estratégicas",
    text: "Edificios completos en zonas clave",
  },
];

export const DIFFERENTIALS_MIN = 1;
export const DIFFERENTIALS_MAX = 4;

function normalizeCard(raw: unknown): DifferentialCard | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = String(item.title ?? "").trim();
  const text = String(item.text ?? "").trim();
  if (!title && !text) return null;
  return { title, text };
}

/** Lee `differentials.cards` o campos legacy card1…card4. */
export function parseDifferentialCards(
  differentials: Record<string, unknown>,
): DifferentialCard[] {
  const cardsRaw = differentials.cards;
  if (Array.isArray(cardsRaw) && cardsRaw.length > 0) {
    const cards = cardsRaw
      .map(normalizeCard)
      .filter((c): c is DifferentialCard => c !== null)
      .slice(0, DIFFERENTIALS_MAX);
    if (cards.length > 0) return cards;
  }

  const legacy: DifferentialCard[] = [];
  for (let i = 1; i <= DIFFERENTIALS_MAX; i++) {
    const title = String(differentials[`card${i}Title`] ?? "").trim();
    const text = String(differentials[`card${i}Text`] ?? "").trim();
    if (title || text) legacy.push({ title, text });
  }
  if (legacy.length > 0) return legacy;

  return DEFAULT_DIFFERENTIAL_CARDS;
}

export function differentialCardsGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "sm:grid-cols-2";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}
