import type { PageContent } from "./types";

export type TrabajaWhyItem = { icon: string; title: string; text: string };

export type TrabajaPosition = {
  title: string;
  location: string;
  type: string;
  applyHref: string;
};

export type TrabajaPageContent = {
  hero: {
    title: string;
    subtitle: string;
    metaLine: string;
    ctaLabel: string;
    ctaHref: string;
  };
  why: {
    title: string;
    items: TrabajaWhyItem[];
  };
  positions: {
    title: string;
    applyLabel: string;
    items: TrabajaPosition[];
  };
  spontaneous: {
    title: string;
    subtitle: string;
    attachLabel: string;
    submitLabel: string;
  };
};

const DEFAULT_WHY: TrabajaWhyItem[] = [
  {
    icon: "🏢",
    title: "Empresa en crecimiento",
    text: "Presente en 2 países y expandiéndose",
  },
  {
    icon: "🤝",
    title: "Cultura colaborativa",
    text: "Equipo joven, diverso y apasionado",
  },
  {
    icon: "📈",
    title: "Desarrollo profesional",
    text: "Capacitación y crecimiento real",
  },
  {
    icon: "💼",
    title: "Entorno dinámico",
    text: "Ritmo ágil y desafíos constantes",
  },
];

const DEFAULT_POSITIONS: TrabajaPosition[] = [
  {
    title: "Recepcionista / Anfitrión de edificio",
    location: "Buenos Aires",
    type: "Full-time",
    applyHref: "mailto:rrhh@toprentals.com.ar",
  },
  {
    title: "Asistente administrativo",
    location: "Buenos Aires",
    type: "Full-time",
    applyHref: "mailto:rrhh@toprentals.com.ar",
  },
  {
    title: "Encargado de limpieza",
    location: "Buenos Aires",
    type: "Full-time",
    applyHref: "mailto:rrhh@toprentals.com.ar",
  },
  {
    title: "Recepcionista",
    location: "Quito",
    type: "Full-time",
    applyHref: "mailto:rrhh@toprentals.com.ar",
  },
  {
    title: "Housekeeping",
    location: "Quito",
    type: "Part-time",
    applyHref: "mailto:rrhh@toprentals.com.ar",
  },
];

function asWhyItems(value: unknown, fallback: TrabajaWhyItem[]): TrabajaWhyItem[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      icon: o.icon ?? fallback[i]?.icon ?? "•",
      title: o.title ?? fallback[i]?.title ?? "",
      text: o.text ?? fallback[i]?.text ?? "",
    };
  });
}

function asPositions(value: unknown, fallback: TrabajaPosition[]): TrabajaPosition[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      title: o.title ?? fallback[i]?.title ?? "",
      location: o.location ?? fallback[i]?.location ?? "",
      type: o.type ?? fallback[i]?.type ?? "",
      applyHref: o.applyHref ?? fallback[i]?.applyHref ?? "mailto:rrhh@toprentals.com.ar",
    };
  });
}

export function pickTrabajaPage(raw: PageContent): TrabajaPageContent {
  const hero = (raw.hero ?? {}) as Record<string, string>;
  const why = (raw.why ?? {}) as Record<string, unknown>;
  const positions = (raw.positions ?? {}) as Record<string, unknown>;
  const spontaneous = (raw.spontaneous ?? {}) as Record<string, string>;

  return {
    hero: {
      title: String(hero.title ?? "Trabajá con nosotros"),
      subtitle: String(
        hero.subtitle ??
          "Somos un equipo apasionado por la hospitalidad y la innovación.",
      ),
      metaLine: String(
        hero.metaLine ?? "Buenos Aires · Quito · Tiempo completo y part-time",
      ),
      ctaLabel: String(hero.ctaLabel ?? "Ver posiciones abiertas ↓"),
      ctaHref: String(hero.ctaHref ?? "#posiciones"),
    },
    why: {
      title: String(why.title ?? "¿Por qué trabajar en Top Rentals?"),
      items: asWhyItems(why.items, DEFAULT_WHY),
    },
    positions: {
      title: String(positions.title ?? "Posiciones abiertas"),
      applyLabel: String(positions.applyLabel ?? "Postularme →"),
      items: asPositions(positions.items, DEFAULT_POSITIONS),
    },
    spontaneous: {
      title: String(spontaneous.title ?? "¿No encontrás tu posición?"),
      subtitle: String(
        spontaneous.subtitle ??
          "Envianos tu CV y te tendremos en cuenta para futuras posiciones.",
      ),
      attachLabel: String(spontaneous.attachLabel ?? "Adjuntar CV"),
      submitLabel: String(spontaneous.submitLabel ?? "Enviar postulación →"),
    },
  };
}
