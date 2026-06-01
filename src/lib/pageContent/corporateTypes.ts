import type { PageContent } from "./types";

export type CorporateHeroContent = {
  label: string;
  title: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  imageSrc: string;
  features: string[];
};

export type CorporateTextBlock = { title: string; text: string };

export type CorporateDesignedForContent = {
  title: string;
  intro: string;
  items: string[];
  closing: string;
};

export type CorporateFeaturesContent = {
  title: string;
  items: CorporateTextBlock[];
};

export type CorporateBenefitsContent = {
  title: string;
  leftColumn: string[];
  rightColumn: string[];
  closing: string;
};

export type CorporateHowItWorksContent = {
  title: string;
  steps: CorporateTextBlock[];
};

export type CorporateSpacesContent = {
  title: string;
  subtitle: string;
  cards: string[];
};

export type CorporateDestinationsContent = {
  title: string;
  items: CorporateTextBlock[];
};

export type CorporateAccessContent = {
  title: string;
  loginQuestion: string;
  loginDescription: string;
  loginCtaLabel: string;
  loginCtaHref: string;
  formTitle: string;
  formSubmitLabel: string;
};

export type CorporatePageContent = {
  hero: CorporateHeroContent;
  designedFor: CorporateDesignedForContent;
  features: CorporateFeaturesContent;
  benefits: CorporateBenefitsContent;
  howItWorks: CorporateHowItWorksContent;
  spaces: CorporateSpacesContent;
  destinations: CorporateDestinationsContent;
  access: CorporateAccessContent;
};

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((v) => String(v)).filter(Boolean);
}

function asBlocks(value: unknown, fallback: CorporateTextBlock[]): CorporateTextBlock[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, i) => {
    const o = (item ?? {}) as Record<string, string>;
    return {
      title: o.title ?? fallback[i]?.title ?? "",
      text: o.text ?? fallback[i]?.text ?? "",
    };
  });
}

const DEFAULT_HERO_FEATURES = [
  "Múltiples depts. en una misma torre",
  "Contratos flexibles y estadías largas",
  "Tarifas corporativas negociadas",
  "Soporte dedicado 24/7",
];

const DEFAULT_FEATURE_ITEMS: CorporateTextBlock[] = [
  {
    title: "Departamentos totalmente equipados",
    text: "Listos para vivir y trabajar desde el primer día.",
  },
  {
    title: "Ubicaciones estratégicas",
    text: "Cerca de polos corporativos y zonas clave.",
  },
  {
    title: "Estándar hotelero",
    text: "Limpieza profesional, ropa blanca y soporte.",
  },
  {
    title: "Flexibilidad total",
    text: "Estadías cortas, medias o prolongadas.",
  },
];

const DEFAULT_BENEFITS_LEFT = [
  "Tarifas corporativas preferenciales",
  "Condiciones flexibles según volumen y duración.",
  "Facturación clara y centralizada",
];

const DEFAULT_BENEFITS_RIGHT = [
  "Gestión simple de múltiples reservas",
  "Atención personalizada.",
  "Ejecutivo corporate dedicado para tu cuenta.",
  "Servicios adicionales a medida.",
];

function legacyBenefitColumns(
  items: CorporateTextBlock[],
): { left: string[]; right: string[] } {
  const flat: string[] = [];
  for (const item of items) {
    if (item.title) flat.push(item.title);
    if (item.text) flat.push(item.text);
  }
  const half = Math.ceil(flat.length / 2);
  return { left: flat.slice(0, half), right: flat.slice(half) };
}

const DEFAULT_STEPS: CorporateTextBlock[] = [
  {
    title: "Solicitud de cuenta",
    text: "Completá el formulario de acceso corporativo.",
  },
  {
    title: "Activación personalizada",
    text: "Nuestro equipo valida la cuenta, asigna tarifas especiales y designa un ejecutivo corporate dedicado.",
  },
  {
    title: "Reservas simples",
    text: "Accedé al catálogo completo con precios corporativos y soporte directo para cada reserva.",
  },
  {
    title: "Gestión centralizada",
    text: "Control de reservas, estadías y facturación con acompañamiento personalizado.",
  },
];

