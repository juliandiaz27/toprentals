/** easeOutCubic — desacelera al llegar al destino */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type SmoothScrollOptions = {
  duration?: number;
  offset?: number;
};

/**
 * Scroll suave a un elemento por id (sin el #).
 * Respeta prefers-reduced-motion.
 */
export function smoothScrollToId(
  id: string,
  { duration = 900, offset = 0 }: SmoothScrollOptions = {},
): void {
  const target = document.getElementById(id.replace(/^#/, ""));
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const startY = window.scrollY;
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - offset;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  const start = performance.now();

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
