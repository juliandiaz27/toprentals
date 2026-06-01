"use client";

import { useEffect, useRef, type RefObject } from "react";

type Props = {
  count: number;
  activeIndex: number;
  /** 0–1 progreso del slide sin video (carrusel de imágenes) */
  progress: number;
  /** Una barra continua en lugar de segmentos */
  singleTimeline?: boolean;
  /** Si hay video, la barra sigue el tiempo con requestAnimationFrame (fluido) */
  videoRef?: RefObject<HTMLVideoElement | null>;
};

function ProgressFill({ scale }: { scale: number }) {
  const clamped = Math.min(1, Math.max(0, scale));
  return (
    <div
      className="h-full w-full origin-left bg-white will-change-transform"
      style={{ transform: `scaleX(${clamped})` }}
    />
  );
}

/**
 * Barra de progreso al pie del hero: línea de tiempo del video o segmentos del carrusel.
 */
export function HeroProgressBar({
  count,
  activeIndex,
  progress,
  singleTimeline = false,
  videoRef,
}: Props) {
  const singleFillRef = useRef<HTMLDivElement>(null);
  const segmentFillRef = useRef<HTMLDivElement>(null);
  const ariaRef = useRef(0);

  // Video: actualización cada frame vía DOM (sin tirones de timeupdate ni re-renders)
  useEffect(() => {
    if (!videoRef) return;

    let rafId = 0;

    const setScale = (el: HTMLDivElement | null, scale: number) => {
      if (!el) return;
      const clamped = Math.min(1, Math.max(0, scale));
      el.style.transform = `scaleX(${clamped})`;
      ariaRef.current = Math.round(clamped * 100);
    };

    const tick = () => {
      const video = videoRef.current;
      const fill = singleTimeline
        ? singleFillRef.current
        : segmentFillRef.current;

      if (video?.duration && Number.isFinite(video.duration)) {
        setScale(fill, video.currentTime / video.duration);
      }

      if (video && !video.paused && !video.ended) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(rafId);
      setScale(singleFillRef.current, 0);
      setScale(segmentFillRef.current, 0);
      ariaRef.current = 0;
    };

    const video = videoRef.current;
    if (!video) return reset;

    video.addEventListener("play", start);
    video.addEventListener("seeking", start);
    video.addEventListener("loadeddata", start);

    if (!video.paused) start();
    else if (video.duration && Number.isFinite(video.duration)) {
      setScale(
        singleTimeline ? singleFillRef.current : segmentFillRef.current,
        video.currentTime / video.duration,
      );
    }

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("play", start);
      video.removeEventListener("seeking", start);
      video.removeEventListener("loadeddata", start);
    };
  }, [videoRef, singleTimeline, activeIndex]);

  const pct = Math.min(100, Math.max(0, progress * 100));

  if (singleTimeline || count <= 1) {
    return (
      <div
        className="hero-progress pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[3px] overflow-hidden bg-white/25"
        role="progressbar"
        aria-valuenow={videoRef ? ariaRef.current : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del video"
      >
        {videoRef ? (
          <div ref={singleFillRef} className="h-full w-full origin-left bg-white will-change-transform" style={{ transform: "scaleX(0)" }} />
        ) : (
          <ProgressFill scale={progress} />
        )}
      </div>
    );
  }

  return (
    <div
      className="hero-progress pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex gap-[3px]"
      role="progressbar"
      aria-valuenow={videoRef ? ariaRef.current : Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Banner ${activeIndex + 1} de ${count}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div
            key={i}
            className="h-[3px] min-w-0 flex-1 overflow-hidden bg-white/25"
          >
            {isPast ? (
              <div className="h-full w-full origin-left bg-white" style={{ transform: "scaleX(1)" }} />
            ) : isActive && videoRef ? (
              <div
                ref={segmentFillRef}
                className="h-full w-full origin-left bg-white will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            ) : isActive ? (
              <ProgressFill scale={progress} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
