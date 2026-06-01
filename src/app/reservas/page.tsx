import type { Metadata } from "next";
import { BookingEngine } from "@/components/gnahs/BookingEngine";
import { getGnahsEngineConfig } from "@/lib/gnahs/config";

export const metadata: Metadata = {
  title: "Reservas | Top Rentals",
  description: "Reservá tu estadía en Top Rentals",
};

/** BookingParams en HTML antes de los scripts GNAHS (igual que la guía oficial). */
function BookingParamsScript() {
  const params = getGnahsEngineConfig();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.BookingParams = ${JSON.stringify(params)};`,
      }}
    />
  );
}

export default function ReservasPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <BookingParamsScript />
      <div id="GNAHSEngine" className="min-h-[480px] w-full" aria-label="Motor de reservas" />
      <BookingEngine />
    </main>
  );
}
