import type { PageContent } from "./types";
import { DEFAULT_CAREERS_RRHH_EMAIL } from "@/lib/careers/constants";

export type TrabajaWhyItem = { icon: string; title: string; text: string };

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
  spontaneous: {
    title: string;
    subtitle: string;
    attachLabel: string;
    submitLabel: string;
    recipientEmail: string;
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

export function pickTrabajaPage(raw: PageContent): TrabajaPageContent {
  const hero = (raw.hero ?? {}) as Record<string, string>;
  const why = (raw.why ?? {}) as Record<string, unknown>;
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
      ctaLabel: String(hero.ctaLabel ?? "Enviá tu CV ↓"),
      ctaHref: (() => {
        const href = String(hero.ctaHref ?? "#postulacion");
        return href === "#posiciones" ? "#postulacion" : href;
      })(),
    },
    why: {
      title: String(why.title ?? "¿Por qué trabajar en Top Rentals?"),
      items: asWhyItems(why.items, DEFAULT_WHY),
    },
    spontaneous: {
      title: String(spontaneous.title ?? "Dejanos tu CV"),
      subtitle: String(
        spontaneous.subtitle ??
          "Completá el formulario y adjuntá tu currículum. Nuestro equipo de RRHH lo tendrá en cuenta para futuras búsquedas.",
      ),
      attachLabel: String(spontaneous.attachLabel ?? "Adjuntar CV"),
      submitLabel: String(spontaneous.submitLabel ?? "Enviar postulación →"),
      recipientEmail:
        String(spontaneous.recipientEmail ?? DEFAULT_CAREERS_RRHH_EMAIL).trim() ||
        DEFAULT_CAREERS_RRHH_EMAIL,
    },
  };
}
