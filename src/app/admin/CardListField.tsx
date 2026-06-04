"use client";

import { useMemo, useState } from "react";
import type { DifferentialCard } from "@/lib/pageContent/differentialCards";

type Props = {
  name: string;
  label: string;
  hint?: string;
  min: number;
  max: number;
  initialCards: DifferentialCard[];
};

export function CardListField({
  name,
  label,
  hint,
  min,
  max,
  initialCards,
}: Props) {
  const [cards, setCards] = useState<DifferentialCard[]>(() =>
    initialCards.length > 0 ? initialCards : [{ title: "", text: "" }],
  );

  const jsonValue = useMemo(() => JSON.stringify(cards), [cards]);

  function updateCard(index: number, patch: Partial<DifferentialCard>) {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, ...patch } : card)),
    );
  }

  function addCard() {
    if (cards.length >= max) return;
    setCards((prev) => [...prev, { title: "", text: "" }]);
  }

  function removeCard(index: number) {
    if (cards.length <= min) return;
    setCards((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4 lg:col-span-2">
      <div>
        <span className="admin-field-label">{label}</span>
        {hint ? <span className="admin-field-hint mt-1 block">{hint}</span> : null}
        <span className="admin-field-hint mt-1 block">
          {min} a {max} tarjetas. Usá «Agregar» o «Quitar» según necesites.
        </span>
      </div>

      <input type="hidden" name={name} value={jsonValue} readOnly />

      <ul className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <li
            key={index}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--admin-text-muted)]">
                Ítem {index + 1}
              </span>
              <button
                type="button"
                className="admin-btn-ghost text-xs"
                disabled={cards.length <= min}
                onClick={() => removeCard(index)}
              >
                Quitar
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--admin-text-dim)]">
                  Título
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={card.title}
                  onChange={(e) => updateCard(index, { title: e.target.value })}
                  placeholder="Ej. Limpieza profesional"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-1">
                <span className="text-xs font-medium text-[var(--admin-text-dim)]">
                  Texto
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={card.text}
                  onChange={(e) => updateCard(index, { text: e.target.value })}
                  placeholder="Descripción breve"
                />
              </label>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="admin-btn-secondary w-fit"
        disabled={cards.length >= max}
        onClick={addCard}
      >
        + Agregar ítem
      </button>
    </div>
  );
}
