"use client";

import { useMemo } from "react";
import { getGnahsWidgetConfigForProperty } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";
import { GnahsWidgetTopRentalsSkin } from "@/components/gnahs/GnahsWidgetTopRentalsSkin";

type Props = {
  gnahsId: number;
};

/** Buscador GNAHS de la ficha: fechas, huéspedes y reserva solo para esa torre. */
export function PropertyDetailSearchBar({ gnahsId }: Props) {
  const config = useMemo(
    () => getGnahsWidgetConfigForProperty(gnahsId),
    [gnahsId],
  );

  return (
    <div
      data-reveal
      className="rounded-lg border border-neutral-200 bg-white p-4"
    >
      <GnahsWidgetTopRentalsSkin variant="property">
        <BookingWidget config={config} hidePromo hideDestination />
      </GnahsWidgetTopRentalsSkin>
    </div>
  );
}
