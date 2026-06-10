import { plainTextFromRichHtml } from "@/lib/richText/sanitize";
import { parseDifferentialCards } from "./differentialCards";
import {
  HEADER_CTA_HREF,
  type HeaderNavLink,
  resolveHeaderNavStored,
  headerNavLinksFromStored,
} from "./headerNav";

export { parseDifferentialCards };

export type { HeaderNavLink };

export type HomeHeaderContent = {
  logoSrc: string;
  logoText: string;
  navLinks: HeaderNavLink[];
  ctaLabel: string;
  ctaHref: string;
};

export type HomeHeroContent = {
  title: string;
  subtitle: string;
  videoSrc: string;
  videoUrl: string;
  posterSrc: string;
  playingLabel: string;
  videoPlaceholder: string;
  exploreLabel: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  whatsappUrl: string;
  whatsappEnabled: boolean | string;
};

export function pickHomeHeader(raw: Record<string, unknown>): HomeHeaderContent {
  const h = (raw.header ?? {}) as Record<string, unknown>;
  const navStored = resolveHeaderNavStored(h);

  return {
    logoSrc: String(h.logoSrc ?? "").trim(),
    logoText: String(h.logoText ?? "TOP RENTALS").trim() || "TOP RENTALS",
    navLinks: headerNavLinksFromStored(navStored),
    ctaLabel: String(h.ctaLabel ?? "Reservar ahora").trim() || "Reservar ahora",
    ctaHref: HEADER_CTA_HREF,
  };
}

export function pickHomeHero(raw: Record<string, unknown>): HomeHeroContent {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const enabled = hero.whatsappEnabled;
  return {
    title: String(hero.title ?? "Departamentos con servicio de hotel."),
    subtitle: String(
      hero.subtitle ?? "Alquileres temporarios en 15 torres. Buenos Aires. Quito.",
    ),
    videoSrc: String(hero.videoSrc ?? ""),
    videoUrl: String(hero.videoUrl ?? ""),
    posterSrc: String(hero.posterSrc ?? hero.imageSrc ?? "/images/placeholders/home-hero.svg"),
    playingLabel: String(hero.playingLabel ?? hero.videoPlayLabel ?? "Reproduciendo"),
    videoPlaceholder: String(
      hero.videoPlaceholder ??
        "[ Video: edificios, amenidades, lifestyle — loop · sin sonido ]",
    ),
    exploreLabel: String(hero.exploreLabel ?? "Explorar"),
    ctaPrimary: String(hero.ctaPrimary ?? "Reservar ahora"),
    ctaPrimaryHref: String(hero.ctaPrimaryHref ?? "/propiedades"),
    ctaSecondary: String(hero.ctaSecondary ?? "Soluciones corporativas"),
    ctaSecondaryHref: String(hero.ctaSecondaryHref ?? "/corporate"),
    whatsappUrl: String(hero.whatsappUrl ?? "https://wa.me/"),
    whatsappEnabled: enabled === true || enabled === "true" || enabled === "on",
  };
}

export function resolveHeroVideoSrc(hero: HomeHeroContent): string | null {
  if (hero.videoSrc) return hero.videoSrc;
  if (hero.videoUrl) return hero.videoUrl;
  return null;
}

export type HeroSlide = {
  posterSrc: string;
  videoSrc: string;
  videoUrl: string;
  durationMs: number;
};

export function pickHomeHeroSlides(
  raw: Record<string, unknown>,
  hero: HomeHeroContent,
): HeroSlide[] {
  const heroRaw = (raw.hero ?? {}) as Record<string, unknown>;
  const defaultSec = Number(heroRaw.slideDurationSec) || 8;
  const defaultMs = defaultSec * 1000;

  const slides = raw.heroSlides;
  if (Array.isArray(slides) && slides.length > 0) {
    return slides.map((s) => {
      const item = s as Record<string, unknown>;
      return {
        posterSrc: String(item.posterSrc ?? hero.posterSrc),
        videoSrc: String(item.videoSrc ?? ""),
        videoUrl: String(item.videoUrl ?? ""),
        durationMs: Number(item.durationMs) || defaultMs,
      };
    });
  }
  return [
    {
      posterSrc: hero.posterSrc,
      videoSrc: hero.videoSrc,
      videoUrl: hero.videoUrl,
      durationMs: defaultMs,
    },
  ];
}

export function slideVideoSrc(slide: HeroSlide): string | null {
  if (slide.videoSrc) return slide.videoSrc;
  if (slide.videoUrl) return slide.videoUrl;
  return null;
}

export type HomeBuildingsContent = {
  title: string;
  subtitle: string;
  videoSrc: string;
  videoUrl: string;
  posterSrc: string;
  placeholder: string;
  meta: string;
};

