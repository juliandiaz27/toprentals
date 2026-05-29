import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { getNested } from "@/lib/pageContent/nested";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("corporate");
  const title = String(
    getNested(content, "hero.title") ?? "Soluciones corporativas",
  );
  return { title: `${title} | Top Rentals` };
}

export default async function CorporatePage() {
  const content = await readPageContent("corporate");
  const title = String(
    getNested(content, "hero.title") ?? "Soluciones corporativas",
  );
  const subtitle = String(getNested(content, "hero.subtitle") ?? "");
  const body = String(getNested(content, "body.content") ?? "");
  const imageSrc = String(
    getNested(content, "hero.imageSrc") ?? "/images/placeholders/page-hero.svg",
  );

  return (
    <main>
      <section className="relative min-h-[280px] bg-neutral-900 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-lg text-neutral-200">
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16">
        {body ? (
          <div className="whitespace-pre-wrap text-neutral-700">{body}</div>
        ) : (
          <p className="text-neutral-600">
            Contenido corporativo — editable desde el panel{" "}
            <code className="text-sm">/admin/paginas/corporate</code>.
          </p>
        )}
      </section>
    </main>
  );
}
