import type { PageContent } from "./types";
import { sanitizeClubLoyaltyHref } from "./clubCtas";

export type ClubTextBlock = { title: string; text: string };

export type ClubHeroContent = {
  label: string;
  title: string;
  subtitle: string;
  ctaJoinLabel: string;
  ctaJoinHref: string;
  ctaMemberLabel: string;
  ctaMemberHref: string;
};

export type ClubIntroContent = {
  title: string;
  text: string;
};

export type ClubLevelTier = {
  id: string;
  name: string;
  requirement: string;
  benefits: string[];
  variant: "silver" | "gold" | "platinum";
};

export type ClubBenefitsColumn = {
  title: string;
  items: string[];
};

export type ClubFaqItem = { question: string; answer: string };

export type ClubFeaturedContent = {
  title: string;
  linkLabel: string;
  linkHref: string;
};

export type ClubBottomCtaContent = {
  text: string;
  ctaPropertiesLabel: string;
  ctaPropertiesHref: string;
  ctaMemberLabel: string;
  ctaMemberHref: string;
};

export type ClubPageContent = {
  hero: ClubHeroContent;
  intro: ClubIntroContent;
  howItWorks: { title: string; steps: ClubTextBlock[] };
  levels: { title: string; subtitle: string; tiers: ClubLevelTier[] };
  benefits: { title: string; columns: ClubBenefitsColumn[] };
  faq: { title: string; items: ClubFaqItem[] };
  featured: ClubFeaturedContent;
  bottomCta: ClubBottomCtaContent;
};

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.map((v) => String(v).trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function asTextBlocks(value: unknown, fallback: ClubTextBlock[]): ClubTextBlock[] {
  if (!Array.isArray(value)) return fallback;
  const blocks = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const title = String(row.title ?? "").trim();
      const text = String(row.text ?? "").trim();
      if (!title && !text) return null;
      return { title, text };
    })
    .filter((b): b is ClubTextBlock => b !== null);
  return blocks.length > 0 ? blocks : fallback;
}

const DEFAULT_STEPS: ClubTextBlock[] = [
  {
    title: "Reservá en Top Rentals",
    text: "Cada estadía confirmada suma puntos automáticamente.",
  },
  {
    title: "Acumulá puntos",
    text: "Tus puntos se acreditan al finalizar cada reserva.",
  },
  {
    title: "Subí de nivel",
    text: "A más noches por año, más beneficios desbloqueás.",
  },
  {
    title: "Canjeá",
    text: "Usá tus puntos para descuentos y upgrades en futuras estadías.",
  },
];

export function parseClubHowItWorksSteps(
  howItWorks: Record<string, unknown>,
): ClubTextBlock[] {
  const steps = asTextBlocks(howItWorks.steps, []);
  if (steps.length > 0) return steps.slice(0, 4);

  const legacy: ClubTextBlock[] = [];
  for (let i = 1; i <= 4; i++) {
    const title = String(howItWorks[`step${i}Title`] ?? "").trim();
    const text = String(howItWorks[`step${i}Text`] ?? "").trim();
    if (title || text) legacy.push({ title, text });
  }
  return legacy.length > 0 ? legacy : DEFAULT_STEPS;
}

