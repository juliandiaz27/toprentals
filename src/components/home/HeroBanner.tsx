"use client";

import Link from "next/link";
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

export function HeroBanner({ hero, slides }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      if (el.paused) void el.play();
      else el.pause();
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

  // Progreso desde el video del slide activo
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    const onTimeUpdate = () => {
      if (el.duration && Number.isFinite(el.duration)) {
        setProgress(el.currentTime / el.duration);
      }
    };
    const onEnded = () => goNext();

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
    };
  }, [activeIndex, hasVideo, goNext]);

  useEffect(() => {
    setProgress(0);
    if (videoRef.current && hasVideo) {
      videoRef.current.load();
      if (playing) void videoRef.current.play();
    }
  }, [activeIndex, hasVideo, playing]);

  const showPlaceholder = !videoSrc && slide?.posterSrc?.includes("placeholders");

  return (
    <section className="hero-banner relative min-h-[min(calc(100dvh-72px),880px)] w-full overflow-hidden bg-[#141414] text-white">
      {/* Slides de fondo */}
      {slides.map((s, i) => {
        const src = slideVideoSrc(s);
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] w-full max-w-[1440px] flex-col px-6 pb-16 pt-8 lg:px-12">
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#525252]/90 px-4 py-2 text-[13px] font-normal text-white backdrop-blur-sm transition hover:bg-[#5c5c5c]"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full bg-white ${playing ? "opacity-100" : "opacity-40"}`}
              aria-hidden
            />
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

        <div className="mt-auto max-w-[780px] pb-10 pt-12 lg:pb-12">
          <h1 className="text-[clamp(2.5rem,4.5vw,4.25rem)] font-bold leading-[1] tracking-normal text-white">
            {hero.title}
          </h1>
          {hero.subtitle ? (
            <p className="mt-5 max-w-md whitespace-pre-line text-[15px] font-normal leading-[1.6] text-white/85 md:text-base">
              {hero.subtitle}
            </p>
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

        <a
          href="#buscador"
          className="absolute bottom-10 right-6 z-20 flex items-center gap-1.5 text-[12px] font-normal text-white/60 transition hover:text-white lg:right-12"
        >
          <IconChevronDown />
          <span>{hero.exploreLabel}</span>
        </a>
      </div>

      {hero.whatsappEnabled && hero.whatsappUrl ? (
        <a
          href={hero.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-14 right-6 z-20 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-[13px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition hover:scale-105 lg:right-10"
          aria-label="WhatsApp"
        >
          WA
        </a>
      ) : null}

      {slideCount > 0 ? (
        <HeroProgressBar
          count={slideCount}
          activeIndex={activeIndex}
          progress={progress}
        />
      ) : null}
    </section>
  );
}
