"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeStatItem } from "@/lib/pageContent/homeTypes";

type Props = {
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
}: {
  item: HomeStatItem;
  active: boolean;
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
    <li className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <p
        className="text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-none tracking-tight text-neutral-950 tabular-nums"
        aria-label={`${prefix}${target} ${item.label}`}
      >
        <span aria-hidden>
          {prefix}
          {shown}
        </span>
      </p>
      <p className="mt-3 max-w-[11rem] text-[14px] leading-snug text-neutral-600">
        {item.label}
      </p>
    </li>
  );
}

export function HomeAnimatedStats({ items }: Props) {
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
      className="border-b border-neutral-200 bg-white"
      aria-label="Cifras Top Rentals"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 md:px-10 md:py-14">
        <ul className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-8">
          {items.map((item) => (
            <AnimatedStatBlock key={item.label} item={item} active={visible} />
          ))}
        </ul>
      </div>
    </section>
  );
}
