import { FormattedText } from "@/components/content/FormattedText";
import { AgenciesModule } from "@/components/gnahs/AgenciesModule";
import type { CorporateAccessContent } from "@/lib/pageContent/corporateTypes";
import { CorporateAccessForm } from "./CorporateAccessForm";

type Props = { content: CorporateAccessContent };

export function CorporateAccess({ content }: Props) {
  return (
    <section
      id="acceso-corporativo"
      className="scroll-mt-24 bg-[#111111] px-6 py-16 text-white lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight"
        >
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[2fr_3fr] lg:items-stretch lg:gap-8">
          <div
            id="acceso-agencias"
            data-reveal
            data-reveal-delay="80"
            className="scroll-mt-24 flex min-w-0 flex-col rounded-lg bg-[#2a2a2a] px-4 py-6 lg:px-6 lg:py-8"
          >
            <p className="text-[15px] font-semibold text-white">
              {content.loginQuestion}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#AAAAAA]">
              {content.loginDescription}
            </p>
            <div className="mt-6 min-w-0 flex-1">
              <AgenciesModule />
            </div>
          </div>

          <div data-reveal data-reveal-delay="160" className="min-w-0">
            <CorporateAccessForm content={content} />
          </div>
        </div>
      </div>
    </section>
  );
}
