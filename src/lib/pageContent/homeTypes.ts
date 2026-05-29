export type HomeHeaderContent = {
  logoText: string;
  link1Label: string;
  link1Href: string;
  link2Label: string;
  link2Href: string;
  link3Label: string;
  link3Href: string;
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
  const h = (raw.header ?? {}) as Record<string, string>;
  return {
    logoText: h.logoText ?? "TOP RENTALS",
    link1Label: h.link1Label ?? "Propiedades",
    link1Href: h.link1Href ?? "/propiedades",
    link2Label: h.link2Label ?? "Corporativo",
    link2Href: h.link2Href ?? "/corporate",
    link3Label: h.link3Label ?? "Club Top Rentals",
    link3Href: h.link3Href ?? "#",
    ctaLabel: h.ctaLabel ?? "Reservar ahora",
    ctaHref: h.ctaHref ?? "/propiedades",
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
