"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { GnahsWidgetConfig } from "@/lib/gnahs/config";
import { GNAHS_WIDGET_CSS, GNAHS_WIDGET_JS } from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";
import { buildGnahsBookingUrl, defaultCheckinCheckout } from "@/lib/gnahs/buildBookingUrl";
import { BookingWidgetFallback } from "./BookingWidgetFallback";

type WidgetConfig = GnahsWidgetConfig;

export type BookingWidgetLabels = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  occupancy?: string;
  promoCode?: string;
  booking?: string;
};

type Props = {
  config: WidgetConfig;
  /** Oculta código promo (home / propiedades). */
  hidePromo?: boolean;
  /** Ficha de propiedad: sin selector de torre (ya va fijada en `establishments`). */
  hideDestination?: boolean;
  /** Torre fija para el enlace de fallback del motor. */
  establishmentId?: number;
  labels?: BookingWidgetLabels;
};

const WIDGET_ROOT_SELECTOR = ".c-booking-widget";
const INIT_RETRIES = 60;
const INIT_RETRY_MS = 50;

type GnahsWidgetInstance = {
  $destination?: { setDestination: (destination: unknown) => void };
  configuration?: { destinations?: unknown[] };
};

function preselectWidgetDestination(
  widget: GnahsWidgetInstance | null | undefined,
): void {
  const destination = widget?.configuration?.destinations?.[0];
  if (destination && widget?.$destination?.setDestination) {
    widget.$destination.setDestination(destination);
  }
}

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
    /hasLevels/i.test(text)
  );
}

/** Etiquetas del snippet oficial `docs/gnahs-snippets/widget.html`. */
const GNAHS_WIDGET_LABELS_ES: BookingWidgetLabels = {
  destination: "Destinos",
  checkIn: "Fecha de entrada",
  checkOut: "Fecha de salida",
  occupancy: "Habitaciones y personas",
  promoCode: "Código promocional",
  booking: "Reservar",
};

const GNAHS_WIDGET_LABELS_EN: BookingWidgetLabels = {
  destination: "Destinations",
  checkIn: "Check-in",
  checkOut: "Check-out",
  occupancy: "Rooms and guests",
  promoCode: "Promo code",
  booking: "Book now",
};

/**
 * Buscador GNAHS — markup `.c-booking-widget` (no #GNAHSEngine).
 * El contenedor debe permanecer estable; GNAHS monta sobre los placeholders del markup.
 */
export function BookingWidget({
  config,
  hidePromo = false,
  hideDestination = false,
  establishmentId,
  labels,
}: Props) {
  const resolvedLabels =
    labels ??
    (config.language === "en" ? GNAHS_WIDGET_LABELS_EN : GNAHS_WIDGET_LABELS_ES);
  const containerRef = useRef<HTMLDivElement>(null);
  const bootId = useRef(0);

  const [apiBlocked, setApiBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const configKey = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    setLoading(true);
    setApiBlocked(false);
  }, [configKey]);

  const fallbackBookingRoute = useMemo(() => {
    if (!establishmentId) return config.bookingRoute;
    const { checkin, checkout } = defaultCheckinCheckout();
    return buildGnahsBookingUrl({
      checkin,
      checkout,
      adults: 2,
      establishmentId,
      bookingRoute: config.bookingRoute,
    });
  }, [config.bookingRoute, establishmentId]);

  useEffect(() => {
    const href = GNAHS_WIDGET_CSS;
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  useLayoutEffect(() => {
    if (apiBlocked) return;

    const boot = ++bootId.current;
    let cancelled = false;
    let cleanupScript: (() => void) | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const isStale = () => cancelled || boot !== bootId.current;

    const blockWidget = () => {
      if (!isStale()) {
        setApiBlocked(true);
        setLoading(false);
      }
    };

    const tryInitWidget = (attempt = 0): void => {
      if (isStale()) return;

      const root = containerRef.current?.querySelector(WIDGET_ROOT_SELECTOR);
      const container = root?.querySelector(".c-booking-widget__container");
      const hasPlaceholders =
        (container?.querySelectorAll(".c-booking-widget__item").length ?? 0) > 0;

      if (!root || !container || !hasPlaceholders) {
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

      try {
        if (isStale()) return;
        const widget = new window.GNAHS_BookingWidget!({
          settings: { ...config },
        });

        if (hideDestination && establishmentId) {
          const rootEl = containerRef.current?.querySelector(WIDGET_ROOT_SELECTOR);
          const onInitWidget = () => preselectWidgetDestination(widget);
          rootEl?.addEventListener("initWidget", onInitWidget, { once: true });
          onInitWidget();
        }

        if (!isStale()) setLoading(false);
      } catch (error) {
        if (isGnahsWidgetFailure(error) && attempt >= INIT_RETRIES - 1) {
          blockWidget();
        } else if (attempt < INIT_RETRIES) {
          retryTimer = setTimeout(
            () => tryInitWidget(attempt + 1),
            INIT_RETRY_MS,
          );
        } else {
          console.error("[GNAHS] Error al inicializar el widget", error);
          blockWidget();
        }
      }
    };

    const start = () => {
      setLoading(true);
      setApiBlocked(false);

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
      cleanupScript?.();
    };
  }, [apiBlocked, config, configKey, establishmentId, hideDestination]);

  return (
    <div ref={containerRef} className="gnahs-booking-widget w-full">
      {apiBlocked ? (
        <BookingWidgetFallback bookingRoute={fallbackBookingRoute} />
      ) : (
        <div key={configKey}>
          <WidgetMarkup
            hidePromo={hidePromo}
            hideDestination={hideDestination}
            labels={resolvedLabels}
          />
          {loading ? (
            <p
              className="mt-3 flex min-h-[52px] items-center gap-2 text-[13px] text-neutral-500"
              role="status"
            >
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800"
                aria-hidden
              />
              {config.language === "en" ? "Loading search…" : "Cargando buscador…"}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function WidgetMarkup({
  hidePromo,
  hideDestination,
  labels,
}: {
  hidePromo: boolean;
  hideDestination: boolean;
  labels: BookingWidgetLabels;
}) {
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
            {hideDestination ? null : (
              <div
                className="c-booking-widget__item destination-component"
                {...{
                  "widget-label-destination":
                    labels.destination ?? "Destinos",
                }}
              />
            )}
            <div
              className="c-booking-widget__item dates-component dates-component-wrapper"
              {...{
                "widget-label-check-in": labels.checkIn ?? "Fecha de entrada",
                "widget-label-check-out": labels.checkOut ?? "Fecha de salida",
              }}
            />
            <div
              className="c-booking-widget__item occupancy-component occupancy-component-container"
              {...{
                "widget-label-occupancy":
                  labels.occupancy ?? "Habitaciones y personas",
              }}
            />
            {hidePromo ? null : (
              <div
                className="c-booking-widget__item promo-code"
                {...{
                  "widget-label-promocode":
                    labels.promoCode ?? "Código promocional",
                }}
              />
            )}
            <div
              className="c-booking-widget__item booking-button"
              {...{
                "widget-label-booking": labels.booking ?? "Reservar",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
