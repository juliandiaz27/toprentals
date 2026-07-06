import type { PageContent } from "./types";
import { getNested } from "./nested";
import {
  parsePropertyCityFilters,
  type PropertyCityFilterItem,
} from "./propertyCityFilters";
import {
  differentialCardsGridClass,
  type DifferentialCard,
} from "./differentialCards";

export type { PropertyCityFilterItem };

export const DEFAULT_DEVELOPMENT_CARDS: DifferentialCard[] = [
  {
    title: "Top Rentals Maipú",
    text: "90 unidades en el centro de la ciudad. Amenities de primer nivel. Próximamente.",
  },
];

function normalizeDevelopmentCard(raw: unknown): DifferentialCard | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = String(item.title ?? "").trim();
  const text = String(item.text ?? "").trim();
  if (!title && !text) return null;
  return { title, text };
}

function stripHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** Lee `development.cards` o campos legacy `title` / `description`. */
export function parseDevelopmentCards(
  development: Record<string, unknown>,
): DifferentialCard[] {
  const cardsRaw = development.cards;
  if (Array.isArray(cardsRaw) && cardsRaw.length > 0) {
    const cards = cardsRaw
      .map(normalizeDevelopmentCard)
      .filter((c): c is DifferentialCard => c !== null)
      .slice(0, 4);
    if (cards.length > 0) return cards;
  }

  const title = stripHtml(development.title);
  const text = stripHtml(development.description);
  if (title || text) {
    return [
      {
        title: title || DEFAULT_DEVELOPMENT_CARDS[0].title,
        text: text || DEFAULT_DEVELOPMENT_CARDS[0].text,
      },
    ];
  }

  return DEFAULT_DEVELOPMENT_CARDS;
}

export { differentialCardsGridClass };

export type PropiedadesHeroContent = {
  title: string;
  subtitle: string;
};

/** Filtros por ciudad / región en el listado público. */
export type PropiedadesFiltersContent = PropertyCityFilterItem[];

export type PropiedadesDevelopmentContent = {
  label: string;
  cards: DifferentialCard[];
  ctaLabel: string;
  ctaHref: string;
};

export function pickPropiedadesHero(raw: PageContent): PropiedadesHeroContent {
  return {
    title: String(getNested(raw, "hero.title") ?? "Nuestros departamentos"),
    subtitle: String(
      getNested(raw, "hero.subtitle") ??
        "Más de 500 departamentos operados en edificios estratégicamente ubicados.",
    ),
  };
}

export function pickPropiedadesFilters(raw: PageContent): PropiedadesFiltersContent {
  const f = (raw.filters ?? {}) as Record<string, unknown>;
  return parsePropertyCityFilters(f);
}

export function pickPropiedadesDevelopment(
  raw: PageContent,
): PropiedadesDevelopmentContent {
  const d = (raw.development ?? {}) as Record<string, unknown>;
  return {
    label: String(d.label ?? "En desarrollo"),
    cards: parseDevelopmentCards(d),
    ctaLabel: String(d.ctaLabel ?? "Quiero recibir novedades →"),
    ctaHref: String(d.ctaHref ?? "#"),
  };
}