export type HomeCorporateTeaserContent = {
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imagePlaceholder: string;
};

export type HomeStatItem = { value: string; label: string };

export type HomeStatsContent = {
  title: string;
  items: HomeStatItem[];
};

export type HomeDifferentialCard = {
  title: string;
  text: string;
};

export type HomeDifferentialsContent = {
  title: string;
  cards: HomeDifferentialCard[];
};

export type HomeFeaturedContent = {
  title: string;
  linkLabel: string;
  linkHref: string;
};

function statField(
  raw: Record<string, string>,
  key: string,
  fallback: string,
): string {
  const value = String(raw[key] ?? fallback);
  return plainTextFromRichHtml(value) || fallback;
}

export function pickHomeStats(raw: Record<string, unknown>): HomeStatsContent {
  const s = (raw.stats ?? {}) as Record<string, string>;
  return {
    title: statField(s, "title", "Top Rentals en números"),
    items: [
      {
        value: statField(s, "label1", "+500"),
        label: statField(s, "text1", "departamentos operados"),
      },
      { value: statField(s, "label2", "15"), label: statField(s, "text2", "torres") },
      {
        value: statField(s, "label3", "+100"),
        label: statField(s, "text3", "Personas en el equipo"),
      },
      {
        value: statField(s, "label4", "+600"),
        label: statField(s, "text4", "empresas alojadas por año"),
      },
      {
        value: statField(s, "label5", "10"),
        label: statField(s, "text5", "años de operación"),
      },
    ],
  };
}

export function pickHomeDifferentials(
  raw: Record<string, unknown>,
): HomeDifferentialsContent {
  const d = (raw.differentials ?? {}) as Record<string, unknown>;
  return {
    title: String(d.title ?? "Nuestros diferenciales"),
    cards: parseDifferentialCards(d),
  };
}

export function pickHomeFeatured(raw: Record<string, unknown>): HomeFeaturedContent {
  const f = (raw.featured ?? {}) as Record<string, string>;
  return {
    title: String(f.title ?? "Propiedades destacadas"),
    linkLabel: String(f.linkLabel ?? "Ver todas →"),
    linkHref: String(f.linkHref ?? "/propiedades"),
  };
}

export function pickHomeBuildings(raw: Record<string, unknown>): HomeBuildingsContent {
  const b = (raw.buildings ?? {}) as Record<string, unknown>;
  return {
    title: String(b.title ?? "Nuestros edificios, por adentro."),
    subtitle: String(
      b.subtitle ??
        "Un recorrido por los departamentos, amenities y el estilo de vida Top Rentals.",
    ),
    videoSrc: String(b.videoSrc ?? ""),
    videoUrl: String(b.videoUrl ?? ""),
    posterSrc: String(b.posterSrc ?? ""),
    placeholder: String(b.placeholder ?? "[ Video ]"),
    meta: String(b.meta ?? "2:45 min · Buenos Aires · Quito"),
  };
}

export function resolveBuildingsVideoSrc(buildings: HomeBuildingsContent): string | null {
  if (buildings.videoSrc) return buildings.videoSrc;
  if (buildings.videoUrl) return buildings.videoUrl;
  return null;
}

export function pickHomeCorporateTeaser(
  raw: Record<string, unknown>,
): HomeCorporateTeaserContent {
  const c = (raw.corporateTeaser ?? {}) as Record<string, unknown>;
  const bullets = c.bullets;
  const defaultBullets = [
    String(c.bullet1 ?? "Múltiples departamentos en una misma torre"),
    String(c.bullet2 ?? "Contratos flexibles para estadías largas"),
    String(c.bullet3 ?? "Tarifas corporativas negociadas"),
  ];
  const fromArray =
    Array.isArray(bullets) && bullets.length > 0
      ? bullets.map((b) => String(b))
      : null;
  return {
    title: String(c.title ?? "Soluciones de alojamiento\npara empresas"),
    description: String(
      c.description ??
        "Coordinamos el alojamiento de tu equipo con la eficiencia y el profesionalismo que tu empresa necesita.",
    ),
    bullets: fromArray ?? defaultBullets,
    ctaLabel: String(c.ctaLabel ?? "Cotizar alojamiento corporativo →"),
    ctaHref: String(c.ctaHref ?? "/corporate"),
    imageSrc: String(c.imageSrc ?? ""),
    imagePlaceholder: String(c.imagePlaceholder ?? "[ Imagen Corporate ]"),
  };
}

export type HomeDirectBenefitCard = { title: string; text: string };

export type HomeDirectBenefitsContent = {
  title: string;
  cards: HomeDirectBenefitCard[];
};

export type HomeLocationCard = {
  title: string;
  subtitle: string;
  linkLabel: string;
  href: string;
};

export type HomeLocationsContent = {
  title: string;
  locations: HomeLocationCard[];
};

