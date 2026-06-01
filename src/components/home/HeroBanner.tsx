"use client";

import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeHeroContent, HeroSlide } from "@/lib/pageContent/homeTypes";
import { slideVideoSrc } from "@/lib/pageContent/homeTypes";
import { HeroProgressBar } from "./HeroProgressBar";

type Props = {
  hero: HomeHeroContent;
  slides: HeroSlide[];
};

function IconVolumeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 9l5 5M21 9l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconVolumeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 010 7M18 6a8 8 0 010 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

export function HeroBanner({ hero, slides }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skipSlideResetRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const slide = slides[activeIndex] ?? slides[0];
  const videoSrc = slide ? slideVideoSrc(slide) : null;
  const hasVideo = Boolean(videoSrc);
  const slideCount = slides.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % slideCount);
    setProgress(0);
  }, [slideCount]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (el) {
      if (el.paused) {
        void el.play().catch(() => setPlaying(false));
      } else {
        el.pause();
      }
      return;
    }
    setPlaying((p) => !p);
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  // Timer para slides sin video (o como respaldo)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!playing || hasVideo) return;

    const duration = slide?.durationMs ?? 8000;
    const tick = 50;
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + tick / duration;
        if (next >= 1) {
          goNext();
          return 0;
        }
        return next;
      });
    }, tick);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, playing, hasVideo, slide?.durationMs, goNext]);

  // Al terminar el video, pasar al siguiente slide (el progreso visual lo maneja HeroProgressBar)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    const onEnded = () => goNext();
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [activeIndex, hasVideo, goNext]);

  // Solo al cambiar de slide: reiniciar desde el inicio (nunca al pausar/reanudar)
  useEffect(() => {
    setProgress(0);
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    if (skipSlideResetRef.current) {
      skipSlideResetRef.current = false;
      return;
    }

    el.currentTime = 0;
    void el.play().catch(() => setPlaying(false));
  }, [activeIndex, hasVideo]);

  const showPlaceholder = !videoSrc && slide?.posterSrc?.includes("placeholders");

  return (
    <section className="hero-banner relative min-h-[min(calc(100dvh-72px),1000px)] w-full overflow-hidden bg-[#141414] pb-0 text-white sm:min-h-[min(calc(100svh-72px),1000px)]">
      {/* Slides de fondo (detrás del contenido) */}
      {slides.map((s, i) => {
        const src = slideVideoSrc(s);
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className={`absolute inset-0 z-0 transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            {src && isActive ? (
              <video
                ref={isActive ? videoRef : undefined}
                className="h-full w-full object-cover"
                src={src}
                poster={s.posterSrc || undefined}
                autoPlay={isActive}
                muted={muted}
                loop={slideCount === 1}
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            ) : s.posterSrc && !s.posterSrc.includes("placeholders") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.posterSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        );
      })}

      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="max-w-lg text-center text-[13px] leading-relaxed text-neutral-500">
            {hero.videoPlaceholder}
          </p>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/35 to-black/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] w-full max-w-[1440px] flex-col px-6 pb-8 pt-8 lg:px-12">
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={playing}
            aria-label={playing ? "Pausar video" : "Reproducir video"}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/45 px-4 py-2 text-[13px] font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-black/60"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15"
              aria-hidden
            >
              {playing ? <IconPause /> : <IconPlay />}
            </span>
            {playing ? hero.playingLabel : "Pausado"}
          </button>

          {hasVideo ? (
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/15"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? <IconVolumeOff /> : <IconVolumeOn />}
            </button>
          ) : (
            <span className="w-10" />
          )}
        </div>

        <div className="mt-auto max-w-[780px] pb-4 pt-12 lg:max-w-[min(780px,55%)]">
          <h1 className="text-[clamp(2.5rem,4.5vw,4.25rem)] font-bold leading-[1] tracking-normal text-white">
            <FormattedText value={hero.title} as="inline" />
          </h1>
          {hero.subtitle ? (
            <FormattedText
              value={hero.subtitle}
              className="mt-5 block max-w-md text-[15px] font-normal leading-[1.6] text-white/85 md:text-base"
            />
          ) : null}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={hero.ctaPrimaryHref}
              className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg bg-white px-7 text-[14px] font-medium text-neutral-950 transition hover:bg-neutral-100"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href={hero.ctaSecondaryHref}
              className="inline-flex h-12 items-center justify-center gap-1 rounded-lg border border-white/70 bg-transparent px-7 text-[14px] font-medium text-white transition hover:border-white hover:bg-white/5"
            >
              {hero.ctaSecondary}
              <span className="ml-0.5 text-lg leading-none" aria-hidden>
                ›
              </span>
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#buscador"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 text-[12px] font-normal text-white/60 transition hover:text-white"
      >
        <IconChevronDown />
        <span>{hero.exploreLabel}</span>
      </a>

      {hasVideo || slideCount > 1 ? (
        <HeroProgressBar
          count={slideCount}
          activeIndex={activeIndex}
          progress={progress}
          singleTimeline={hasVideo && slideCount <= 1}
          videoRef={hasVideo ? videoRef : undefined}
        />
      ) : null}
    </section>
  );
}
