import type { Metadata } from "next";
import Link from "next/link";
import { readPageContent } from "@/lib/pageContent/storage";
import { getNested } from "@/lib/pageContent/nested";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("propiedades");
  const title = String(getNested(content, "hero.title") ?? "Propiedades");
  return { title: `${title} | Top Rentals` };
}

export default async function PropiedadesPage() {
  const content = await readPageContent("propiedades");
  const title = String(getNested(content, "hero.title") ?? "Propiedades");
  const subtitle = String(getNested(content, "hero.subtitle") ?? "");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
      {subtitle ? (
        <p className="mt-3 text-lg text-neutral-600">{subtitle}</p>
      ) : null}
      <p className="mt-6 text-neutral-600">
        Consultá disponibilidad y tarifas en nuestro motor de reservas.
      </p>
      <Link
        href="/reservas"
        className="mt-8 inline-block rounded bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Ir a reservar
      </Link>
    </main>
  );
}