export function pickCorporatePage(raw: PageContent): CorporatePageContent {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const designedFor = (raw.designedFor ?? {}) as Record<string, unknown>;
  const features = (raw.features ?? {}) as Record<string, unknown>;
  const benefits = (raw.benefits ?? {}) as Record<string, unknown>;
  const howItWorks = (raw.howItWorks ?? {}) as Record<string, unknown>;
  const spaces = (raw.spaces ?? {}) as Record<string, unknown>;
  const destinations = (raw.destinations ?? {}) as Record<string, unknown>;
  const access = (raw.access ?? {}) as Record<string, unknown>;

  return {
    hero: {
      label: String(hero.label ?? "CORPORATIVO"),
      title: String(hero.title ?? "Alojamiento corporativo sin complicaciones."),
      subtitle: String(
        hero.subtitle ??
          "Soluciones de alojamiento profesional para empresas, equipos en movimiento y proyectos flexibles.",
      ),
      ctaPrimaryLabel: String(hero.ctaPrimaryLabel ?? "Acceso corporativo →"),
      ctaPrimaryHref: String(hero.ctaPrimaryHref ?? "#acceso-corporativo"),
      ctaSecondaryLabel: String(hero.ctaSecondaryLabel ?? "Cotizar alojamiento →"),
      ctaSecondaryHref: String(hero.ctaSecondaryHref ?? "#acceso-corporativo"),
      imageSrc: String(
        hero.imageSrc ?? "/images/corporate/corporate-teaser.png",
      ),
      features: asStringArray(hero.features ?? raw.heroFeatures, DEFAULT_HERO_FEATURES),
    },
    designedFor: {
      title: String(designedFor.title ?? "Diseñado para equipos que viajan"),
      intro: String(
        designedFor.intro ?? "Top Rentals Corporate está pensado para:",
      ),
      items: asStringArray(designedFor.items, [
        "Empresas con equipos en movimiento",
        "Relocaciones de corta y larga estadía",
        "Agencias mayoristas de viajes",
        "Programas de jóvenes profesionales y grupos universitarios",
      ]),
      closing: String(
        designedFor.closing ??
          "Todo con un estándar consistente y sin la fricción de alquileres informales.",
      ),
    },
    features: {
      title: String(features.title ?? "Más que un departamento"),
      items: asBlocks(features.items, DEFAULT_FEATURE_ITEMS),
    },
    benefits: (() => {
      const leftCol = benefits.leftColumn;
      const rightCol = benefits.rightColumn;
      const hasColumns =
        Array.isArray(leftCol) &&
        leftCol.length > 0 &&
        Array.isArray(rightCol) &&
        rightCol.length > 0;
      const legacy = legacyBenefitColumns(
        asBlocks(benefits.items, []),
      );
      return {
        title: String(benefits.title ?? "Beneficios exclusivos para empresas"),
        leftColumn: hasColumns
          ? asStringArray(leftCol, DEFAULT_BENEFITS_LEFT)
          : legacy.left.length > 0
            ? legacy.left
            : DEFAULT_BENEFITS_LEFT,
        rightColumn: hasColumns
          ? asStringArray(rightCol, DEFAULT_BENEFITS_RIGHT)
          : legacy.right.length > 0
            ? legacy.right
            : DEFAULT_BENEFITS_RIGHT,
        closing: String(
          benefits.closing ??
            "Todo gestionado desde una cuenta corporativa única.",
        ),
      };
    })(),
    howItWorks: {
      title: String(
        howItWorks.title ?? "Cómo funciona Top Rentals Corporate",
      ),
      steps: asBlocks(howItWorks.steps, DEFAULT_STEPS),
    },
    spaces: {
      title: String(
        spaces.title ?? "Espacios para reuniones y eventos corporativos",
      ),
      subtitle: String(
        spaces.subtitle ??
          "Soluciones flexibles para encuentros profesionales, reuniones privadas y eventos empresariales.",
      ),
      cards: asStringArray(spaces.cards, [
        "Espacios de cowork",
        "Salas de reuniones privadas premium",
        "Auditorios para eventos y presentaciones",
      ]),
    },
    destinations: {
      title: String(destinations.title ?? "Destinos disponibles"),
      items: asBlocks(destinations.items, [
        {
          title: "Buenos Aires",
          text: "Departamentos ubicados en zonas estratégicas para negocios, con fácil acceso a polos corporativos.",
        },
        {
          title: "Ecuador",
          text: "Soluciones prácticas para estadías laborales, proyectos temporales y equipos en movimiento.",
        },
      ]),
    },
    access: {
      title: String(access.title ?? "Acceso Corporativo"),
      loginQuestion: String(access.loginQuestion ?? "¿Ya sos cliente corporate?"),
      loginDescription: String(
        access.loginDescription ??
          "Ingresá a tu cuenta y reservá con tarifas corporativas.",
      ),
      loginCtaLabel: String(access.loginCtaLabel ?? "Acceso corporativo →"),
      loginCtaHref: String(access.loginCtaHref ?? "#"),
      formTitle: String(access.formTitle ?? "Solicitar acceso corporate"),
      formSubmitLabel: String(
        access.formSubmitLabel ?? "Solicitar información →",
      ),
    },
  };
}
