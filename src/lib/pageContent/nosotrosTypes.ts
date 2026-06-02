import type { PageContent } from "./types";

export type NosotrosStat = { value: string; label: string };

export type NosotrosValueItem = { title: string; text: string };

export type NosotrosPageContent = {
  hero: {
    title: string;
    paragraphs: string[];
    ctaLabel: string;
    ctaHref: string;
    stats: NosotrosStat[];
  };
  history: {
    title: string;
    paragraphs: string[];
    imageSrc: string;
    imageAlt: string;
  };
  values: {
    title: string;
    items: NosotrosValueItem[];
  };
};

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((v) => String(v)).filter(Boolean);
}

function asStats(value: unknown, fallback: NosotrosStat[]): NosotrosStat[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      value: o.value ?? fallback[i]?.value ?? "",
      label: o.label ?? fallback[i]?.label ?? "",
    };
  });
}

function asValueItems(value: unknown, fallback: NosotrosValueItem[]): NosotrosValueItem[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      title: o.title ?? fallback[i]?.title ?? "",
      text: o.text ?? fallback[i]?.text ?? "",
    };
  });
}

const DEFAULT_STATS: NosotrosStat[] = [
  { value: "+500", label: "departamentos operados" },
  { value: "10 torres", label: "Buenos Aires · Quito" },
  { value: "10 años", label: "de trayectoria" },
  { value: "+150", label: "empresas alojadas por año" },
];

const DEFAULT_VALUES: NosotrosValueItem[] = [
  {
    title: "Profesionalismo",
    text: "Estándar consistente en todas las propiedades.",
  },
  {
    title: "Transparencia",
    text: "Precios claros, sin costos ocultos.",
  },
  {
    title: "Hospitalidad",
    text: "Atención humana y cercana 24/7.",
  },
  {
    title: "Innovación",
    text: "Tecnología al servicio del huésped.",
  },
];

const DEFAULT_HERO_PARAS = [
  "Somos el mayor operador de departamentos temporarios de Argentina, con más de 10 años de experiencia en el sector hotelero y de hospitalidad urbana.",
  "Ofrecemos departamentos totalmente equipados con estándar de hotel, en ubicaciones estratégicas de Buenos Aires y Quito.",
];

const DEFAULT_HISTORY_PARAS = [
  "Top Rentals nació en 2016 con la visión de profesionalizar el alquiler temporario en Argentina, llevando el estándar hotelero a departamentos urbanos.",
  "Desde entonces crecimos hasta operar más de 500 unidades en 10 torres, atendiendo viajeros corporativos, relocations y turismo de negocios.",
  "En 2025 seguimos expandiendo nuestra red con nuevos edificios y servicios pensados para estadías cortas, medias y prolongadas.",
];

export function pickNosotrosPage(raw: PageContent): NosotrosPageContent {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const history = (raw.history ?? {}) as Record<string, unknown>;
  const values = (raw.values ?? {}) as Record<string, unknown>;

  const body = (raw.body ?? {}) as Record<string, unknown>;
  const heroParas = hero.paragraphs ?? body.intro;
  const historyParas = history.paragraphs ?? body.column1;

  return {
    hero: {
      title: String(hero.title ?? "Quiénes somos"),
      paragraphs: Array.isArray(heroParas)
        ? asStringArray(heroParas, DEFAULT_HERO_PARAS)
        : heroParas
          ? [String(heroParas)]
          : DEFAULT_HERO_PARAS,
      ctaLabel: String(hero.ctaLabel ?? "Ver propiedades →"),
      ctaHref: String(hero.ctaHref ?? "/propiedades"),
      stats: asStats(hero.stats, DEFAULT_STATS),
    },
    history: {
      title: String(history.title ?? "Nuestra historia"),
      paragraphs: Array.isArray(historyParas)
        ? asStringArray(historyParas, DEFAULT_HISTORY_PARAS)
        : typeof historyParas === "string" && historyParas
          ? [historyParas]
          : DEFAULT_HISTORY_PARAS,
      imageSrc: String(
        history.imageSrc ??
          hero.imageSrc ??
          "/images/corporate/corporate-teaser.png",
      ),
      imageAlt: String(history.imageAlt ?? "Equipo Top Rentals"),
    },
    values: {
      title: String(values.title ?? "Nuestros valores"),
      items: asValueItems(values.items, DEFAULT_VALUES),
    },
  };
}
