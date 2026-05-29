import type { Metadata } from "next";
import { MyBooking } from "@/components/gnahs/MyBooking";

export const metadata: Metadata = {
  title: "Mis reservas | Top Rentals",
  description: "Consultá y gestioná tus reservas en Top Rentals",
};

export default function MisReservasPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="sr-only">Mis reservas</h1>
      <MyBooking />
    </main>
  );
}
