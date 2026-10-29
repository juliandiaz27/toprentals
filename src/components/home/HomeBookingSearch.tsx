"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildGnahsBookingUrl,
  defaultCheckinCheckout,
  formatDateForInput,
  getGnahsBookingRouteForEstablishment,
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

const LABELS = {
  es: {
    department: "Departamento",
    allDepartments: "Todos los departamentos",
    search: "Buscar",
    searchAria: "Buscar departamento",
    noResults: "No hay resultados para",
    seeAll: "Ver todas las propiedades",
    thisProperty: "Esta propiedad",
    checkinLabel: "Entrada",
    checkoutLabel: "Salida",
    checkin: "Check-in",
    checkout: "Check-out",
    guestsLabel: "Huéspedes",
    guests: "Nro. de huéspedes",
    submit: "Buscar disponibilidad",
  },
  en: {
    department: "Apartment",
    allDepartments: "All apartments",
    search: "Search",
    searchAria: "Search apartment",
    noResults: "No results for",
    seeAll: "See all properties",
    thisProperty: "This property",
    checkinLabel: "Check-in",
    checkoutLabel: "Check-out",
    checkin: "Check-in",
    checkout: "Check-out",
    guestsLabel: "Guests",
    guests: "No. of guests",
    submit: "Check availability",
  },
};

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return formatDateForInput(d);
}

/** Fecha con placeholder (Figma): texto hasta el foco, luego picker nativo. */
function DateInput({
  value,
  min,
  placeholder,
  name,
  onChange,
}: {
  value: string;
  min: string;
  placeholder: string;
  name: string;
  onChange: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={value || focused ? "date" : "text"}
      name={name}
      value={value}
      min={min}
      placeholder={placeholder}
      aria-label={placeholder}
      onFocus={(e) => {
        setFocused(true);
        const el = e.currentTarget;
        window.setTimeout(() => {
          try {
            el.showPicker?.();
          } catch {
            /* algunos navegadores no permiten showPicker */
          }
        }, 0);
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => onChange(e.target.value)}
      className={fieldClass}
    />
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
      <span className="text-[10px] font-semibold uppercase tracking-[0.04em] text-tr-ink">
        {label}
      </span>
      {children}
    </div>
  );
}

const fieldClass =
  "flex h-10 w-full items-center rounded-[2px] bg-[#F4F3EF] px-3 text-[14px] text-tr-ink transition placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-tr-ink/15";

type Props = {
  listings: PropertyListing[];
  bookingRoute?: string;
  initialEstablishmentId?: number;
  lockEstablishment?: boolean;
  establishmentLabel?: string;
  language?: "es" | "en";
};

export function HomeBookingSearch({
  listings,
  bookingRoute = "/reservas",
  initialEstablishmentId,
  lockEstablishment = false,
  establishmentLabel,
  language = "es",
}: Props) {
  const t = LABELS[language] ?? LABELS.es;
  const router = useRouter();
  const listId = useId();
  const deptRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const defaults = defaultCheckinCheckout();

  const allOptions = useMemo(() => listingsForSearch(listings), [listings]);

  const [establishmentId, setEstablishmentId] = useState<number | "">(
    initialEstablishmentId ?? "",
  );
  const [deptOpen, setDeptOpen] = useState(false);
  const [deptQuery, setDeptQuery] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState<number | "">("");

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

  const lockedLabel =
    establishmentLabel?.trim() ||
    selectedDept?.name ||
    (lockEstablishment ? t.thisProperty : null);

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
    const id = establishmentId === "" ? undefined : establishmentId;

    // Sin fechas: el motor GNAHS muestra su propio calendario
    if (!checkin) {
      router.push(id ? getGnahsBookingRouteForEstablishment(id) : bookingRoute);
      return;
    }

    const url = buildGnahsBookingUrl({
      checkin,
      checkout: checkout && checkout > checkin ? checkout : addDays(checkin, 1),
      adults: guests || 2,
      establishmentId: id,
      bookingRoute,
    });
    router.push(url);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,320fr)_minmax(0,170fr)_minmax(0,170fr)_minmax(0,170fr)_minmax(0,388fr)] lg:items-end lg:gap-x-5"
    >
      <SearchField label={t.department} className="sm:col-span-2 lg:col-span-1">
        {lockEstablishment ? (
          <div
            className={`${fieldClass} cursor-default text-neutral-900`}
            aria-readonly
          >
            {lockedLabel}
          </div>
        ) : (
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
            <span className="truncate">
              {selectedDept?.name ?? ""}
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
                    placeholder={t.search}
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-500"
                    aria-label={t.searchAria}
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
                    {t.allDepartments}
                  </button>
                </div>

                {groups.length === 0 ? (
                  <p className="px-4 py-3 text-[13px] text-neutral-500">
                    {t.noResults} «{deptQuery}».
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
                  {t.seeAll}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
        )}
      </SearchField>

      <SearchField label={t.checkinLabel}>
        <DateInput
          name="checkin"
          value={checkin}
          min={defaults.checkin}
          placeholder={t.checkin}
          onChange={(value) => {
            setCheckin(value);
            if (value && checkout && checkout <= value) setCheckout(addDays(value, 1));
          }}
        />
      </SearchField>

      <SearchField label={t.checkoutLabel}>
        <DateInput
          name="checkout"
          value={checkout}
          min={checkin ? addDays(checkin, 1) : defaults.checkout}
          placeholder={t.checkout}
          onChange={setCheckout}
        />
      </SearchField>

      <SearchField label={t.guestsLabel}>
        <input
          type="number"
          name="guests"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(e.target.value ? Number(e.target.value) || 1 : "")}
          placeholder={t.guests}
          className={fieldClass}
        />
      </SearchField>

      <div className="sm:col-span-2 lg:col-span-1 lg:pl-4">
        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[3px] bg-tr-ink px-6 text-[15px] font-medium text-white transition hover:bg-black lg:h-[60px]"
        >
          <span>{t.submit}</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
