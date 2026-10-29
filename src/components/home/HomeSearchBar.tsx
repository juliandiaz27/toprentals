import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import type { PropertyListing } from "@/lib/properties/catalog";
import { HomeBookingSearch } from "./HomeBookingSearch";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
  listings: PropertyListing[];
};

/**
 * Buscador home con diseño Figma. GNAHS no permite cambiar la estructura de su widget,
 * así que el formulario es propio y redirige al motor con sus parámetros GET
 * (checkin, checkout, rooms, room1_adults — docs.gnahs.com/2.0/widget/booking-engine).
 */
export function HomeSearchBar({ config, listings }: Props) {
  return (
    <section
      id="buscador"
      data-reveal
      className="relative z-30 w-full border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 md:px-10 lg:px-16 lg:py-5">
        <HomeBookingSearch
          listings={listings}
          bookingRoute={config.bookingRoute}
          language={config.language === "en" ? "en" : "es"}
        />
      </div>
    </section>
  );
}