export type HomeInvestorCtaContent = {
  title: string;
  devLabel: string;
  devHref: string;
  invLabel: string;
  invHref: string;
};

export type HomeFooterLink = { label: string; href: string };

export type HomeFooterContent = {
  brand: string;
  tagline: string;
  siteUrl: string;
  copyright: string;
  links: HomeFooterLink[];
  socialLabel: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
};

function pickBenefitCards(raw: Record<string, unknown>): HomeDirectBenefitCard[] {
  const d = raw;
  const defaults = [
    {
      title: "Mejor tarifa garantizada",
      text: "Beneficios exclusivos para socios. Siempre el precio más bajo.",
    },
    {
      title: "Late check-out disponible",
      text: "Sujeto a disponibilidad, sin costo adicional.",
    },
    {
      title: "Atención 24 hs",
      text: "Nuestro equipo siempre a tu disposición.",
    },
    {
      title: "Confirmación inmediata",
      text: "Sin esperas ni aprobaciones de terceros.",
    },
  ];
  return [1, 2, 3, 4].map((n, i) => ({
    title: String(d[`card${n}Title`] ?? defaults[i]?.title ?? ""),
    text: String(d[`card${n}Text`] ?? defaults[i]?.text ?? ""),
  }));
}

export function pickHomeDirectBenefits(
  raw: Record<string, unknown>,
): HomeDirectBenefitsContent {
  const b = (raw.directBenefits ?? {}) as Record<string, unknown>;
  return {
    title: String(b.title ?? "Beneficios de reservar directo con nosotros"),
    cards: pickBenefitCards(b),
  };
}

export function pickHomeLocations(raw: Record<string, unknown>): HomeLocationsContent {
  const l = (raw.locations ?? {}) as Record<string, unknown>;
  return {
    title: String(l.title ?? "Dónde operamos"),
    locations: [
      {
        title: String(l.card1Title ?? "Buenos Aires"),
        subtitle: String(l.card1Subtitle ?? "+400 departamentos · 7 zonas"),
        linkLabel: String(l.card1LinkLabel ?? "Ver propiedades →"),
        href: String(l.card1Href ?? "/propiedades"),
      },
      {
        title: String(l.card2Title ?? "Quito, Ecuador"),
        subtitle: String(l.card2Subtitle ?? "+100 departamentos · La Carolina"),
        linkLabel: String(l.card2LinkLabel ?? "Ver propiedades →"),
        href: String(l.card2Href ?? "/propiedades"),
      },
    ],
  };
}

export function pickHomeInvestorCta(raw: Record<string, unknown>): HomeInvestorCtaContent {
  const i = (raw.investorCta ?? {}) as Record<string, unknown>;
  return {
    title: String(
      i.title ?? "¿Sos un desarrollador o querés invertir en el sector?",
    ),
    devLabel: String(i.devLabel ?? "Desarrolladores →"),
    devHref: String(i.devHref ?? "/desarrolladores"),
    invLabel: String(i.invLabel ?? "Inversores →"),
    invHref: String(i.invHref ?? "/inversores"),
  };
}

const DEFAULT_FOOTER_LINKS: HomeFooterLink[] = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Corporativo", href: "/corporate" },
  { label: "Blog", href: "/blog" },
  { label: "Club Top Rentals", href: "/club-top-rentals" },
  { label: "Real Estate", href: "/real-estate" },
  { label: "Contacto", href: "/contacto" },
];

export function pickHomeFooter(raw: Record<string, unknown>): HomeFooterContent {
  const f = (raw.footer ?? {}) as Record<string, unknown>;
  const seen = new Set<string>();
  const links: HomeFooterLink[] = [];

  for (let n = 1; n <= 7; n++) {
    const label = String(f[`link${n}Label`] ?? "").trim();
    const href = String(f[`link${n}Href`] ?? "").trim();
    if (!label || !href || href === "#") continue;
    const dedupeKey = `${href}::${label}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    links.push({ label, href });
  }

  const resolvedLinks = links.length > 0 ? links : DEFAULT_FOOTER_LINKS;
  return {
    brand: String(f.brand ?? "TOP RENTALS"),
    tagline: String(f.tagline ?? "Temporary Apartments · Buenos Aires · Quito"),
    siteUrl: String(f.siteUrl ?? "thetoprentals.com"),
    copyright: String(f.copyright ?? "© 2025 Top Rentals. Todos los derechos reservados."),
    links: resolvedLinks,
    socialLabel: String(f.socialLabel ?? "Instagram · Facebook · WhatsApp"),
    instagramUrl: String(f.instagramUrl ?? "#"),
    facebookUrl: String(f.facebookUrl ?? "#"),
    whatsappUrl: String(f.whatsappUrl ?? "#"),
  };
}
