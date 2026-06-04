"use client";

import { useEffect } from "react";
import {
  getGnahsLoyaltyConfig,
  GNAHS_LOYALTY_LAUNCHER,
} from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

/**
 * Programa de fidelización — contenedor #GNAHS-loyalty.
 * @see https://docs.gnahs.com/2.0/loyalty/loyalty-app
 */
export function LoyaltyModule() {
  useEffect(() => {
    window.GNAHS_Loyalty = getGnahsLoyaltyConfig();

    return loadScript(GNAHS_LOYALTY_LAUNCHER, {
      id: "gnahs-loyalty-launcher",
      defer: true,
      module: true,
    });
  }, []);

  return (
    <div
      id="GNAHS-loyalty"
      className="min-h-[520px] w-full"
      aria-label="Programa de fidelización Club Top Rentals"
    />
  );
}
