"use client";

import Link from "next/link";
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

  if (apiBlocked) {
    return (
      <div className="py-2 text-center" role="status">
        <p className="text-sm text-neutral-600">
          Buscador temporalmente no disponible en este dominio.
        </p>
        <Link
          href={config.bookingRoute}
          className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Ir al motor de reservas
        </Link>
      </div>
    );
  }

  return (
    <div className="gnahs-booking-widget w-full">
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
            <div
              className="c-booking-widget__item dates-component dates-component-wrapper"
              {...{
                "widget-label-check-in": "Fecha de entrada",
                "widget-label-check-out": "Fecha de salida",
              }}
            />
            <div
              className="c-booking-widget__item occupancy-component occupancy-component-container"
              {...{ "widget-label-occupancy": "Habitaciones y personas" }}
            />
            <div
              className="c-booking-widget__item promo-code"
              {...{ "widget-label-promocode": "Código promo" }}
            />
            <div
              className="c-booking-widget__item booking-button"
              {...{ "widget-label-booking": "Reservar" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
