import Link from "next/link";
import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidget";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

export function PropertiesSearchBar({ config }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="properties-search-widget border-b border-neutral-100 px-3 py-3 md:px-4 md:py-4">
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
            .properties-search-widget .c-booking-widget__container {
              flex-wrap: wrap;
              gap: 0.5rem;
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
