/** Overrides para alinear el widget GNAHS v3 con el buscador Top Rentals (Figma). */
export const GNAHS_WIDGET_SKIN_CLASS = "top-rentals-gnahs-search";

export function gnahsWidgetTopRentalsSkinCss(scope = GNAHS_WIDGET_SKIN_CLASS): string {
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

    .${scope} .c-booking-widget__label,
    .${scope} .c-booking-widget__item > label,
    .${scope} .c-booking-widget__item label:first-child,
    .${scope} [class*="label"] {
      display: block !important;
      margin: 0 0 0.5rem !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #121212 !important;
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

    .${scope} .c-booking-widget__item.booking-button button,
    .${scope} .c-booking-widget__item.booking-button [role="button"],
    .${scope} .c-booking-widget__item.booking-button a {
      min-height: 48px !important;
      min-width: 220px !important;
      padding: 0 1.5rem !important;
      border-radius: 8px !important;
      border: none !important;
      background-color: #121212 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      justify-content: center !important;
      gap: 0.5rem !important;
    }

    .${scope} .c-booking-widget__item.booking-button button:hover,
    .${scope} .c-booking-widget__item.booking-button [role="button"]:hover {
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
