/** Ancla del formulario de acceso / cotización en /corporate */
export const CORPORATE_FORM_ANCHOR = "#acceso-corporativo";

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

export function sanitizeCorporateHref(href: string): string {
  const h = href.trim();
  if (!h || h === "#") return CORPORATE_FORM_ANCHOR;
  if (/\/reservas/i.test(h)) return CORPORATE_FORM_ANCHOR;
  return h;
}

/** CTAs del hero: Acceso + Cotizar al formulario; sin enlaces al motor por ciudad. */
export function buildCorporateHeroCtas(input: {
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}): CorporateCta[] {
  const candidates: CorporateCta[] = [
    {
      label: stripArrow(input.ctaPrimaryLabel),
      href: sanitizeCorporateHref(input.ctaPrimaryHref),
      variant: "primary",
    },
    {
      label: stripArrow(input.ctaSecondaryLabel),
      href: sanitizeCorporateHref(input.ctaSecondaryHref),
      variant: "secondary",
    },
  ];

  const ctas = candidates.filter((c) => c.label && !isMotorDestinationCta(c.label));

  const hasCotizar = ctas.some((c) => /cotizar/i.test(c.label));
  const hasAcceso = ctas.some((c) => /acceso/i.test(c.label));

  if (!hasAcceso) {
    ctas.unshift({
      label: "Acceso corporativo",
      href: CORPORATE_FORM_ANCHOR,
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
    if (/cotizar/i.test(cta.label)) {
      cta.href = CORPORATE_FORM_ANCHOR;
    }
  }

  const primary = ctas.find((c) => c.variant === "primary") ?? ctas[0]!;
  const secondary =
    ctas.find((c) => c.variant === "secondary" && c !== primary) ??
    ctas.find((c) => c !== primary);

  return secondary ? [primary, secondary] : [primary];
}
