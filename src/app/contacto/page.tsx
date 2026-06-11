import type { Metadata } from "next";
import Link from "next/link";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickContactoPage } from "@/lib/pageContent/contactoTypes";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { FormattedText } from "@/components/content/FormattedText";
import { SiteHeader } from "@/components/home/SiteHeader";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("contacto");
  const page = pickContactoPage(content);
  return { title: `${page.title} | Top Rentals` };
}

export default async function ContactoPage() {
  const [contactoContent, homeContent] = await Promise.all([
    readPageContent("contacto"),
    readPageContent("home"),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickContactoPage(contactoContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} variant="muted" activeHref="/contacto" />
      <main className="bg-white">
        <div
          data-reveal
          className="mx-auto w-full max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20"
        >
          <header className="max-w-2xl">
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-neutral-950">
              <FormattedText value={page.title} as="inline" />
            </h1>
            <FormattedText
              value={page.subtitle}
              className="mt-4 text-base leading-relaxed text-neutral-600 lg:text-lg"
            />
          </header>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:max-w-3xl">
            <div className="rounded-xl border border-neutral-200 bg-[#F8F8F8] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Email
              </h2>
              <a
                href={`mailto:${page.email}`}
                className="mt-2 block text-lg font-medium text-neutral-950 underline-offset-2 hover:underline"
              >
                {page.email}
              </a>
            </div>

            {whatsapp ? (
              <div className="rounded-xl border border-neutral-200 bg-[#F8F8F8] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  {page.whatsappLabel}
                </h2>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-lg font-medium text-[#25D366] underline-offset-2 hover:underline"
                >
                  Chatear por WhatsApp →
                </a>
              </div>
            ) : null}

            <div className="rounded-xl border border-neutral-200 bg-[#F8F8F8] p-6 sm:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {page.officesTitle}
              </h2>
              <ul className="mt-3 space-y-2 text-[15px] text-neutral-800">
                <li>{page.officeBa}</li>
                <li>{page.officeEc}</li>
              </ul>
            </div>
          </div>

          <p className="mt-12 text-[15px] text-neutral-600">
            ¿Querés reservar ahora?{" "}
            <Link href="/reservas" className="font-semibold text-neutral-950 hover:underline">
              Ir al motor de reservas
            </Link>
          </p>
        </div>
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
