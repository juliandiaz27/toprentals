import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

/** Buscador home: ancho completo, pegado al hero (Figma). */
export function HomeSearchBar({ config }: Props) {
  return (
    <section id="buscador" className="relative z-30 w-full bg-white">
      <div className="home-buscador w-full overflow-visible px-5 py-4 md:px-10 md:py-5">
        <BookingWidget config={config} />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .home-buscador,
            .home-buscador .gnahs-booking-widget,
            .home-buscador .c-booking-widget,
            .home-buscador .c-booking-widget__body,
            .home-buscador .c-booking-widget__container {
              width: 100% !important;
              max-width: none !important;
              overflow: visible !important;
            }
            .home-buscador .c-booking-widget__container {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .home-buscador .c-booking-widget__item {
              position: relative;
              z-index: 1;
            }
            .home-buscador .c-booking-widget__item.is-open,
            .home-buscador .c-booking-widget__item:focus-within {
              z-index: 50;
            }
            .home-buscador [class*="dropdown"],
            .home-buscador [class*="calendar"],
            .home-buscador [class*="popover"],
            .home-buscador [class*="picker"] {
              z-index: 60 !important;
            }
            @media (min-width: 1024px) {
              .home-buscador .c-booking-widget__container {
                flex-wrap: nowrap;
              }
            }
          `,
        }}
      />
    </section>
  );
}
