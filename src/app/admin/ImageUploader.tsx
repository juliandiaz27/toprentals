"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage, removeImage } from "./actions";

type Props = {
  slotKey: string;
  label: string;
  hint?: string;
  currentUrl: string;
  fallback: string;
};

export function ImageUploader({
  slotKey,
  label,
  hint,
  currentUrl,
  fallback,
}: Props) {
  const [preview, setPreview] = useState(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || fallback;
  const hasOverride = preview !== fallback && preview !== "";

  function onFileChange() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  function handleSave() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo primero.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(slotKey, fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        setPreview(currentUrl || fallback);
        return;
      }
      setError(null);
      window.location.reload();
    });
  }

  function handleReset() {
    if (!confirm("¿Restablecer esta imagen al valor por defecto?")) return;
    startTransition(async () => {
      const res = await removeImage(slotKey);
      if (!res.ok) {
        setError(res.error ?? "Error");
        return;
      }
      setPreview(fallback);
      setError(null);
      if (inputRef.current) inputRef.current.value = "";
      window.location.reload();
    });
  }

  return (
    <article className="admin-card flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">{label}</h3>
        {hint ? <p className="mt-0.5 text-xs text-neutral-500">{hint}</p> : null}
        <p className="mt-1 font-mono text-xs text-neutral-400">{slotKey}</p>
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayUrl}
          alt={label}
          className="h-full w-full object-cover"
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="text-xs"
        onChange={onFileChange}
        disabled={pending}
      />
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="admin-btn-primary rounded px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        {hasOverride ? (
          <button
            type="button"
            onClick={handleReset}
            disabled={pending}
            className="admin-btn-secondary rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 disabled:opacity-50"
          >
            Restablecer
          </button>
        ) : null}
      </div>
    </article>
  );
}
