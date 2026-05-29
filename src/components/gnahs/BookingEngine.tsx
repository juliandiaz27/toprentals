"use client";

import { useEffect } from "react";
import {
  getGnahsEngineConfig,
  GNAHS_FETCH_SCRIPT,
  GNAHS_RHO_INIT_SCRIPT,
} from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

/**
 * Motor de reservas GNAHS — contenedor #GNAHSEngine.
 * @see https://docs.gnahs.com/2.0/booking-engine/basic-integration-booking-engine
 */
export function BookingEngine() {
  useEffect(() => {
    window.BookingParams = getGnahsEngineConfig();

    const cleanupRho = loadScript(GNAHS_RHO_INIT_SCRIPT, {
      id: "gnahs-rho-initial-settings",
      onLoad: () => {
        if (window.GNAHSGetRhoInitialSettings) {
          new window.GNAHSGetRhoInitialSettings();
        }
      },
    });

    const cleanupFetch = loadScript(GNAHS_FETCH_SCRIPT, {
      id: "gnahs-booking-fetch",
    });

    return () => {
      cleanupRho();
      cleanupFetch();
    };
  }, []);

  useEffect(() => {
    const engine = document.getElementById("GNAHSEngine");
    if (!engine) return;

    const onStepLoaded = (ev: Event) => {
      const detail = (ev as CustomEvent<Record<string, unknown>>).detail;
      if (process.env.NODE_ENV === "development") {
        console.debug("[GNAHS] step-loaded", detail);
      }
    };

    engine.addEventListener("GNAHS:step-loaded", onStepLoaded);
    return () => {
      engine.removeEventListener("GNAHS:step-loaded", onStepLoaded);
    };
  }, []);

  return (
    <div
      id="GNAHSEngine"
      className="min-h-[480px] w-full"
      aria-label="Motor de reservas"
    />
  );
}
