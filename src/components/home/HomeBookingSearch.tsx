"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildGnahsBookingUrl,
  defaultCheckinCheckout,
} from "@/lib/gnahs/buildBookingUrl";
import { GNAHS_HOTELS } from "@/lib/gnahs/hotels";

const DEPARTMENTS = GNAHS_HOTELS.filter((h) => h.id >= 1 && h.id <= 11);

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

function SearchField({ label, children, className = "" }: FieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-950">
        {label}
      </span>
      {children}
    </div>
  );
}

const fieldClass =
  "flex h-12 w-full items-center rounded-lg bg-neutral-100 px-4 text-[15px] text-neutral-900 transition placeholder:text-neutral-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950/10";

type Props = {
  bookingRoute?: string;
};

export function HomeBookingSearch({ bookingRoute = "/reservas" }: Props) {
  const router = useRouter();
  const listId = useId();
  const deptRef = useRef<HTMLDivElement>(null);
  const defaults = defaultCheckinCheckout();

  const [establishmentId, setEstablishmentId] = useState<number | "">("");
  const [deptOpen, setDeptOpen] = useState(false);
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState(2);

  const selectedDept =
    establishmentId === ""
      ? null
      : DEPARTMENTS.find((d) => d.id === establishmentId);

  useEffect(() => {
    if (!deptOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [deptOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkout <= checkin) return;

    const url = buildGnahsBookingUrl({
      checkin,
      checkout,
      adults: guests,
      establishmentId: establishmentId === "" ? undefined : establishmentId,
      bookingRoute,
    });
    router.push(url);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end lg:gap-5"
    >
      <SearchField label="Departamento" className="sm:col-span-2 lg:col-span-1">
        <div ref={deptRef} className="relative">
          <button
            type="button"
            id={`${listId}-trigger`}
            aria-expanded={deptOpen}
            aria-haspopup="listbox"
            aria-controls={`${listId}-listbox`}
            onClick={() => setDeptOpen((o) => !o)}
            className={`${fieldClass} justify-between gap-2 text-left`}
          >
            <span className={selectedDept ? "text-neutral-900" : "text-neutral-500"}>
              {selectedDept?.name ?? "Seleccionar departamento"}
            </span>
            <IconChevron open={deptOpen} />
          </button>

          {deptOpen ? (
            <ul
              id={`${listId}-listbox`}
              role="listbox"
              aria-labelledby={`${listId}-trigger`}
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[min(320px,50vh)] overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
            >
              <li role="option" aria-selected={establishmentId === ""}>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-[14px] text-neutral-700 hover:bg-neutral-50"
                  onClick={() => {
                    setEstablishmentId("");
                    setDeptOpen(false);
                  }}
                >
                  Todos los departamentos
                </button>
              </li>
              {DEPARTMENTS.map((dept) => (
                <li key={dept.id} role="option" aria-selected={establishmentId === dept.id}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-[14px] text-neutral-900 hover:bg-neutral-50"
                    onClick={() => {
                      setEstablishmentId(dept.id);
                      setDeptOpen(false);
                    }}
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </SearchField>

      <SearchField label="Entrada">
        <input
          type="date"
          name="checkin"
          value={checkin}
          min={defaults.checkin}
          onChange={(e) => setCheckin(e.target.value)}
          className={fieldClass}
          required
        />
      </SearchField>

      <SearchField label="Salida">
        <input
          type="date"
          name="checkout"
          value={checkout}
          min={checkin}
          onChange={(e) => setCheckout(e.target.value)}
          className={fieldClass}
          required
        />
      </SearchField>

      <SearchField label="Huéspedes">
        <input
          type="number"
          name="guests"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value) || 1)}
          placeholder="Nro. de huéspedes"
          className={fieldClass}
          required
        />
      </SearchField>

      <div className="sm:col-span-2 lg:col-span-1 lg:self-end">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn px-6 text-[14px] font-semibold text-white transition hover:bg-btn-hover lg:w-auto lg:min-w-[220px]"
        >
          <span>Buscar disponibilidad</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
