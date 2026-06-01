/**
 * Tracking del motor RHO — evento GNAHS:step-loaded → dataLayer (GTM).
 * @see https://docs.gnahs.com/2.0/tracking/booking-engine-tracking
 */
export function pushGnahsStepLoaded(detail: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "GNAHS:step-loaded",
    data: detail,
  });

  if (process.env.NODE_ENV === "development") {
    console.debug("[GNAHS] step-loaded → dataLayer", detail);
  }
}
