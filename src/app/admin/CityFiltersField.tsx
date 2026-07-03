"use client";

import { useMemo, useState } from "react";
import type { PropertyCityFilterItem } from "@/lib/pageContent/propertyCityFilters";

type FilterRow = {
  label: string;
  matchCities: string;
  includeComingSoon: boolean;
};

type Props = {
  name: string;
  label: string;
  hint?: string;
  min: number;
  max: number;
  initialItems: PropertyCityFilterItem[];
};

function toRows(items: PropertyCityFilterItem[]): FilterRow[] {
  if (items.length === 0) {
    return [{ label: "", matchCities: "", includeComingSoon: false }];
  }
  return items.map((item) => ({
    label: item.label,
    matchCities: item.matchCities.join(", "),
    includeComingSoon: Boolean(item.includeComingSoon),
  }));
}

function rowsToJson(rows: FilterRow[]): string {
  const items = rows
    .map((row) => ({
      label: row.label.trim(),
      matchCities: row.matchCities.trim(),
      includeComingSoon: row.includeComingSoon,
    }))
    .filter((row) => row.label);
  return JSON.stringify(items);
}

export function CityFiltersField({
  name,
  label,
  hint,
  min,
  max,
  initialItems,
}: Props) {
  const [rows, setRows] = useState<FilterRow[]>(() => toRows(initialItems));

  const jsonValue = useMemo(() => rowsToJson(rows), [rows]);

  function updateRow(index: number, patch: Partial<FilterRow>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    if (rows.length >= max) return;
    setRows((prev) => [...prev, { label: "", matchCities: "", includeComingSoon: false }]);
  }

  function removeRow(index: number) {
    if (rows.length <= min) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4 lg:col-span-2">
      <div>
        <span className="admin-field-label">{label}</span>
        {hint ? <span className="admin-field-hint mt-1 block">{hint}</span> : null}
        <span className="admin-field-hint mt-1 block">
          Etiqueta del chip en el listado (usá el país, ej. Argentina). «Ciudad en
          propiedades» es el valor del desplegable al crear/editar (varias ciudades
          separadas por coma). «Incluir próximamente» muestra también propiedades en
          desarrollo en ese filtro.
        </span>
      </div>

      <input type="hidden" name={name} value={jsonValue} readOnly />

      <ul className="flex flex-col gap-4">
        {rows.map((row, index) => (
          <li
            key={index}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--admin-text-muted)]">
                Filtro {index + 1}
              </span>
              <button
                type="button"
                className="admin-btn-ghost text-xs"
                disabled={rows.length <= min}
                onClick={() => removeRow(index)}
              >
                Quitar
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--admin-text-dim)]">
                  Etiqueta del filtro (país)
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={row.label}
                  onChange={(e) => updateRow(index, { label: e.target.value })}
                  placeholder="Ej. Argentina"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--admin-text-dim)]">
                  Ciudad en propiedades
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={row.matchCities}
                  onChange={(e) => updateRow(index, { matchCities: e.target.value })}
                  placeholder="Ej. Buenos Aires o Quito"
                />
              </label>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
              <input
                type="checkbox"
                checked={row.includeComingSoon}
                onChange={(e) =>
                  updateRow(index, { includeComingSoon: e.target.checked })
                }
                className="h-4 w-4"
              />
              Incluir propiedades «Próximamente» en este filtro
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="admin-btn-secondary w-fit"
        disabled={rows.length >= max}
        onClick={addRow}
      >
        + Agregar filtro por país
      </button>
    </div>
  );
}
