"use client";

import { useMemo } from "react";
import { getGnahsWidgetConfigForProperty } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type Props = {
  gnahsId: number;
  propertyName?: string;
};

/** Buscador GNAHS de la ficha: fechas, huéspedes y reserva solo para esa torre. */
export function PropertyDetailSearchBar({ gnahsId, propertyName }: Props) {
  const config = useMemo(
    () => getGnahsWidgetConfigForProperty(gnahsId),
    [gnahsId],
  );

  return (
    <div
      data-reveal
      className="property-detail-gnahs-search relative z-30 overflow-visible rounded-lg border border-neutral-200 bg-white p-4"
    >
      <BookingWidget
        config={config}
        hideDestination
        establishmentId={gnahsId}
        establishmentLabel={propertyName}
      />
    </div>
  );
}
