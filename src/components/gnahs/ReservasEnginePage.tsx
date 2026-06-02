import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { SiteHeader } from "@/components/home/SiteHeader";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { BookingEngine } from "@/components/gnahs/BookingEngine";
import {
  getGnahsEngineConfig,
  type GnahsEngineRegion,
} from "@/lib/gnahs/config";

type Props = {
  region: GnahsEngineRegion;
  title: string;
  description: string;
};

export function buildReservasMetadata({
  title,
  description,
}: Pick<Props, "title" | "description">): Metadata {
  return { title, description };
}

function BookingParamsScript({ region }: { region: GnahsEngineRegion }) {
  const params = getGnahsEngineConfig(region);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.BookingParams = ${JSON.stringify(params)};`,
      }}
    />
  );
}

export async function ReservasEnginePage({
  region,
  title,
  description,
}: Props) {
  const homeContent = await readPageContent("home");
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} activeHref="/reservas" />
      <main className="flex-1 bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
          <header className="mb-8 max-w-3xl" data-reveal>
            <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
              {title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {description}
            </p>
          </header>
          <BookingParamsScript region={region} />
          <div data-reveal data-reveal-delay="80">
            <div
              id="GNAHSEngine"
              className="min-h-[520px] w-full"
              aria-label="Motor de reservas"
            />
            <BookingEngine region={region} />
          </div>
        </div>
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
