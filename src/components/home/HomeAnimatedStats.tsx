"use client";

import { useEffect, useRef, useState } from "react";
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
        showDivider ? "lg:border-l lg:border-neutral-200" : ""
      }`}
    >
      <p
        className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-none tracking-tight text-neutral-950 tabular-nums"
        aria-label={`${prefix}${target} ${item.label}`}
      >
        <span aria-hidden>
          {prefix}
          {shown}
        </span>
      </p>
      <p className="mt-3 max-w-[9.5rem] text-[13px] leading-snug text-neutral-500">
        {item.label}
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
      className="border-b border-neutral-200 bg-[#F8F8F8]"
      aria-labelledby="home-stats-heading"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10 md:py-12">
        <h2
          id="home-stats-heading"
          className="text-[15px] font-bold text-neutral-500"
        >
          {title}
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5 lg:gap-y-0">
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
    </section>
  );
}
