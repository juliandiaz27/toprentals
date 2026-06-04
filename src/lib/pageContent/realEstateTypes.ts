import type { PageContent } from "./types";

export type RealEstateHeroContent = {
  title: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export type RealEstateCopySection = {
  title: string;
  paragraphs: string[];
};

export type RealEstateOperationDiffContent = {
  title: string;
  items: string[];
  closing: string;
};

export type RealEstateStatItem = {
  value: string;
  label: string;
};

export type RealEstateProvenContent = {
  title: string;
  intro: string;
  stats: RealEstateStatItem[];
};

export type RealEstateProjectBadgeVariant = "obra" | "emblematic" | "neutral";

export type RealEstateProject = {
  id: string;
  name: string;
  address: string;
  barrio: string;
  units: string;
  typologies: string;
  role: string;
  differentials: string;
  badge: string;
  badgeVariant: RealEstateProjectBadgeVariant;
  imageSrc: string;
  brochureLabel: string;
  brochureHref: string;
};

export type RealEstateCommercializationContent = {
  title: string;
  intro: string;
  items: string[];
  closing: string;
};

export type RealEstateStep = {
  title: string;
  text: string;
};

export type RealEstateIntegratedModelContent = {
  title: string;
  steps: RealEstateStep[];
};

export type RealEstateFinalCtaContent = {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type RealEstatePageContent = {
  hero: RealEstateHeroContent;
  development: RealEstateCopySection;
  rentIncluded: RealEstateCopySection;
  operationDiff: RealEstateOperationDiffContent;
  proven: RealEstateProvenContent;
  opportunitiesTitle: string;
  opportunitiesSubtitle: string;
  opportunitiesClosing: string;
  projects: RealEstateProject[];
  commercialization: RealEstateCommercializationContent;
  integratedModel: RealEstateIntegratedModelContent;
  finalCta: RealEstateFinalCtaContent;
};

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const out = value.map((v) => String(v).trim()).filter(Boolean);
  return out.length ? out : fallback;
}

function asParagraphs(value: unknown, fallback: string[]): string[] {
  if (typeof value === "string" && value.trim()) {
    return value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }
  return asStringArray(value, fallback);
}

function normalizeProject(row: Record<string, unknown>, def: RealEstateProject): RealEstateProject {
  const variant = String(row.badgeVariant ?? def.badgeVariant);
  const badgeVariant: RealEstateProjectBadgeVariant =
    variant === "obra" || variant === "emblematic" ? variant : "neutral";

  const address =
    String(row.address ?? row.location ?? def.address).trim() || def.address;

  return {
    id: String(row.id ?? def.id).trim() || def.id,
    name: String(row.name ?? def.name).trim() || def.name,
    address,
    barrio: String(row.barrio ?? def.barrio).trim(),
    units: String(row.units ?? def.units).trim(),
    typologies: String(row.typologies ?? def.typologies).trim(),
    role: String(row.role ?? def.role).trim(),
    differentials: String(row.differentials ?? def.differentials).trim(),
    badge: String(row.badge ?? def.badge).trim(),
    badgeVariant,
    imageSrc:
      String(row.imageSrc ?? def.imageSrc).trim() ||
      "/images/placeholders/page-hero.svg",
    brochureLabel: String(row.brochureLabel ?? def.brochureLabel).trim(),
    brochureHref: String(row.brochureHref ?? def.brochureHref).trim(),
  };
}

const DEFAULT_PROJECTS: RealEstateProject[] = [
  {
    id: "canitas",
    name: "Top Rentals Cañitas",
    address: "Soldado de la Independencia & Teodoro García",
    barrio: "Belgrano - zona residencial de lujo",
    units: "55 departamentos",
    typologies: "Monoambientes · 2 amb. · 3 amb. · Penthouses",
    role: "",
    differentials: "",
    badge: "EN OBRA",
    badgeVariant: "obra",
    imageSrc: "/images/placeholders/page-hero.svg",
    brochureLabel: "DESCARGAR BROCHURE",
    brochureHref: "#",
  },
  {
    id: "maipu",
    name: "Top Rentals Maipú",
    address: "Centro de la ciudad",
    barrio: "",
    units: "90 departamentos",
    typologies: "",
    role: "Mother home de Top Rentals",
    differentials:
      "Amenities innovadores · Espacios corporativos · Diseño integral",
    badge: "EMBLEMÁTICO",
    badgeVariant: "emblematic",
    imageSrc: "/images/placeholders/page-hero.svg",
    brochureLabel: "",
    brochureHref: "",
  },
];

export function pickRealEstatePage(raw: PageContent): RealEstatePageContent {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const development = (raw.development ?? {}) as Record<string, unknown>;
  const rentIncluded = (raw.rentIncluded ?? {}) as Record<string, unknown>;
  const operationDiff = (raw.operationDiff ?? {}) as Record<string, unknown>;
  const proven = (raw.proven ?? {}) as Record<string, unknown>;
  const commercialization = (raw.commercialization ?? {}) as Record<string, unknown>;
  const integratedModel = (raw.integratedModel ?? {}) as Record<string, unknown>;
  const finalCta = (raw.finalCta ?? {}) as Record<string, unknown>;

  const projectsRaw = raw.projects;
  let projects = DEFAULT_PROJECTS;
  if (Array.isArray(projectsRaw) && projectsRaw.length > 0) {
    projects = projectsRaw.map((p, i) => {
      const row = (p ?? {}) as Record<string, unknown>;
      const def = DEFAULT_PROJECTS[i] ?? DEFAULT_PROJECTS[0]!;
      return normalizeProject(row, def);
    });
  }

  const statsRaw = proven.stats;
  const defaultStats: RealEstateStatItem[] = [
    { value: "+500", label: "Departamentos en operación" },
    { value: "10", label: "Edificios" },
    { value: "+100", label: "Personas en el equipo" },
    { value: "BA + EC", label: "Mercados activos" },
  ];
  let stats = defaultStats;
  if (Array.isArray(statsRaw) && statsRaw.length > 0) {
    stats = statsRaw.map((s, i) => {
      const row = (s ?? {}) as Record<string, unknown>;
      const def = defaultStats[i] ?? defaultStats[0]!;
      return {
        value: String(row.value ?? def.value).trim() || def.value,
        label: String(row.label ?? def.label).trim() || def.label,
      };
    });
  }

  const stepsRaw = integratedModel.steps;
  const defaultSteps: RealEstateStep[] = [
    { title: "Desarrollo", text: "Diseño arquitectónico pensado para la operación." },
    { title: "Comercialización", text: "Venta de unidades con lógica de renta." },
    {
      title: "Equipamiento",
      text: "Definición y puesta en marcha bajo estándares Top Rentals.",
    },
    { title: "Operación", text: "Gestión diaria, huéspedes y performance." },
  ];
  let steps = defaultSteps;
  if (Array.isArray(stepsRaw) && stepsRaw.length > 0) {
    steps = stepsRaw.map((s, i) => {
      const row = (s ?? {}) as Record<string, unknown>;
      const def = defaultSteps[i] ?? defaultSteps[0]!;
      return {
        title: String(row.title ?? def.title).trim() || def.title,
        text: String(row.text ?? def.text).trim() || def.text,
      };
    });
  }

  return {
    hero: {
      title:
        String(hero.title ?? "Real estate pensado para generar renta").trim() ||
        "Real estate pensado para generar renta",
      subtitle: String(
        hero.subtitle ??
          "Desarrollamos y comercializamos proyectos inmobiliarios diseñados para operar bajo el modelo Top Rentals desde el día uno.",
      ).trim(),
      ctaPrimaryLabel:
        String(hero.ctaPrimaryLabel ?? "Ver proyectos").trim() || "Ver proyectos",
      ctaPrimaryHref:
        String(hero.ctaPrimaryHref ?? "#oportunidades").trim() || "#oportunidades",
      ctaSecondaryLabel:
        String(hero.ctaSecondaryLabel ?? "Recibir información").trim() ||
        "Recibir información",
      ctaSecondaryHref:
        String(hero.ctaSecondaryHref ?? "#invertir").trim() || "#invertir",
    },
    development: {
      title:
        String(development.title ?? "Desarrollo, comercialización y operación").trim() ||
        "Desarrollo, comercialización y operación",
      paragraphs: asParagraphs(development.paragraphs, [
        "Top Rentals integra el desarrollo inmobiliario con un modelo de operación profesional de alquiler temporario.",
        "Desde el diseño del proyecto hasta la gestión diaria, cada decisión se toma con foco en la renta, la eficiencia y el largo plazo.",
      ]),
    },
    rentIncluded: {
      title:
        String(rentIncluded.title ?? "Unidades con renta incluida").trim() ||
        "Unidades con renta incluida",
      paragraphs: asParagraphs(rentIncluded.paragraphs, [
        "Los proyectos desarrollados por Top Rentals están concebidos para operar desde el primer día bajo nuestros estándares.",
        "La renta no es una proyección teórica: es el resultado de una operación real, probada y escalable.",
      ]),
    },
    operationDiff: {
      title:
        String(operationDiff.title ?? "La diferencia está en la operación").trim() ||
        "La diferencia está en la operación",
      items: asStringArray(operationDiff.items, [
        "Diseño pensado para short-term rentals",
        "Operación a cargo de Top Rentals",
        "Estándares homogéneos en todas las unidades",
        "Gestión profesional para el huésped",
        "Optimización continua de la renta",
      ]),
      closing:
        String(operationDiff.closing ?? "").trim() ||
        "No vendemos metros cuadrados. Compras activos pensado para facturar.",
    },
    proven: {
      title:
        String(proven.title ?? "Una operación probada").trim() || "Una operación probada",
      intro:
        String(proven.intro ?? "").trim() ||
        "Top Rentals opera actualmente un amplio portfolio de unidades de alquiler temporario en distintos mercados.",
      stats,
    },
    opportunitiesTitle:
      String(raw.opportunitiesTitle ?? "Oportunidades").trim() || "Oportunidades",
    opportunitiesSubtitle:
      String(raw.opportunitiesSubtitle ?? "").trim() ||
      "Proyectos desarrollados para operar bajo el modelo Top Rentals desde el diseño hasta la operación diaria.",
    opportunitiesClosing:
      String(raw.opportunitiesClosing ?? "").trim() ||
      "Ambos proyectos fueron concebidos desde el inicio para maximizar la eficiencia operativa y la experiencia del huésped.",
    projects,
    commercialization: {
      title:
        String(commercialization.title ?? "").trim() ||
        "Comercialización de unidades en edificios operados",
      intro:
        String(commercialization.intro ?? "").trim() ||
        "Además de desarrollar proyectos propios, Top Rentals comercializa unidades dentro de los edificios que opera, ofreciendo renta desde el primer día.",
      items: asStringArray(commercialization.items, [
        "Unidades a la venta de propietarios actuales",
        "Oportunidades detectadas dentro de edificios en operación",
        "Unidades con potencial de renta bajo el modelo Top Rentals",
      ]),
      closing:
        String(commercialization.closing ?? "").trim() ||
        "Comercializamos solo unidades que conocemos en profundidad porque forman parte de nuestra operación diaria.",
    },
    integratedModel: {
      title:
        String(integratedModel.title ?? "").trim() ||
        "Un modelo integrado de punta a punta",
      steps,
    },
    finalCta: {
      title:
        String(finalCta.title ?? "Invertir con Top Rentals").trim() ||
        "Invertir con Top Rentals",
      text:
        String(finalCta.text ?? "").trim() ||
        "Contactanos para conocer los proyectos en desarrollo y las oportunidades de inversión disponibles.",
      ctaLabel:
        String(finalCta.ctaLabel ?? "Recibir información de proyectos").trim() ||
        "Recibir información de proyectos",
      ctaHref: String(finalCta.ctaHref ?? "#invertir").trim() || "#invertir",
    },
  };
}
