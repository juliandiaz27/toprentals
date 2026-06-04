/** Formulario de cotización / solicitud en /corporate */
export const CORPORATE_FORM_ANCHOR = "#acceso-corporativo";

/** Ruta dedicada al módulo GNAHS de agencias */
export const CORPORATE_AGENCIES_PATH = "/agencias";

/** Ancla del módulo de agencias embebido en /corporate */
export const CORPORATE_AGENCIES_ANCHOR = "#acceso-agencias";

export type CorporateCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

function stripArrow(label: string): string {
  return label.replace(/\s*→\s*$/, "").trim();
}

/** Buenos Aires / Ecuador no son CTAs al motor en Corporativo. */
export function isMotorDestinationCta(label: string): boolean {
  const t = stripArrow(label).toLowerCase();
  return (
    t === "buenos aires" ||
    t === "ecuador" ||
    t === "quito" ||
    t.startsWith("reservas ")
  );
}

export function isCorporateAccessCtaLabel(label: string): boolean {
  const t = stripArrow(label).toLowerCase();
  return /acceso/.test(t) && !/cotizar/.test(t);
}

/** CTA «Acceso corporativo» → módulo de agencias (ancla en /corporate o /agencias). */
export function sanitizeCorporateAccessHref(href: string): string {
  const h = href.trim();
  if (
    !h ||
    h === "#" ||
    h === CORPORATE_FORM_ANCHOR ||
    h === CORPORATE_AGENCIES_PATH ||
    /acceso-corporativo/i.test(h) ||
    /\/reservas/i.test(h)
  ) {
    return CORPORATE_AGENCIES_ANCHOR;
  }
  return h;
}

/** CTA «Cotizar» → formulario en /corporate. */
export function sanitizeCorporateQuoteHref(href: string): string {
  const h = href.trim();
  if (!h || h === "#" || /\/reservas/i.test(h)) return CORPORATE_FORM_ANCHOR;
  return h;
}

/** @deprecated Use sanitizeCorporateAccessHref / sanitizeCorporateQuoteHref */
export function sanitizeCorporateHref(href: string): string {
  return sanitizeCorporateQuoteHref(href);
}

/** CTAs del hero: Acceso → /agencias; Cotizar → formulario corporativo. */
export function buildCorporateHeroCtas(input: {
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}): CorporateCta[] {
  const candidates: CorporateCta[] = [
    {
      label: stripArrow(input.ctaPrimaryLabel),
      href: sanitizeCorporateAccessHref(input.ctaPrimaryHref),
      variant: "primary",
    },
    {
      label: stripArrow(input.ctaSecondaryLabel),
      href: sanitizeCorporateQuoteHref(input.ctaSecondaryHref),
      variant: "secondary",
    },
  ];

  const ctas = candidates.filter((c) => c.label && !isMotorDestinationCta(c.label));

  const hasCotizar = ctas.some((c) => /cotizar/i.test(c.label));
  const hasAcceso = ctas.some((c) => isCorporateAccessCtaLabel(c.label));

  if (!hasAcceso) {
    ctas.unshift({
      label: "Acceso corporativo",
      href: CORPORATE_AGENCIES_ANCHOR,
      variant: "primary",
    });
  }

  if (!hasCotizar) {
    ctas.push({
      label: "Cotizar alojamiento",
      href: CORPORATE_FORM_ANCHOR,
      variant: "secondary",
    });
  }

  for (const cta of ctas) {
    if (isCorporateAccessCtaLabel(cta.label)) {
      cta.href = sanitizeCorporateAccessHref(cta.href);
    } else if (/cotizar/i.test(cta.label)) {
      cta.href = CORPORATE_FORM_ANCHOR;
    }
  }

  const primary = ctas.find((c) => c.variant === "primary") ?? ctas[0]!;
  const secondary =
    ctas.find((c) => c.variant === "secondary" && c !== primary) ??
    ctas.find((c) => c !== primary);

  return secondary ? [primary, secondary] : [primary];
}
