"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { RealEstateProject } from "@/lib/pageContent/realEstateTypes";

type Props = {
  title: string;
  subtitle: string;
  closing: string;
  projects: RealEstateProject[];
};

function badgeClasses(variant: RealEstateProject["badgeVariant"]): string {
  switch (variant) {
    case "obra":
      return "bg-[#F5C518] text-neutral-950";
    case "emblematic":
      return "bg-neutral-950 text-white";
    default:
      return "bg-white/90 text-neutral-950";
  }
}

function ProjectDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="text-[14px] leading-relaxed text-neutral-600">
      <span className="font-semibold text-neutral-800">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export function RealEstateProjects({
  title,
  subtitle,
  closing,
  projects,
}: Props) {
  const { ui } = useLanguage();
  if (projects.length === 0) return null;

  return (
    <section
      id="oportunidades"
      data-reveal
      className="scroll-mt-24 bg-white px-6 py-14 lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight text-neutral-950">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600 lg:text-base">
            {subtitle}
          </p>
        ) : null}

        <ul className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {projects.map((project) => {
            const showBrochure =
              project.brochureHref && project.brochureLabel;

            return (
              <li key={project.id} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
                  <Image
                    src={project.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {project.badge ? (
                    <span
                      className={`absolute left-4 top-4 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(project.badgeVariant)}`}
                    >
                      {project.badge}
                    </span>
                  ) : null}
                  {showBrochure ? (
                    <Link
                      href={project.brochureHref}
                      className="absolute bottom-4 right-4 rounded bg-neutral-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-neutral-800"
                      {...(project.brochureHref.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {project.brochureLabel}
                    </Link>
                  ) : null}
                </div>
                <h3 className="mt-5 text-xl font-bold text-neutral-950">
                  {project.name}
                </h3>
                <div className="mt-3 space-y-1.5">
                  <ProjectDetailRow
                    label={ui.realEstate.location}
                    value={project.address}
                  />
                  <ProjectDetailRow
                    label={ui.realEstate.neighborhood}
                    value={project.barrio}
                  />
                  <ProjectDetailRow
                    label={ui.realEstate.units}
                    value={project.units}
                  />
                  <ProjectDetailRow
                    label={ui.realEstate.typologies}
                    value={project.typologies}
                  />
                  <ProjectDetailRow
                    label={ui.realEstate.role}
                    value={project.role}
                  />
                  <ProjectDetailRow
                    label={ui.realEstate.differentials}
                    value={project.differentials}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {closing ? (
          <p className="mx-auto mt-10 max-w-3xl text-center text-[14px] leading-relaxed text-neutral-600">
            {closing}
          </p>
        ) : null}
      </div>
    </section>
  );
}