const DEFAULT_TIERS: ClubLevelTier[] = [
  {
    id: "silver",
    name: "Silver",
    requirement: "0–9 noches al año",
    variant: "silver",
    benefits: [
      "Acumulación de puntos",
      "Check-in prioritario",
      "WiFi premium",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    requirement: "10–24 noches al año",
    variant: "gold",
    benefits: [
      "Todo Silver +",
      "Upgrade de categoría (sujeto a disponibilidad)",
      "Late check-out hasta 14hs",
      "Welcome amenity",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    requirement: "25+ noches al año",
    variant: "platinum",
    benefits: [
      "Todo Gold +",
      "Upgrade garantizado",
      "Late check-out hasta 18hs",
      "Early check-in",
      "Concierge dedicado",
    ],
  },
];

const DEFAULT_BENEFIT_COLUMNS: ClubBenefitsColumn[] = [
  {
    title: "Descuentos y precios",
    items: [
      "Tarifas exclusivas para miembros",
      "Descuento progresivo según nivel",
      "Acceso a deals anticipados",
    ],
  },
  {
    title: "Upgrades y estadía",
    items: [
      "Mejora de tipología disponible",
      "Check-in temprano / late check-out",
      "Habitaciones en pisos altos (sujeto a disponibilidad)",
    ],
  },
  {
    title: "Experiencia y servicio",
    items: [
      "Línea de soporte prioritaria",
      "Concierge personal (Platinum)",
      "Bienvenida especial en cada estadía",
    ],
  },
  {
    title: "Acumulación y canje",
    items: [
      "Puntos por cada noche reservada",
      "Canje por noches gratis",
      "Puntos no vencen mientras mantengas actividad",
    ],
  },
];

const DEFAULT_FAQ: ClubFaqItem[] = [
  {
    question: "¿Cómo me uno al Club?",
    answer:
      "Registrate gratis con tu email. Tu membresía se activa automáticamente con tu primera reserva.",
  },
  {
    question: "¿Los puntos vencen?",
    answer:
      "No. Tus puntos se acumulan sin fecha de vencimiento mientras tu cuenta esté activa.",
  },
  {
    question: "¿Cómo subo de nivel?",
    answer:
      "Tu nivel se calcula por las noches acumuladas en un año calendario. A más noches, más beneficios.",
  },
  {
    question: "¿Puedo canjear puntos en cualquier propiedad?",
    answer:
      "Sí, en todas las propiedades de Top Rentals en Buenos Aires y Quito.",
  },
];

export function pickClubPage(raw: PageContent): ClubPageContent {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const intro = (raw.intro ?? {}) as Record<string, unknown>;
  const howItWorks = (raw.howItWorks ?? {}) as Record<string, unknown>;
  const levels = (raw.levels ?? {}) as Record<string, unknown>;
  const benefits = (raw.benefits ?? {}) as Record<string, unknown>;
  const faq = (raw.faq ?? {}) as Record<string, unknown>;
  const featured = (raw.featured ?? {}) as Record<string, unknown>;
  const bottomCta = (raw.bottomCta ?? {}) as Record<string, unknown>;

  const tiersRaw = levels.tiers;
  let tiers = DEFAULT_TIERS;
  if (Array.isArray(tiersRaw) && tiersRaw.length > 0) {
    tiers = tiersRaw
      .map((t, i) => {
        if (!t || typeof t !== "object") return null;
        const row = t as Record<string, unknown>;
        const variant = String(row.variant ?? DEFAULT_TIERS[i]?.variant ?? "silver");
        const safeVariant =
          variant === "gold" || variant === "platinum" ? variant : "silver";
        return {
          id: String(row.id ?? `tier-${i}`),
          name: String(row.name ?? ""),
          requirement: String(row.requirement ?? ""),
          variant: safeVariant as ClubLevelTier["variant"],
          benefits: asStringArray(row.benefits, []),
        };
      })
      .filter((t): t is ClubLevelTier => t !== null && Boolean(t.name));
    if (tiers.length === 0) tiers = DEFAULT_TIERS;
  }

  const columnsRaw = benefits.columns;
  let columns = DEFAULT_BENEFIT_COLUMNS;
  if (Array.isArray(columnsRaw) && columnsRaw.length > 0) {
    columns = columnsRaw
      .map((c) => {
        if (!c || typeof c !== "object") return null;
        const row = c as Record<string, unknown>;
        const title = String(row.title ?? "").trim();
        if (!title) return null;
        return { title, items: asStringArray(row.items, []) };
      })
      .filter((c): c is ClubBenefitsColumn => c !== null);
    if (columns.length === 0) columns = DEFAULT_BENEFIT_COLUMNS;
  }

  const faqRaw = faq.items;
  let faqItems = DEFAULT_FAQ;
  if (Array.isArray(faqRaw) && faqRaw.length > 0) {
    faqItems = faqRaw
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const question = String(row.question ?? "").trim();
        const answer = String(row.answer ?? "").trim();
        if (!question) return null;
        return { question, answer };
      })
      .filter((f): f is ClubFaqItem => f !== null);
    if (faqItems.length === 0) faqItems = DEFAULT_FAQ;
  }

  return {
    hero: {
      label: String(hero.label ?? "TOP RENTALS CLUB"),
      title: String(hero.title ?? "Cada estadía suma.\nCada punto vale."),
      subtitle: String(
        hero.subtitle ??
          "Un programa de rewards diseñado para quienes eligen Top Rentals una y otra vez.",
      ),
      ctaJoinLabel: String(hero.ctaJoinLabel ?? "Unirme al Club"),
      ctaJoinHref: sanitizeClubLoyaltyHref(String(hero.ctaJoinHref ?? "/loyalty")),
      ctaMemberLabel: String(hero.ctaMemberLabel ?? "Ya soy miembro"),
      ctaMemberHref: sanitizeClubLoyaltyHref(
        String(hero.ctaMemberHref ?? "/loyalty"),
      ),
    },
    intro: {
      title: String(intro.title ?? "¿Qué es Top Rentals Club?"),
      text: String(
        intro.text ??
          "Es nuestro programa de fidelización. Cada vez que te alojás en Top Rentals, acumulás puntos que podés canjear por descuentos, upgrades y beneficios exclusivos en tus próximas estadías.",
      ),
    },
    howItWorks: {
      title: String(howItWorks.title ?? "Cómo funciona"),
      steps: parseClubHowItWorksSteps(howItWorks),
    },
    levels: {
      title: String(levels.title ?? "Niveles del Club"),
      subtitle: String(
        levels.subtitle ?? "Cuanto más volvés, más beneficios desbloqueás.",
      ),
      tiers,
    },
    benefits: {
      title: String(benefits.title ?? "Beneficios del Club"),
      columns,
    },
    faq: {
      title: String(faq.title ?? "Preguntas frecuentes"),
      items: faqItems,
    },
    featured: {
      title: String(featured.title ?? "Reservá y empezá a sumar puntos"),
      linkLabel: String(featured.linkLabel ?? "Ver todas las propiedades"),
      linkHref: String(featured.linkHref ?? "/propiedades"),
    },
    bottomCta: {
      text: String(
        bottomCta.text ??
          "Tu próxima reserva ya suma puntos. Unirte es gratis y automático.",
      ),
      ctaPropertiesLabel: String(bottomCta.ctaPropertiesLabel ?? "Ver propiedades"),
      ctaPropertiesHref: String(bottomCta.ctaPropertiesHref ?? "/propiedades"),
      ctaMemberLabel: String(bottomCta.ctaMemberLabel ?? "Ya soy miembro"),
      ctaMemberHref: sanitizeClubLoyaltyHref(
        String(bottomCta.ctaMemberHref ?? "/loyalty"),
      ),
    },
  };
}

export function clubStepsGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "sm:grid-cols-2";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}
