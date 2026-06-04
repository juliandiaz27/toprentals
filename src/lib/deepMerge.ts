/**
 * Combina override sobre base. Claves ausentes en override conservan base.
 * Arrays vacíos en override no pisan arrays con datos en base.
 */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override)) {
    const oVal = override[key];
    const bVal = out[key];

    if (oVal === undefined) continue;

    if (
      oVal !== null &&
      typeof oVal === "object" &&
      !Array.isArray(oVal) &&
      bVal !== null &&
      typeof bVal === "object" &&
      !Array.isArray(bVal)
    ) {
      out[key] = deepMerge(
        bVal as Record<string, unknown>,
        oVal as Record<string, unknown>,
      );
      continue;
    }

    if (
      Array.isArray(oVal) &&
      oVal.length === 0 &&
      Array.isArray(bVal) &&
      bVal.length > 0
    ) {
      continue;
    }

    out[key] = oVal;
  }

  return out as T;
}

export function isEmptyObject(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  );
}
