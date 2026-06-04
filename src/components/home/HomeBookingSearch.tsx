"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildGnahsBookingUrl,
  defaultCheckinCheckout,
} from "@/lib/gnahs/buildBookingUrl";
import type { PropertyListing } from "@/lib/properties/catalog";
import {
  filterSearchEstablishments,
  groupSearchEstablishments,
  listingsForSearch,
  type SearchEstablishmentOption,
} from "@/lib/properties/searchEstablishments";

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

function IconSearch() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-neutral-400"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 20l-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
  listings: PropertyListing[];
  bookingRoute?: string;
};

export function HomeBookingSearch({
  listings,
  bookingRoute = "/reservas",
}: Props) {
  const router = useRouter();
  const listId = useId();
  const deptRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const defaults = defaultCheckinCheckout();

  const allOptions = useMemo(() => listingsForSearch(listings), [listings]);

  const [establishmentId, setEstablishmentId] = useState<number | "">("");
  const [deptOpen, setDeptOpen] = useState(false);
  const [deptQuery, setDeptQuery] = useState("");
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState(2);

  const filtered = useMemo(
    () => filterSearchEstablishments(allOptions, deptQuery),
    [allOptions, deptQuery],
  );
  const groups = useMemo(
    () => groupSearchEstablishments(filtered),
    [filtered],
  );

  const selectedDept: SearchEstablishmentOption | null =
    establishmentId === ""
      ? null
      : (allOptions.find((d) => d.gnahsId === establishmentId) ?? null);

  useEffect(() => {
    if (!deptOpen) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    const onPointerDown = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [deptOpen]);

  const openDept = () => {
    setDeptOpen(true);
    setDeptQuery("");
  };

  const selectDept = (id: number | "") => {
    setEstablishmentId(id);
    setDeptOpen(false);
    setDeptQuery("");
  };

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
            onClick={() => (deptOpen ? setDeptOpen(false) : openDept())}
            className={`${fieldClass} justify-between gap-2 text-left`}
          >
            <span className={selectedDept ? "text-neutral-900" : "text-neutral-500"}>
              {selectedDept?.name ?? "Seleccionar departamento"}
            </span>
            <IconChevron open={deptOpen} />
          </button>

          {deptOpen ? (
            <div
              id={`${listId}-listbox`}
              role="listbox"
              aria-labelledby={`${listId}-trigger`}
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 flex max-h-[min(420px,60vh)] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
            >
              <div className="border-b border-neutral-100 p-3">
                <div className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-3">
                  <IconSearch />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={deptQuery}
                    onChange={(e) => setDeptQuery(e.target.value)}
                    placeholder="Buscar"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-500"
                    aria-label="Buscar departamento"
                  />
                </div>
              </div>

              <div className="overflow-y-auto py-1">
                <div role="option" aria-selected={establishmentId === ""}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-[14px] text-neutral-700 hover:bg-neutral-50"
                    onClick={() => selectDept("")}
                  >
                    Todos los departamentos
                  </button>
                </div>

                {groups.length === 0 ? (
                  <p className="px-4 py-3 text-[13px] text-neutral-500">
                    No hay resultados para «{deptQuery}».
                  </p>
                ) : (
                  groups.map((group) => (
                    <div key={group.city} className="pt-2">
                      <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                        {group.regionLabel}
                      </p>
                      <ul>
                        {group.items.map((dept) => (
                          <li
                            key={dept.slug}
                            role="option"
                            aria-selected={establishmentId === dept.gnahsId}
                          >
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left text-[14px] text-neutral-900 hover:bg-neutral-50"
                              onClick={() => selectDept(dept.gnahsId)}
                            >
                              {dept.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-neutral-100 px-4 py-3">
                <Link
                  href="/propiedades"
                  className="text-[13px] font-medium text-neutral-700 underline-offset-2 hover:text-neutral-950 hover:underline"
                  onClick={() => setDeptOpen(false)}
                >
                  Ver todas las propiedades
                </Link>
              </div>
            </div>
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

      <SearchField label="Pasajeros">
        <input
          type="number"
          name="guests"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value) || 1)}
          placeholder="Nro. de pasajeros"
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
