export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    BookingParams?: {
      uuid: string;
      establishments: number[];
      language: string;
      api: string;
      assets: string;
    };
    GNAHS_MyBooking?: {
      url: string;
      locale: string;
    };
    GNAHS_Agencies?: {
      uuid: string;
      locale: string;
      establishments?: number[];
    };
    GNAHS_Loyalty?: {
      uuid: string;
      locale: string;
      establishments?: number[];
    };
    GNAHSGetRhoInitialSettings?: new () => void;
    GNAHS_BookingWidget?: new (options: {
      settings: Record<string, unknown>;
    }) => void;
  }

  interface HTMLElementEventMap {
    "GNAHS:step-loaded": CustomEvent<Record<string, unknown>>;
  }
}
