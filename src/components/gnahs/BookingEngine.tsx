"use client";

import { useEffect } from "react";
import {
  getGnahsEngineConfig,
  GNAHS_FETCH_SCRIPT,
  GNAHS_RHO_INIT_SCRIPT,
  type GnahsEngineRegion,
} from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";
import { pushGnahsStepLoaded } from "@/lib/gnahs/tracking";

/**
 * Motor GNAHS — solo en `/reservas`.
 * Scripts: rho-init → fetch.min.js (no cargar en otras rutas).
 * @see https://docs.gnahs.com/2.0/booking-engine/basic-integration-booking-engine
 */
type Props = {
  region?: GnahsEngineRegion;
};

export function BookingEngine({ region = "all" }: Props) {
  useEffect(() => {
    window.BookingParams = getGnahsEngineConfig(region);

    let cleanupFetch: (() => void) | undefined;

    const cleanupRho = loadScript(GNAHS_RHO_INIT_SCRIPT, {
      id: "gnahs-rho-initial-settings",
      appendTo: "body",
      onLoad: () => {
        if (window.GNAHSGetRhoInitialSettings) {
          new window.GNAHSGetRhoInitialSettings();
        }
        cleanupFetch = loadScript(GNAHS_FETCH_SCRIPT, {
          id: "gnahs-booking-fetch",
          appendTo: "body",
        });
      },
    });

    return () => {
      cleanupRho();
      cleanupFetch?.();
    };
  }, [region]);

  useEffect(() => {
    const engine = document.getElementById("GNAHSEngine");
    if (!engine) return;

    const onStepLoaded = (ev: Event) => {
      const detail = (ev as CustomEvent<Record<string, unknown>>).detail ?? {};
      pushGnahsStepLoaded(detail);
    };

    engine.addEventListener("GNAHS:step-loaded", onStepLoaded);
    return () => {
      engine.removeEventListener("GNAHS:step-loaded", onStepLoaded);
    };
  }, []);

  return null;
}
