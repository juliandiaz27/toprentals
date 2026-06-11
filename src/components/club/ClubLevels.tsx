import { FormattedText } from "@/components/content/FormattedText";
import { CLUB_GOLD } from "@/lib/pageContent/clubTheme";
import type { ClubLevelTier } from "@/lib/pageContent/clubTypes";

type Props = {
  title: string;
  subtitle: string;
  tiers: ClubLevelTier[];
};

const tierStyles: Record<
  ClubLevelTier["variant"],
  { card: string; tag: string }
> = {
  silver: {
    card: "border-neutral-600",
    tag: "bg-neutral-700 text-white",
  },
  gold: {
    card: "border-2",
    tag: "text-neutral-950",
  },
  platinum: {
    card: "border-white",
    tag: "bg-white text-neutral-950",
  },
};

export function ClubLevels({ title, subtitle, tiers }: Props) {
  return (
    <section className="bg-[#111111] px-6 py-14 text-white lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <div data-reveal className="text-left">
          <h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
            <FormattedText value={title} as="inline" />
          </h2>
          <FormattedText
            value={subtitle}
            className="mt-3 block text-[15px] text-[#AAAAAA]"
          />
        </div>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier, index) => {
            const style = tierStyles[tier.variant];
            const goldBorder =
              tier.variant === "gold" ? { borderColor: CLUB_GOLD } : undefined;
            const goldTag =
              tier.variant === "gold" ? { backgroundColor: CLUB_GOLD } : undefined;
            return (
              <li
                key={tier.id}
                data-reveal
                data-reveal-delay={String(80 + index * 50)}
                className={`flex flex-col rounded-xl border bg-[#1f1f1f] px-6 py-8 ${style.card}`}
                style={goldBorder}
              >
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wide ${style.tag}`}
                  style={goldTag}
                >
                  <FormattedText value={tier.name} as="inline" />
                </span>
                <FormattedText
                  value={tier.requirement}
                  className="mt-4 block text-[14px] text-[#AAAAAA]"
                />
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[14px] leading-snug">
                  {tier.benefits.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span style={{ color: CLUB_GOLD }} aria-hidden>
                        •
                      </span>
                      <FormattedText value={item} as="inline" />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
