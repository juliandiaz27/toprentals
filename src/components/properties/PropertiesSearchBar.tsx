import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

export function PropertiesSearchBar({ config }: Props) {
  return (
    <section className="relative z-30 bg-white">
      <div className="properties-search-widget relative z-40 mx-auto w-full max-w-[1440px] overflow-visible px-5 py-5 md:px-10 md:py-6">
        <BookingWidget config={config} />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .properties-search-widget,
            .properties-search-widget .gnahs-booking-widget,
            .properties-search-widget .c-booking-widget,
            .properties-search-widget .c-booking-widget__body,
            .properties-search-widget .c-booking-widget__container {
              width: 100% !important;
              max-width: none !important;
              overflow: visible !important;
            }
            .properties-search-widget .c-booking-widget__container {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .properties-search-widget .c-booking-widget__item {
              position: relative;
              z-index: 1;
            }
            .properties-search-widget .c-booking-widget__item.is-open,
            .properties-search-widget .c-booking-widget__item:focus-within {
              z-index: 50;
            }
            .properties-search-widget [class*="dropdown"],
            .properties-search-widget [class*="calendar"],
            .properties-search-widget [class*="popover"],
            .properties-search-widget [class*="picker"] {
              z-index: 60 !important;
            }
            @media (min-width: 1024px) {
              .properties-search-widget .c-booking-widget__container {
                flex-wrap: nowrap;
              }
            }
          `,
        }}
      />
    </section>
  );
}
