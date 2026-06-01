import Link from "next/link";
import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

export function PropertiesSearchBar({ config }: Props) {
  return (
    <div className="relative z-40 overflow-visible rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="properties-search-widget relative overflow-visible border-b border-neutral-100 px-3 py-3 md:px-4 md:py-4">
        <BookingWidget config={config} />
      </div>
      <div className="flex justify-end border-t border-neutral-100 px-4 py-3 md:hidden">
        <Link
          href={config.bookingRoute}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-950 px-5 text-[14px] font-medium text-white"
        >
          Buscar →
        </Link>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .properties-search-widget,
            .properties-search-widget .c-booking-widget,
            .properties-search-widget .c-booking-widget__body,
            .properties-search-widget .c-booking-widget__container {
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
    </div>
  );
}
