"use client";

import { useEffect } from "react";
import {
  getGnahsAgenciesConfig,
  GNAHS_AGENCIES_LAUNCHER,
} from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

/**
 * Módulo de agencias — contenedor #GNAHS-agencies.
 * @see https://docs.gnahs.com/2.0/agencies/agencies-app
 */
export function AgenciesModule() {
  useEffect(() => {
    window.GNAHS_Agencies = getGnahsAgenciesConfig();

    return loadScript(GNAHS_AGENCIES_LAUNCHER, {
      id: "gnahs-agencies-launcher",
      defer: true,
      module: true,
    });
  }, []);

  return (
    <div
      id="GNAHS-agencies"
      className="min-h-[480px] w-full"
      aria-label="Agencias"
    />
  );
}
