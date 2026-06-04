"use client";



import { useRouter } from "next/navigation";

import { useState, useTransition } from "react";

import type { MarketingConfigFile } from "@/lib/marketing/types";

import {

  MENU_SITE_ROUTES,

  normalizeInternalHref,

  STICKY_RESERVE_HREF,

} from "@/lib/pageContent/siteRoutes";

import { saveMarketingConfig } from "./marketingActions";



type Props = {

  initial: MarketingConfigFile;

};



function toDatetimeLocal(iso: string): string {

  if (!iso) return "";

  try {

    const d = new Date(iso);

    const pad = (n: number) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  } catch {

    return "";

  }

}



function fromDatetimeLocal(value: string): string {

  if (!value) return "";

  const d = new Date(value);

  return Number.isNaN(d.getTime()) ? "" : d.toISOString();

}



function IconSave() {

  return (

    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>

      <path

        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"

        stroke="currentColor"

        strokeWidth="1.75"

      />

      <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.75" />

    </svg>

  );

}



function IconInfo() {

  return (

    <svg

      className="admin-callout__icon"

      width="18"

      height="18"

      viewBox="0 0 24 24"

      fill="none"

      aria-hidden

    >

      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />

      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />

    </svg>

  );

}



export function MarketingManager({ initial }: Props) {

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [pending, startTransition] = useTransition();

  const [startLocal, setStartLocal] = useState(

    toDatetimeLocal(initial.announcementBar.startAt),

  );

  const [endLocal, setEndLocal] = useState(

    toDatetimeLocal(initial.announcementBar.endAt),

  );

  const [bgColor, setBgColor] = useState(

    initial.announcementBar.backgroundColor || "#111111",

  );



  const sticky = initial.stickyReserve;

  const bar = initial.announcementBar;



  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    setError(null);

    setSuccess(null);

    const fd = new FormData(e.currentTarget);

    fd.set("announcement.startAt", fromDatetimeLocal(startLocal));

    fd.set("announcement.endAt", fromDatetimeLocal(endLocal));



    startTransition(async () => {

      const res = await saveMarketingConfig(fd);

      if (!res.ok) {

        setError(res.error ?? "Error al guardar");

        return;

      }

      setSuccess("Configuración de marketing guardada.");

      router.refresh();

    });

  }



  return (

    <div>

      <header className="admin-page-header">

        <div>

          <h1 className="admin-page-title">Marketing y conversión</h1>

          <p className="admin-page-desc">

            Botón flotante de reserva en páginas B2C y barra de campañas con fechas

            de vigencia. No aplica en Corporativo ni landings B2B.

          </p>

        </div>

        <div className="admin-page-header__actions">

          <button

            type="submit"

            form="marketing-form"

            className="admin-btn-primary"

            disabled={pending}

          >

            <IconSave />

            {pending ? "Guardando…" : "Guardar"}

          </button>

        </div>

      </header>



      {error ? (

        <p className="admin-alert-error mb-6" role="alert">

          {error}

        </p>

      ) : null}

      {success ? (

        <p className="admin-alert-success mb-6" role="status">

          {success}

        </p>

      ) : null}



      <form id="marketing-form" onSubmit={handleSubmit} className="space-y-6">

        <section className="admin-section-card">

          <div className="admin-section-card__head">

            <h2 className="admin-section-title">

              Botón flotante «Reservar»

            </h2>

          </div>

          <div className="admin-section-card__body space-y-4">

            <label className="flex items-center gap-2">

              <input

                type="checkbox"

                name="sticky.enabled"

                defaultChecked={sticky.enabled}

              />

              <span className="admin-field-label mb-0">Activo en páginas B2C</span>

            </label>



            <div className="admin-callout" role="note">

              <IconInfo />

              <p>

                Visible al hacer scroll en Home, Propiedades (listado y ficha),

                Blog, Club Top Rentals y Nosotros. Oculto en Corporativo, Reservas

                (ya está el motor), Propietarios, Real Estate, etc.

              </p>

            </div>



            <div className="admin-field-row admin-field-row--2 max-w-2xl">

              <label className="flex flex-col gap-1">

                <span className="admin-field-label">Texto del botón</span>

                <input

                  className="admin-input"

                  name="sticky.label"

                  defaultValue={sticky.label}

                />

              </label>

              <div className="flex flex-col gap-1">

                <span className="admin-field-label">Destino</span>

                <p className="admin-field-readonly">{STICKY_RESERVE_HREF}</p>

                <span className="admin-field-hint mb-0">

                  Siempre abre el motor de reservas. La ruta no se puede cambiar

                  desde el panel.

                </span>

              </div>

            </div>

          </div>

        </section>



        <section className="admin-section-card">

          <div className="admin-section-card__head">

            <h2 className="admin-section-title">Barra de campaña</h2>

          </div>

          <div className="admin-section-card__body grid max-w-2xl gap-4 sm:grid-cols-2">

            <label className="flex items-center gap-2 sm:col-span-2">

              <input

                type="checkbox"

                name="announcement.enabled"

                defaultChecked={bar.enabled}

              />

              <span className="admin-field-label mb-0">Barra activa</span>

            </label>



            <label className="flex flex-col gap-1 sm:col-span-2">

              <span className="admin-field-label">Mensaje de la campaña</span>

              <textarea

                className="admin-textarea"

                name="announcement.message"

                rows={3}

                defaultValue={bar.message}

                placeholder="Ej: 15% off en estadías de 7+ noches — código VERANO"

              />

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Texto del enlace (opcional)</span>

              <input

                className="admin-input"

                name="announcement.linkLabel"

                defaultValue={bar.linkLabel}

              />

            </label>

            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Página del enlace</span>

              <select

                className="admin-input"

                name="announcement.href"

                defaultValue={

                  MENU_SITE_ROUTES.some(

                    (r) =>

                      r.href === normalizeInternalHref(bar.href || "/reservas"),

                  )

                    ? normalizeInternalHref(bar.href || "/reservas")

                    : "/reservas"

                }

              >

                {MENU_SITE_ROUTES.map((opt) => (

                  <option key={opt.id} value={opt.href}>

                    {opt.label} ({opt.href})

                  </option>

                ))}

              </select>

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Color de fondo</span>

              <div className="flex gap-2">

                <input

                  type="color"

                  className="h-[42px] w-12 shrink-0 cursor-pointer rounded-lg border border-[var(--admin-border)] bg-white p-1"

                  value={bgColor.startsWith("#") ? bgColor : "#111111"}

                  onChange={(e) => setBgColor(e.target.value)}

                  aria-label="Elegir color de fondo"

                />

                <input

                  className="admin-input font-mono text-sm"

                  name="announcement.backgroundColor"

                  value={bgColor}

                  onChange={(e) => setBgColor(e.target.value)}

                />

              </div>

            </label>

            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Color de texto</span>

              <input

                className="admin-input font-mono text-sm"

                name="announcement.textColor"

                defaultValue={bar.textColor}

              />

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Audiencia</span>

              <select

                className="admin-input"

                name="announcement.audience"

                defaultValue={bar.audience}

              >

                <option value="b2c">Solo B2C (huéspedes)</option>

                <option value="all">Todo el sitio público</option>

              </select>

            </label>



            <label className="flex items-center gap-2 self-end">

              <input

                type="checkbox"

                name="announcement.dismissible"

                defaultChecked={bar.dismissible}

              />

              <span className="admin-field-label mb-0">El usuario puede cerrarla</span>

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Fecha inicio (opcional)</span>

              <input

                type="datetime-local"

                className="admin-input"

                value={startLocal}

                onChange={(e) => setStartLocal(e.target.value)}

              />

            </label>

            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Fecha fin (opcional)</span>

              <input

                type="datetime-local"

                className="admin-input"

                value={endLocal}

                onChange={(e) => setEndLocal(e.target.value)}

              />

            </label>

          </div>

        </section>



        <div className="admin-stats-grid">

          <div className="admin-stat-card">

            <p className="admin-stat-card__label">Motor de reservas</p>

            <p className="admin-stat-card__value">{STICKY_RESERVE_HREF}</p>

            <p className="admin-stat-card__hint">

              Destino fijo del botón flotante B2C

            </p>

          </div>

          <div className="admin-stat-card">

            <p className="admin-stat-card__label">Páginas B2C</p>

            <p className="admin-stat-card__hint mt-2">

              Home, propiedades, blog, club y nosotros muestran el sticky cuando

              está activo.

            </p>

          </div>

          <div className="admin-stat-card">

            <p className="admin-stat-card__label">Configuración rápida</p>

            <ul className="admin-checklist">

              <li>Enlaces B2C validados</li>

              <li>Rutas bloqueadas en el panel</li>

              <li>Barra con fechas opcionales</li>

            </ul>

          </div>

        </div>

      </form>

    </div>

  );

}


