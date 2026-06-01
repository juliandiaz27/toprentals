import type { Metadata } from "next";
import { MyBooking } from "@/components/gnahs/MyBooking";
import { getGnahsMyBookingConfig } from "@/lib/gnahs/config";

export const metadata: Metadata = {
  title: "Mis reservas | Top Rentals",
  description: "Consultá y gestioná tus reservas en Top Rentals",
};

function MyBookingParamsScript() {
  const config = getGnahsMyBookingConfig();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.GNAHS_MyBooking = ${JSON.stringify(config)};`,
      }}
    />
  );
}

export default function MisReservasPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="sr-only">Mis reservas</h1>
      <MyBookingParamsScript />
      <div
        id="GNAHS-my-booking"
        className="min-h-[480px] w-full"
        aria-label="Mis reservas"
      />
      <MyBooking />
    </main>
  );
}
