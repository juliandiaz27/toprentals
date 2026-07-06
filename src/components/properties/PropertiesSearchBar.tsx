import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
};

export function PropertiesSearchBar({ config }: Props) {
  return (
    <section className="relative z-30 bg-white">
      <div className="relative z-40 mx-auto w-full max-w-[1440px] overflow-visible px-5 py-5 md:px-10 md:py-6">
        <BookingWidget key={config.language} config={config} />
      </div>
    </section>
  );
}
