"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  message?: string;
};

export function GnahsEngineLoadingSkeleton({ message }: Props) {
  const { ui } = useLanguage();
  const title = message ?? ui.reservas.loadingEngine;
  const labels = [
    ui.reservas.destination,
    ui.reservas.dates,
    ui.reservas.guests,
    ui.reservas.confirmation,
  ];

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-10 w-10 shrink-0 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"
          aria-hidden
        />
        <div>
          <p className="text-[15px] font-semibold text-neutral-950">{title}</p>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {ui.reservas.connecting}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {labels.map((label) => (
          <div key={label} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
            <span className="sr-only">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-2/3 max-w-md animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
