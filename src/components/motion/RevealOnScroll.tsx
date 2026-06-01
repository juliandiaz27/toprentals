"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISIBLE_CLASS = "reveal-visible";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prepareElement(el: HTMLElement) {
  const delay = el.dataset.revealDelay;
  if (delay) {
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  }
}

function revealAll(elements: Iterable<Element>) {
  for (const el of elements) {
    el.classList.add(VISIBLE_CLASS);
  }
}

/**
 * Activa fade-in suave en elementos con `data-reveal`.
 * Uso: <section data-reveal>…</section>
 * Stagger: data-reveal-delay="120" (ms)
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (prefersReducedMotion()) {
      revealAll(elements);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(VISIBLE_CLASS);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((el) => {
      el.classList.remove(VISIBLE_CLASS);
      prepareElement(el);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
