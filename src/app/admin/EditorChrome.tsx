"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Estado de edición de un formulario del panel:
 * - marca «sin guardar» al escribir (incluye los editores de texto enriquecido),
 * - avisa antes de salir con cambios pendientes,
 * - guarda con Ctrl/⌘ + S.
 */
export function useUnsavedChanges(formRef: RefObject<HTMLFormElement | null>) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    // Escucha en el documento: el formulario puede montarse después (ej. editor de edificios)
    const markIfInside = (e: Event) => {
      const form = formRef.current;
      const target = e.target as Element | null;
      if (!form || !target || !form.contains(target)) return;
      // Botones que agregan/quitan filas también cambian el contenido
      if (e.type === "click" && !target.closest('button[type="button"]')) return;
      setDirty(true);
    };
    document.addEventListener("input", markIfInside);
    document.addEventListener("change", markIfInside);
    document.addEventListener("click", markIfInside);
    return () => {
      document.removeEventListener("input", markIfInside);
      document.removeEventListener("change", markIfInside);
      document.removeEventListener("click", markIfInside);
    };
  }, [formRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formRef]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return { dirty, markSaved: () => setDirty(false), markDirty: () => setDirty(true) };
}

/** «Cambios sin guardar» / «Todo guardado» + atajo de teclado. */
export function SaveState({ dirty }: { dirty: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`admin-save-state ${dirty ? "admin-save-state--dirty" : ""}`} aria-live="polite">
        {dirty ? "Cambios sin guardar" : "Todo guardado"}
      </span>
      <span className="admin-kbd hidden sm:inline" title="Guardar con el teclado">
        Ctrl+S
      </span>
    </span>
  );
}

export type TocItem = { id: string; label: string };

/** Id estable para anclar una sección del formulario. */
export function sectionAnchorId(label: string): string {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `sec-${slug || "seccion"}`;
}

/** Índice fijo de secciones; resalta la que está a la vista. */
export function EditorToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const root = document.querySelector(".admin-main");
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root, rootMargin: "-20% 0px -65% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav className="admin-toc" aria-label="Secciones">
      <p className="admin-toc__title">En esta página</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
