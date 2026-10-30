import type { Metadata } from "next";
import { AgenciesModule } from "@/components/gnahs/AgenciesModule";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: "/agencias", title: "Agencias", description: "Acceso para agencias de viaje — Top Rentals", noindex: true });
}

export default function AgenciasPage() {
  return (
    <main data-reveal className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
        Agencias
      </h1>
      <AgenciesModule />
    </main>
  );
}
