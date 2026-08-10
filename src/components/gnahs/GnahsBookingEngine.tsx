"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  getGnahsEngineConfigForEstablishment,
  GNAHS_FETCH_SCRIPT,
  GNAHS_RHO_INIT_SCRIPT,
  type GnahsEngineRegion,
} from "@/lib/gnahs/config";
import { DEFAULT_SITE_LANGUAGE, type SiteLanguage } from "@/lib/i18n";
import { getUiMessages } from "@/lib/i18n/ui";
import { loadScript } from "@/lib/gnahs/scripts";
import { pushGnahsStepLoaded } from "@/lib/gnahs/tracking";
import { GnahsEngineLoadingSkeleton } from "./GnahsEngineLoadingSkeleton";

const ENGINE_READY_TIMEOUT_MS = 28_000;

type EngineStatus = "loading" | "ready" | "error";

type Props = {
  region?: GnahsEngineRegion;
  establishmentId?: number;
  language?: SiteLanguage;
};

function engineLooksReady(node: HTMLElement): boolean {
  return node.childElementCount > 0 || node.textContent?.trim().length > 20;
}

/**
 * Motor GNAHS en `/reservas`: carga scripts lo antes posible (layout effect),
 * skeleton hasta que el motor pinta contenido, y fallback si falla.
 */
export function GnahsBookingEngine({
  region = "all",
  establishmentId,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {
  const [status, setStatus] = useState<EngineStatus>("loading");
  const cleanupScripts = useRef<(() => void) | null>(null);
  const ui = getUiMessages(language);

  const markReady = useCallback(() => {
    setStatus((current) => (current === "error" ? current : "ready"));
  }, []);

  const bootEngine = useCallback(() => {
    cleanupScripts.current?.();
    cleanupScripts.current = null;
    setStatus("loading");

    window.BookingParams = getGnahsEngineConfigForEstablishment(
      region,
      establishmentId,
      language,
    );

    const engine = document.getElementById("GNAHSEngine");
    if (engine) {
      engine.replaceChildren();
      engine.removeAttribute("data-gnahs-error");
    }

    const cleanupRho = loadScript(GNAHS_RHO_INIT_SCRIPT, {
      id: "gnahs-rho-initial-settings",
      appendTo: "body",
      onLoad: () => {
        if (window.GNAHSGetRhoInitialSettings) {
          new window.GNAHSGetRhoInitialSettings();
        }
        const cleanupFetch = loadScript(GNAHS_FETCH_SCRIPT, {
          id: "gnahs-booking-fetch",
          appendTo: "body",
        });
        cleanupScripts.current = () => {
          cleanupRho();
          cleanupFetch();
        };
      },
      onError: () => setStatus("error"),
    });

    cleanupScripts.current = cleanupRho;
  }, [establishmentId, region, language]);

  useLayoutEffect(() => {
    bootEngine();
  }, [bootEngine]);

  useLayoutEffect(() => {
    const engine = document.getElementById("GNAHSEngine");
    if (!engine) return;

    const onStepLoaded = (ev: Event) => {
      const detail = (ev as CustomEvent<Record<string, unknown>>).detail ?? {};
      pushGnahsStepLoaded(detail);
      markReady();
    };

    engine.addEventListener("GNAHS:step-loaded", onStepLoaded);

    const observer = new MutationObserver(() => {
      if (engineLooksReady(engine)) markReady();
    });
    observer.observe(engine, { childList: true, subtree: true });

    if (engineLooksReady(engine)) markReady();

    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, ENGINE_READY_TIMEOUT_MS);

    return () => {
      engine.removeEventListener("GNAHS:step-loaded", onStepLoaded);
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [markReady, region]);

  useLayoutEffect(() => {
    return () => {
      cleanupScripts.current?.();
      cleanupScripts.current = null;
    };
  }, []);

  return (
    <div className="relative min-h-[520px] w-full">
      {status === "loading" ? <GnahsEngineLoadingSkeleton /> : null}

      {status === "error" ? (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-6 text-center"
          role="alert"
        >
          <p className="text-[15px] font-semibold text-neutral-950">
            {ui.reservas.engineError}
          </p>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-neutral-600">
            {ui.reservas.engineErrorHint}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={bootEngine}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-950 px-5 text-[14px] font-medium text-white hover:bg-neutral-800"
            >
              {ui.reservas.retry}
            </button>
            <a
              href="/contacto"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50"
            >
              {ui.reservas.contact}
            </a>
          </div>
        </div>
      ) : null}

      <div
        id="GNAHSEngine"
        className={`min-h-[520px] w-full transition-opacity duration-500 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
        aria-label={ui.reservas.engineAria}
        aria-hidden={status !== "ready"}
      />
    </div>
  );
}
