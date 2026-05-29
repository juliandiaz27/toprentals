"use client";

import { useRef, useState, useTransition } from "react";
import { uploadEntityImage } from "./actions";
import type { EntityImageKind } from "@/lib/adminImageSlots";

type Props = {
  entity: EntityImageKind;
  id: string;
  label: string;
  currentSrc: string;
};

export function EntityImageUploader({ entity, id, label, currentSrc }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadEntityImage(entity, id, fd);
      if (!res.ok) {
        setError(res.error ?? "Error al subir");
        return;
      }
      setError(null);
      window.location.reload();
    });
  }

  return (
    <article className="admin-card flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-medium text-neutral-900">{label}</p>
      <p className="font-mono text-xs text-neutral-400">{id}</p>
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc || "/images/placeholders/person.svg"}
          alt={label}
          className="h-full w-full object-cover"
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="text-xs"
        disabled={pending}
      />
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleSave}
        disabled={pending}
        className="admin-btn-primary self-start rounded px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Subiendo…" : "Guardar foto"}
      </button>
    </article>
  );
}
