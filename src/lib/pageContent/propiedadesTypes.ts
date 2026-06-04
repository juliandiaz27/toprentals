import type { PageContent } from "./types";
import { getNested } from "./nested";

export type PropiedadesHeroContent = {
  title: string;
  subtitle: string;
};

export type PropiedadesFiltersContent = {
  buenosAires: string;
  ecuador: string;
};

export type PropiedadesDevelopmentContent = {
  label: string;
  title: string;
  description: string;
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
  const f = (raw.filters ?? {}) as Record<string, string>;
  return {
    buenosAires: f.buenosAires ?? "Buenos Aires",
    ecuador: f.ecuador ?? "Ecuador",
  };
}

export function pickPropiedadesDevelopment(
  raw: PageContent,
): PropiedadesDevelopmentContent {
  const d = (raw.development ?? {}) as Record<string, string>;
  return {
    label: d.label ?? "En desarrollo",
    title: d.title ?? "Top Rentals Maipú",
    description:
      d.description ??
      "90 unidades en el centro de la ciudad. Amenities de primer nivel. Próximamente.",
    ctaLabel: d.ctaLabel ?? "Registrarme para recibir novedades →",
    ctaHref: d.ctaHref ?? "#",
  };
}
