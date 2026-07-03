import type { PageContent } from "./types";

export type PropietariosTextBlock = { title: string; text: string };

export type PropietariosHeroContent = {
  title: string;
  subtitle: string;
};

export type PropietariosBenefitsContent = {
  title: string;
  leftColumn: string[];
  rightColumn: string[];
};

export type PropietariosProtectedRentContent = {
  title: string;
  text: string;
};

export type PropietariosHowItWorksContent = {
  title: string;
  steps: PropietariosTextBlock[];
};

export type PropietariosEquipmentContent = {
  title: string;
  items: PropietariosTextBlock[];
};

export type PropietariosExperienceContent = {
  title: string;
  items: PropietariosTextBlock[];
};

export type PropietariosFinalCtaContent = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
};

export type PropietariosPageContent = {
  hero: PropietariosHeroContent;
  benefits: PropietariosBenefitsContent;
  protectedRent: PropietariosProtectedRentContent;
  howItWorks: PropietariosHowItWorksContent;
  equipment: PropietariosEquipmentContent;
  experience: PropietariosExperienceContent;
  finalCta: PropietariosFinalCtaContent;
};

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((v) => String(v).trim()).filter(Boolean);
}

function asBlocks(
  value: unknown,
  fallback: PropietariosTextBlock[],
): PropietariosTextBlock[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      title: String(o.title ?? fallback[i]?.title ?? "").trim(),
      text: String(o.text ?? fallback[i]?.text ?? "").trim(),
    };
  });
}

const DEFAULT_BENEFITS_LEFT = [
  "Comercialización y gestión de reservas",
  "Atención al huésped 24/7",
  "Limpieza y mantenimiento profesional",
  "Optimización de renta",
  "Pago de expensas y servicios",
];

const DEFAULT_BENEFITS_RIGHT = [
  "Control operativo y estándares de calidad",
  "Reportes diarios y seguimiento de performance",
  "Relación directa con la administración del edificio",
  "Cuidado de la unidad y espacios comunes",
  "Modelo profit share",
];

const DEFAULT_STEPS: PropietariosTextBlock[] = [
  {
    title: "Definición del modelo",
    text: "Alineamos expectativas, reglas de operación y estándares de servicio.",
  },
  {
    title: "Puesta en marcha",
    text: "Implementamos equipamiento, canales de comercialización y procesos operativos.",
  },
  {
    title: "Operación diaria",
    text: "Gestionamos reservas, check-ins, limpieza y mantenimiento de la unidad.",
  },
  {
    title: "Seguimiento y control",
    text: "Revisamos la performance de la unidad con reportes transparentes y periódicos.",
  },
];

const DEFAULT_EQUIPMENT: PropietariosTextBlock[] = [
  {
    title: "Mobiliario",
    text: "Selección funcional y estética acorde al estándar Top Rentals.",
  },
  {
    title: "Equipamiento electrónico",
    text: "Electrodomésticos y tecnología listos para operar desde el primer día.",
  },
  {
    title: "Decoración y textiles",
    text: "Detalles de ambientación, ropa blanca y acabados de calidad hotelera.",
  },
];

const DEFAULT_EXPERIENCE: PropietariosTextBlock[] = [
  {
    title: "Convivencia ordenada",
    text: "Operación pensada para el día a día de edificios residenciales de alto nivel.",
  },
  {
    title: "Operación estructurada",
    text: "Procesos claros, equipos dedicados y respuesta ágil ante cada necesidad.",
  },
  {
    title: "Cuidado del edificio",
    text: "Respeto por las normas de convivencia y los espacios comunes.",
  },
  {
    title: "Previsibilidad para el propietario",
    text: "Información clara, seguimiento constante y foco en resultados.",
  },
];

export function pickPropietariosPage(raw: PageContent): PropietariosPageContent {
  const hero = (raw.hero ?? {}) as Record<string, string>;
  const benefits = (raw.benefits ?? {}) as Record<string, unknown>;
  const protectedRent = (raw.protectedRent ?? {}) as Record<string, string>;
  const howItWorks = (raw.howItWorks ?? {}) as Record<string, unknown>;
  const equipment = (raw.equipment ?? {}) as Record<string, unknown>;
  const experience = (raw.experience ?? {}) as Record<string, unknown>;
  const finalCta = (raw.finalCta ?? {}) as Record<string, string>;

  return {
    hero: {
      title:
        String(hero.title ?? "").trim() ||
        "<p>Operación profesional que <span class=\"propietarios-hero-accent\">maximiza la renta</span></p>",
      subtitle: String(
        hero.subtitle ??
          "Más de 10 años gestionando departamentos en torres seleccionadas con estándares hoteleros, procesos claros y foco en resultados para propietarios.",
      ),
    },
    benefits: {
      title: String(benefits.title ?? "Beneficios para propietarios"),
      leftColumn: asStringArray(benefits.leftColumn, DEFAULT_BENEFITS_LEFT),
      rightColumn: asStringArray(benefits.rightColumn, DEFAULT_BENEFITS_RIGHT),
    },
    protectedRent: {
      title: String(protectedRent.title ?? "Sistema de renta protegida"),
      text: String(
        protectedRent.text ??
          "Nuestro modelo se basa en transparencia y resultados compartidos. Operamos con un esquema profit share que alinea nuestro desempeño con la rentabilidad de tu unidad.",
      ),
    },
    howItWorks: {
      title: String(howItWorks.title ?? "Cómo trabajamos"),
      steps: asBlocks(howItWorks.steps, DEFAULT_STEPS),
    },
    equipment: {
      title: String(equipment.title ?? "Equipamiento y diseño de las unidades"),
      items: asBlocks(equipment.items, DEFAULT_EQUIPMENT),
    },
    experience: {
      title: String(experience.title ?? "Experiencia en torres residenciales"),
      items: asBlocks(experience.items, DEFAULT_EXPERIENCE),
    },
    finalCta: {
      title: String(finalCta.title ?? "¿Sos propietario y querés saber más?"),
      ctaLabel: String(finalCta.ctaLabel ?? "Contactar a Top Rentals +"),
      ctaHref: String(finalCta.ctaHref ?? "/contacto").trim() || "/contacto",
    },
  };
}
