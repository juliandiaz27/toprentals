import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

/** Buscador home: widget GNAHS v3 tal cual el snippet del proveedor (sin overrides de diseño). */
export function HomeSearchBar({ config }: Props) {
  return (
    <section
      id="buscador"
      data-reveal
      className="relative z-30 w-full border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-5 md:px-10 md:py-6">
        <BookingWidget config={config} />
      </div>
    </section>
  );
}
