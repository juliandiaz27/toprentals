"use client";

import { useEffect, useRef, useState } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeStatItem } from "@/lib/pageContent/homeTypes";

type Props = {
  title: string;
  items: HomeStatItem[];
};

function parseStatDisplay(display: string): { prefix: string; target: number } {
  const trimmed = display.trim();
  const match = /^(\+?)(\d+)$/.exec(trimmed);
  if (!match) return { prefix: "", target: 0 };
  return { prefix: match[1] ?? "", target: Number(match[2]) };
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function AnimatedStatBlock({
  item,
  active,
  showDivider,
}: {
  item: HomeStatItem;
  active: boolean;
  showDivider: boolean;
}) {
  const { prefix, target } = parseStatDisplay(item.value);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) {
      setCurrent(active ? target : 0);
      return;
    }

    let raf = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCurrent(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    setCurrent(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  const shown = active ? current : 0;

  return (
    <li
      className={`flex flex-col items-center px-3 text-center sm:px-4 lg:px-6 ${
        showDivider ? "lg:border-l lg:border-neutral-300" : ""
      }`}
    >
      <p
        className="text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-none tracking-tight text-tr-ink tabular-nums"
        aria-label={`${prefix}${target} ${item.label}`}
      >
        <span aria-hidden>
          {prefix}
          {shown}
        </span>
      </p>
      <p className="mt-2 max-w-[9.5rem] text-[14px] leading-snug text-tr-ink">
        <FormattedText value={item.label} as="inline" />
      </p>
    </li>
  );
}

export function HomeAnimatedStats({ title, items }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-reveal
      className="bg-white"
      aria-labelledby="home-stats-heading"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-14 md:px-10 lg:px-16 lg:pb-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-6 lg:pl-11">
          <h2
            id="home-stats-heading"
            className="tr-heading shrink-0 text-[22px] leading-none lg:w-[210px] lg:text-[25px] [&_em]:block"
          >
            <FormattedText value={title} as="inline" />
          </h2>
          <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {items.map((item, index) => (
            <AnimatedStatBlock
              key={`${item.label}-${index}`}
              item={item}
              active={visible}
              showDivider={index > 0}
            />
          ))}
          </ul>
        </div>
        {/* Trazo curvo del Figma bajo los números */}
        <span
          className="pointer-events-none absolute bottom-8 left-5 right-10 hidden h-20 rounded-bl-[64px] border-b border-l border-tr-ink/80 md:left-10 lg:left-16 lg:right-36 lg:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
