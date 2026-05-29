import type { Metadata } from "next";
import { BookingEngine } from "@/components/gnahs/BookingEngine";

export const metadata: Metadata = {
  title: "Reservas | Top Rentals",
  description: "Reservá tu estadía en Top Rentals",
};

export default function ReservasPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <BookingEngine />
    </main>
  );
}
