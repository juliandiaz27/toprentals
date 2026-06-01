"use client";

import { useEffect, useRef, useState } from "react";
import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { GNAHS_WIDGET_CSS, GNAHS_WIDGET_JS } from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";
import { isLocalDevHost, probeWidgetApi } from "@/lib/gnahs/widgetProbe";
import { BookingWidgetFallback } from "./BookingWidgetFallback";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

const WIDGET_ROOT_SELECTOR = ".c-booking-widget";
const INIT_RETRIES = 20;
const INIT_RETRY_MS = 50;

function isGnahsWidgetFailure(reason: unknown): boolean {
  if (reason && typeof reason === "object" && "status" in reason) {
    const status = (reason as { status?: number }).status;
    if (status === 401 || status === 403) return true;
  }
  const text =
    reason instanceof Error
      ? `${reason.message}\n${reason.stack ?? ""}`
      : String(reason ?? "");
  return (
    /cannot read properties of undefined/i.test(text) ||
    /hasLevels/i.test(text) ||
    /gnahs/i.test(text)
  );
}

/**
 * Buscador GNAHS — solo cliente; markup `.c-booking-widget` (no #GNAHSEngine).
 * En local sin dominio autorizado muestra fallback sin romper la app.
 */
export function BookingWidget({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const widgetInstance = useRef<unknown>(null);

  const [mounted, setMounted] = useState(false);
  const [apiBlocked, setApiBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const href = GNAHS_WIDGET_CSS;
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || apiBlocked) return;

    let cancelled = false;
    let cleanupScript: (() => void) | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const blockWidget = () => {
      if (!cancelled) {
        setApiBlocked(true);
        setLoading(false);
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isGnahsWidgetFailure(event.reason)) {
        blockWidget();
      }
    };

    const onWindowError = (event: ErrorEvent) => {
      const src = event.filename ?? "";
      const msg = event.message ?? "";
      if (
        src.includes("gnahs.com") ||
        src.includes("booking-widget") ||
        isGnahsWidgetFailure(msg) ||
        isGnahsWidgetFailure(event.error)
      ) {
        blockWidget();
      }
    };

    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onWindowError);

    const tryInitWidget = (attempt = 0): void => {
      if (cancelled || initialized.current || apiBlocked) return;

      const root = containerRef.current?.querySelector(WIDGET_ROOT_SELECTOR);
      const container = root?.querySelector(".c-booking-widget__container");
      if (!root || !container) {
        if (attempt < INIT_RETRIES) {
          retryTimer = setTimeout(
            () => tryInitWidget(attempt + 1),
            INIT_RETRY_MS,
          );
        } else {
          blockWidget();
        }
        return;
      }

      if (!window.GNAHS_BookingWidget) {
        blockWidget();
        return;
      }

      try {
        initialized.current = true;
        widgetInstance.current = new window.GNAHS_BookingWidget({
          settings: { ...config },
        });
        setLoading(false);
      } catch (error) {
        initialized.current = false;
        widgetInstance.current = null;
        if (isGnahsWidgetFailure(error)) {
          blockWidget();
        } else {
          console.error("[GNAHS] Error al inicializar el widget", error);
          blockWidget();
        }
      }
    };

    const start = async () => {
      setLoading(true);
      initialized.current = false;

      if (isLocalDevHost()) {
        const available = await probeWidgetApi(config.apiUrl, config.uuid);
        if (!available) {
          blockWidget();
          return;
        }
      }

      if (cancelled) return;

      cleanupScript = loadScript(GNAHS_WIDGET_JS, {
        id: "gnahs-booking-widget",
        module: true,
        defer: true,
        crossOrigin: "anonymous",
        appendTo: "body",
        onLoad: () => tryInitWidget(0),
        onError: () => blockWidget(),
      });
    };

    void start();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onWindowError);
      cleanupScript?.();
      initialized.current = false;
      widgetInstance.current = null;
    };
  }, [mounted, apiBlocked, config]);

  if (!mounted || loading) {
    return (
      <div ref={containerRef} className="gnahs-booking-widget w-full">
        <WidgetMarkup />
        <div
          className="min-h-[52px] w-full animate-pulse rounded-md bg-neutral-100"
          aria-hidden
        />
      </div>
    );
  }

  if (apiBlocked) {
    return (
      <div ref={containerRef} className="gnahs-booking-widget w-full">
        <BookingWidgetFallback bookingRoute={config.bookingRoute} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="gnahs-booking-widget w-full">
      <WidgetMarkup />
    </div>
  );
}

function WidgetMarkup() {
  return (
    <>
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
    </>
  );
}
