/** Overrides para alinear el widget GNAHS v3 con el buscador Top Rentals (Figma). */
export const GNAHS_WIDGET_SKIN_CLASS = "top-rentals-gnahs-search";

export const GNAHS_WIDGET_SKIN_PROPERTY_CLASS = `${GNAHS_WIDGET_SKIN_CLASS}--property`;

export type GnahsWidgetSkinVariant = "default" | "property";

export function gnahsWidgetSkinClass(variant: GnahsWidgetSkinVariant = "default"): string {
  return variant === "property"
    ? `${GNAHS_WIDGET_SKIN_CLASS} ${GNAHS_WIDGET_SKIN_PROPERTY_CLASS}`
    : GNAHS_WIDGET_SKIN_CLASS;
}

export function gnahsWidgetTopRentalsSkinCss(
  scope = GNAHS_WIDGET_SKIN_CLASS,
  variant: GnahsWidgetSkinVariant = "default",
): string {
  return `
    .${scope},
    .${scope} .gnahs-booking-widget,
    .${scope} .c-booking-widget,
    .${scope} .c-booking-widget__body,
    .${scope} .c-booking-widget__container {
      width: 100% !important;
      max-width: none !important;
      overflow: visible !important;
    }

    .${scope} .c-booking-widget__body {
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }

    .${scope} .c-booking-widget__container {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: flex-end !important;
      gap: 1rem 1.25rem !important;
    }

    .${scope} .c-booking-widget__item {
      position: relative;
      flex: 1 1 100%;
      min-width: 0;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
      z-index: 1;
    }

    .${scope} .c-booking-widget__item.is-open,
    .${scope} .c-booking-widget__item:focus-within {
      z-index: 50;
    }

    .${scope} .c-booking-widget__item.promo-code {
      display: none !important;
    }

    .${scope} .c-booking-widget__item.destination-component {
      flex: 1 1 100%;
    }

    @media (min-width: 640px) {
      .${scope} .c-booking-widget__item.destination-component {
        flex: 1 1 calc(50% - 0.625rem);
      }
      .${scope} .c-booking-widget__item.dates-component,
      .${scope} .c-booking-widget__item.occupancy-component {
        flex: 1 1 calc(50% - 0.625rem);
      }
    }

    @media (min-width: 1024px) {
      .${scope} .c-booking-widget__container {
        display: grid !important;
        grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto;
        gap: 1.25rem !important;
        align-items: end !important;
      }
      .${scope} .c-booking-widget__item {
        flex: none !important;
      }
      .${scope} .c-booking-widget__item.booking-button {
        justify-self: end;
      }
    }

    ${
      variant === "property"
        ? `
    @media (min-width: 1024px) {
      .${GNAHS_WIDGET_SKIN_PROPERTY_CLASS} .c-booking-widget__container {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto !important;
      }
      .${GNAHS_WIDGET_SKIN_PROPERTY_CLASS} .c-booking-widget__item.dates-component {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 1rem !important;
        grid-column: span 2;
      }
    }
    `
        : ""
    }

  /* Labels de campos (GNAHS); no aplicar al botón de reserva */
    .${scope} .destination-component__name,
    .${scope} .dates-component-wrapper .check-name,
    .${scope} .occupancy-component-container .occupancy-name,
    .${scope} .promo-code__name {
      display: block !important;
      margin: 0 0 0.5rem !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #121212 !important;
    }

    .${scope} .c-booking-widget__resume {
      display: none !important;
    }

    .${scope} .c-booking-widget__input,
    .${scope} .c-booking-widget__input-wrapper,
    .${scope} .c-booking-widget__field,
    .${scope} .c-booking-widget__item button,
    .${scope} .c-booking-widget__item [role="button"],
    .${scope} .c-booking-widget__item input,
    .${scope} .c-booking-widget__item select,
    .${scope} .c-input,
    .${scope} .c-input__wrapper {
      min-height: 48px !important;
      border-radius: 8px !important;
      border: none !important;
      background-color: #f5f5f5 !important;
      box-shadow: none !important;
      font-size: 15px !important;
      color: #171717 !important;
    }

    .${scope} .c-booking-widget__item button,
    .${scope} .c-booking-widget__item [role="button"] {
      width: 100% !important;
      justify-content: space-between !important;
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }

    .${scope} .c-booking-widget__container > .c-booking-widget__item.booking-button button,
    .${scope} .c-booking-widget__container > .c-booking-widget__item.booking-button .c-button {
      min-height: 48px !important;
      min-width: 220px !important;
      padding: 0 1.5rem !important;
      border-radius: 8px !important;
      border: none !important;
      background-color: #121212 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 1.25 !important;
      letter-spacing: 0.01em !important;
      text-transform: none !important;
      white-space: nowrap !important;
      justify-content: center !important;
      gap: 0 !important;
    }

    .${scope} .c-booking-widget__container > .c-booking-widget__item.booking-button button ~ button {
      display: none !important;
    }

    .${scope} .c-booking-widget__container > .c-booking-widget__item.booking-button button:hover,
    .${scope} .c-booking-widget__container > .c-booking-widget__item.booking-button .c-button:hover {
      background-color: #2a2a2a !important;
    }

    .${scope} .dates-component-wrapper .c-booking-widget__input-wrapper,
    .${scope} .dates-component-wrapper .c-input__wrapper {
      background-color: #f5f5f5 !important;
    }

    .${scope} [class*="dropdown"],
    .${scope} [class*="calendar"],
    .${scope} [class*="popover"],
    .${scope} [class*="picker"],
    .${scope} [class*="menu"] {
      z-index: 60 !important;
    }
  `;
}
