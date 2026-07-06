"use client";

import { useMemo } from "react";
import { getGnahsWidgetConfigForProperty } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";
import { DEFAULT_SITE_LANGUAGE, type SiteLanguage } from "@/lib/i18n";

type Props = {
  gnahsId: number;
  language?: SiteLanguage;
};

/** Buscador GNAHS de la ficha: fechas, huéspedes y reserva solo para esa torre. */
export function PropertyDetailSearchBar({
  gnahsId,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {
  const config = useMemo(
    () => getGnahsWidgetConfigForProperty(gnahsId, language),
    [gnahsId, language],
  );

  return (
    <div
      data-reveal
      className="property-detail-gnahs-search relative z-30 overflow-visible rounded-lg border border-neutral-200 bg-white p-4"
    >
      <BookingWidget
        key={language}
        config={config}
        hideDestination
        establishmentId={gnahsId}
      />
    </div>
  );
}
