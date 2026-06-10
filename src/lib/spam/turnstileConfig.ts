export function getTurnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

export function isTurnstileRequired(): boolean {
  return Boolean(getTurnstileSiteKey());
}
