"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  PropertiesFilterPanel,
  type PropertiesFilterPanelProps,
} from "./PropertiesFilterPanel";

type Props = PropertiesFilterPanelProps & {
  open: boolean;
  onClose: () => void;
};

/**
 * Drawer mobile: portal en document.body (evita que data-reveal/transform rompa fixed)
 * y z-index por encima del bottom nav (z-105) y header (z-110).
 */
export function PropertiesFilterDrawer({ open, onClose, ...panel }: Props) {
  const { ui } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[115] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={ui.properties.closeFilters}
        className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 z-[1] flex max-h-[min(88dvh,720px)] flex-col rounded-t-[1.35rem] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.22)]">
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-neutral-200" aria-hidden />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2">
          <PropertiesFilterPanel {...panel} className="border-0 shadow-none" />
        </div>
        <div className="shrink-0 border-t border-neutral-200 bg-white px-4 py-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-btn text-[14px] font-semibold text-white transition-colors hover:bg-btn-hover"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
