"use client";

import { useEffect, useRef, useState } from "react";
import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { GNAHS_WIDGET_CSS, GNAHS_WIDGET_JS } from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

/**
 * Buscador GNAHS — alineado con widget.html (defer + onload, sin next/script).
 * La API exige dominio autorizado; en localhost suele responder 401 hasta que GNAHS lo dé de alta.
 */
export function BookingWidget({ config }: Props) {
  const initialized = useRef(false);
  const [apiBlocked, setApiBlocked] = useState(false);

  useEffect(() => {
    const href = GNAHS_WIDGET_CSS;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    initialized.current = false;
    setApiBlocked(false);

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { status?: number } | undefined;
      if (reason?.status === 401) {
        setApiBlocked(true);
      }
    };

    window.addEventListener("unhandledrejection", onRejection);

    const cleanupScript = loadScript(GNAHS_WIDGET_JS, {
      id: "gnahs-booking-widget",
      module: true,
      defer: true,
      crossOrigin: "anonymous",
      onLoad: () => {
        if (initialized.current || !window.GNAHS_BookingWidget) return;
        initialized.current = true;
        new window.GNAHS_BookingWidget({ settings: { ...config } });
      },
      onError: () => setApiBlocked(true),
    });

    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      cleanupScript();
      initialized.current = false;
    };
  }, [config]);

  return (
    <div className="gnahs-booking-widget w-full">
      {apiBlocked && (
        <p
          className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          role="status"
        >
          El buscador no pudo conectar con GNAHS (401). Pedí a GNAHS que autorice este
          dominio (p. ej. <code className="text-xs">localhost:3000</code> en desarrollo
          o tu URL de producción).
        </p>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --booking-color-primary: 42, 42, 42;
              --booking-color-secondary: 217, 217, 217;
            }
          `,
        }}
      />

      <div className="c-booking-widget">
        <div className="c-booking-widget__body">
          <div className="c-booking-widget__container">
            <div
              className="c-booking-widget__item destination-component"
              {...{ "widget-label-destination": "Destinos" }}
            />
            <div className="c-booking-widget__item dates-component dates-component-wrapper" />
            <div className="c-booking-widget__item occupancy-component occupancy-component-container" />
            <div
              className="c-booking-widget__item promo-code"
              {...{ "widget-label-promocode": "Código promo" }}
            />
            <div className="c-booking-widget__item booking-button" />
          </div>
        </div>
      </div>
    </div>
  );
}
