"use client";

import { useRef, useState } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeBuildingsContent } from "@/lib/pageContent/homeTypes";
import { resolveBuildingsVideoSrc } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeBuildingsContent;
};

function IconPlay() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
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
    <section className="bg-black px-6 pb-0 pt-16 text-white sm:px-8 lg:px-16 lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="text-center">
          <h2 className="text-[clamp(1.875rem,3.5vw,2.75rem)] font-bold leading-[1.12] tracking-tight">
            <FormattedText value={content.title} as="inline" />
          </h2>
          {content.subtitle ? (
            <FormattedText
              value={content.subtitle}
              className="mx-auto mt-4 block max-w-[600px] text-[15px] leading-relaxed text-zinc-400 lg:text-base"
            />
          ) : null}
        </header>

        {/* Video: 920×360 px (Figma) — escala en pantallas chicas manteniendo proporción */}
        <div className="relative mx-auto mt-10 w-full max-w-[920px] overflow-hidden rounded-2xl bg-[#262626] lg:mt-12">
          <div className="relative aspect-[920/360] w-full lg:h-[360px] lg:aspect-auto">
            {hasVideo ? (
              <video
                ref={videoRef}
                src={videoSrc!}
                poster={hasPoster ? content.posterSrc : undefined}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
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
                  <p className="absolute left-6 top-6 text-[13px] text-zinc-500">
                    {content.placeholder}
                  </p>
                ) : null}
                <div className="flex flex-1 items-center justify-center">
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
                      aria-label={playing ? "Pausar video" : "Reproducir video"}
                    >
                      <IconPlay />
                    </button>
                  ) : (
                    <span
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-black"
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
            className="pb-16 pt-5 text-center text-sm text-zinc-500 lg:pb-20"
          />
        ) : (
          <div className="pb-16 lg:pb-20" aria-hidden />
        )}
      </div>
    </section>
  );
}
