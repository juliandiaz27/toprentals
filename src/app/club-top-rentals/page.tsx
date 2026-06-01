import type { Metadata } from "next";
import { LoyaltyModule } from "@/components/gnahs/LoyaltyModule";

export const metadata: Metadata = {
  title: "Club Top Rentals",
  description: "Programa de fidelización Top Rentals",
};

export default function ClubTopRentalsPage() {
  return (
    <main data-reveal className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
        Club Top Rentals
      </h1>
      <LoyaltyModule />
    </main>
  );
}
