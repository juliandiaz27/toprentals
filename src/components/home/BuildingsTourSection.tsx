"use client";

import { useRef, useState } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeBuildingsContent } from "@/lib/pageContent/homeTypes";
import { resolveBuildingsVideoSrc } from "@/lib/pageContent/homeTypes";
import { BrandArch } from "@/components/brand/BrandShapes";

type Props = {
  content: HomeBuildingsContent;
};

function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

/**
 * Vector "Nuestros edificios" exportado del Figma (2142×770, frame de 1440 en x=259).
 * Se centra respecto del frame, así los arcos quedan alineados con el video.
 */
function BuildingsBand({ className }: { className?: string }) {
  return (
    <svg viewBox="-259 0 2142 770" fill="currentColor" className={className} aria-hidden>
      <path d="M1218.45 770H1599.06C1755.87 770 1883 642.779 1883 485.861V284.139C1883 127.222 1755.87 0 1599.06 0H1218.45C1190.86 0 1168.5 22.378 1168.5 49.983V284.139C1168.5 127.222 1041.37 0 884.559 0H503.953C476.367 0 454.005 22.378 454.005 49.983V254.966C439.404 111.739 318.513 0 171.554 0H-209.052C-236.638 0 -259 22.378 -259 49.983V719.993C-259 747.598 -236.638 769.975 -209.052 769.975H1218.45V770Z" />
    </svg>
  );
}

export function BuildingsTourSection({ content }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const videoSrc = resolveBuildingsVideoSrc(content);
  const hasVideo = Boolean(videoSrc);
  const hasPoster =
    Boolean(content.posterSrc) && !content.posterSrc.includes("placeholders");

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <section data-reveal className="relative bg-white pt-16 text-tr-ink lg:pt-20">
      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-16">
        <header className="text-center">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.5rem)]">
            <FormattedText value={content.title} as="inline" />
          </h2>
          {content.subtitle ? (
            <p className="tr-subheading mx-auto mt-1 max-w-[720px] text-[15px] font-medium leading-relaxed tracking-[0.03em] lg:text-base">
              <FormattedText value={content.subtitle} as="inline" />
            </p>
          ) : null}
        </header>
        <span
          className="pointer-events-none absolute left-16 top-[58px] hidden h-[21px] w-16 bg-tr-red lg:left-[108px] lg:block"
          aria-hidden
        />
      </div>

      <div className="relative mt-8 overflow-hidden pb-14 lg:mt-12">
        {/* Banda crema detrás del video: recta en mobile, forma del Figma en desktop */}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 top-8 bg-tr-cream lg:hidden"
          aria-hidden
        />
        <BuildingsBand className="pointer-events-none absolute top-7 left-[calc(50%-979px)] hidden h-[770px] w-[2142px] text-tr-cream lg:block" />
        <BrandArch className="pointer-events-none absolute bottom-14 right-[8%] hidden h-[66px] w-[70px] text-tr-sky lg:block" />

        {/* Video: 835×327 px (Figma) — escala en pantallas chicas manteniendo proporción */}
        <div className="relative mx-auto w-full max-w-[835px] px-6 sm:px-8 lg:px-0">
          <div className="relative aspect-[835/327] w-full overflow-hidden rounded-xl bg-neutral-200">
            {hasVideo ? (
              <video
                ref={videoRef}
                src={videoSrc!}
                poster={hasPoster ? content.posterSrc : undefined}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                preload="metadata"
                controls={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
            ) : hasPoster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.posterSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}

            {(!hasVideo || !playing) && (
              <div className="absolute inset-0 flex flex-col">
                {!hasVideo && !hasPoster ? (
                  <p className="absolute left-6 top-6 text-[13px] text-neutral-500">
                    {content.placeholder}
                  </p>
                ) : null}
                <div className="flex flex-1 items-center justify-center">
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/60"
                      aria-label={playing ? "Pausar video" : "Reproducir video"}
                    >
                      <IconPlay />
                    </button>
                  ) : (
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-white"
                      aria-hidden
                    >
                      <IconPlay />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {content.meta ? (
          <FormattedText
            value={content.meta}
            className="relative pt-5 text-center text-[13px] text-tr-ink"
          />
        ) : null}
      </div>
    </section>
  );
}
