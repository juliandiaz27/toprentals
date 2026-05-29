"use client";

import { useEffect } from "react";
import { GNAHS_METASEARCH_TRACKER } from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

/**
 * Script de metabuscadores — debe estar en todo el sitio (head).
 * @see https://docs.gnahs.com/2.0/booking-engine/basic-integration-booking-engine
 */
export function GnahsMetasearchTracker() {
  useEffect(() => {
    return loadScript(GNAHS_METASEARCH_TRACKER, {
      id: "gnahs-metasearch-tracker",
      defer: true,
    });
  }, []);

  return null;
}
