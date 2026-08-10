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
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import { DEFAULT_SITE_LANGUAGE, type SiteLanguage } from "@/lib/i18n";



type Props = {

  initial: MarketingConfigFile;

  language?: SiteLanguage;

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



export function MarketingManager({
  initial,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {

  const router = useRouter();
  const isEn = language === "en";

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [pending, startTransition] = useTransition();

  const [startLocal, setStartLocal] = useState(

    toDatetimeLocal(initial.announcementBar.startAt),

  );

  const [endLocal, setEndLocal] = useState(

    toDatetimeLocal(initial.announcementBar.endAt),

  );

  const [popupStartLocal, setPopupStartLocal] = useState(

    toDatetimeLocal(initial.scrollPopup.startAt),

  );

  const [popupEndLocal, setPopupEndLocal] = useState(

    toDatetimeLocal(initial.scrollPopup.endAt),

  );

  const [bgColor, setBgColor] = useState(

    initial.announcementBar.backgroundColor || "#111111",

  );



  const sticky = initial.stickyReserve;

  const bar = initial.announcementBar;

  const popup = initial.scrollPopup;



  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    setError(null);

    setSuccess(null);

    const fd = new FormData(e.currentTarget);

    fd.set("announcement.startAt", fromDatetimeLocal(startLocal));

    fd.set("announcement.endAt", fromDatetimeLocal(endLocal));

    fd.set("popup.startAt", fromDatetimeLocal(popupStartLocal));

    fd.set("popup.endAt", fromDatetimeLocal(popupEndLocal));



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

            Botón flotante de reserva en páginas B2C, barra de campañas y popup al

            scrollear. No aplica en Corporativo ni landings B2B.

          </p>

        </div>

        <div className="admin-page-header__actions flex flex-wrap items-center gap-3">

          <AdminLanguageSwitcher language={language} />

          <span className="text-xs text-[var(--admin-text-dim)]">
            Editando {isEn ? "inglés" : "español"}
          </span>

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

        <input type="hidden" name="language" value={language} />

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

              {!isEn ? (
              <label className="flex flex-col gap-1">
                <span className="admin-field-label">Texto del botón</span>
                <input className="admin-input" name="sticky.label" defaultValue={sticky.label} />
              </label>
            ) : (
              <input type="hidden" name="sticky.label" defaultValue={sticky.label} />
            )}
{isEn ? (
              <label className="flex flex-col gap-1">
                <span className="admin-field-label">Texto del botón (EN)</span>
                <input className="admin-input" name="sticky.labelEn" defaultValue={sticky.labelEn} />
              </label>
            ) : (
              <input type="hidden" name="sticky.labelEn" defaultValue={sticky.labelEn} />
            )}

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



            {!isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Mensaje</span>
              <textarea className="admin-textarea" name="announcement.message" rows={3} defaultValue={bar.message} />
            </label>
          ) : (
            <input type="hidden" name="announcement.message" defaultValue={bar.message} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Mensaje (EN)</span>
              <textarea className="admin-textarea" name="announcement.messageEn" rows={3} defaultValue={bar.messageEn} />
            </label>
          ) : (
            <input type="hidden" name="announcement.messageEn" defaultValue={bar.messageEn} />
          )}



            {!isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Texto del link</span>
              <input className="admin-input" name="announcement.linkLabel" defaultValue={bar.linkLabel} />
            </label>
          ) : (
            <input type="hidden" name="announcement.linkLabel" defaultValue={bar.linkLabel} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Texto del link (EN)</span>
              <input className="admin-input" name="announcement.linkLabelEn" defaultValue={bar.linkLabelEn} />
            </label>
          ) : (
            <input type="hidden" name="announcement.linkLabelEn" defaultValue={bar.linkLabelEn} />
          )}

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



        <section className="admin-section-card">

          <div className="admin-section-card__head">

            <h2 className="admin-section-title">Popup al scrollear</h2>

          </div>

          <div className="admin-section-card__body grid max-w-2xl gap-4 sm:grid-cols-2">

            <label className="flex items-center gap-2 sm:col-span-2">

              <input

                type="checkbox"

                name="popup.enabled"

                defaultChecked={popup.enabled}

              />

              <span className="admin-field-label mb-0">Popup activo</span>

            </label>



            <div className="admin-callout sm:col-span-2" role="note">

              <IconInfo />

              <p>

                Aparece cuando el visitante scrollea más allá del umbral configurado.

                Si lo cierra, no vuelve a mostrarse hasta el día siguiente (por

                navegador). Requiere título y texto del botón.

              </p>

            </div>
            {!isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Título</span>
              <input
                className="admin-input"
                name="popup.title"
                defaultValue={popup.title}
                placeholder="Ej: Encontrá tu próximo departamento"
              />
            </label>
          ) : (
            <input type="hidden" name="popup.title" defaultValue={popup.title} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Título (EN)</span>
              <input
                className="admin-input"
                name="popup.titleEn"
                defaultValue={popup.titleEn}
                placeholder="E.g. Find your next apartment"
              />
            </label>
          ) : (
            <input type="hidden" name="popup.titleEn" defaultValue={popup.titleEn} />
          )}
            {!isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Descripción</span>
              <textarea
                className="admin-textarea"
                name="popup.description"
                rows={3}
                defaultValue={popup.description}
                placeholder="Ej: Departamentos amoblados en Palermo, Recoleta y más."
              />
            </label>
          ) : (
            <input type="hidden" name="popup.description" defaultValue={popup.description} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Descripción (EN)</span>
              <textarea
                className="admin-textarea"
                name="popup.descriptionEn"
                rows={3}
                defaultValue={popup.descriptionEn}
                placeholder="E.g. Furnished apartments in Palermo, Recoleta and more."
              />
            </label>
          ) : (
            <input type="hidden" name="popup.descriptionEn" defaultValue={popup.descriptionEn} />
          )}
            {!isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Dato destacado (opcional)</span>
              <input
                className="admin-input"
                name="popup.highlight"
                defaultValue={popup.highlight}
                placeholder="Ej: Más de 45 edificios en Buenos Aires"
              />
              <span className="admin-field-hint mb-0">
                Aparece debajo de la descripción, antes de los botones.
              </span>
            </label>
          ) : (
            <input type="hidden" name="popup.highlight" defaultValue={popup.highlight} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Dato destacado (EN)</span>
              <input
                className="admin-input"
                name="popup.highlightEn"
                defaultValue={popup.highlightEn}
                placeholder="E.g. More than 45 buildings in Buenos Aires"
              />
            </label>
          ) : (
            <input type="hidden" name="popup.highlightEn" defaultValue={popup.highlightEn} />
          )}



            <label className="flex flex-col gap-1 sm:col-span-2">

              <span className="admin-field-label">Imagen (opcional)</span>

              <input

                className="admin-input font-mono text-sm"

                name="popup.imageUrl"

                defaultValue={popup.imageUrl}

                placeholder="/images/properties/placeholder-lobby.png"

              />

              <span className="admin-field-hint mb-0">

                Medida recomendada: 1000 × 800 px (4:3 aprox.), horizontal o

                cuadrada · JPG, PNG o WebP · máx. 1 MB. La imagen se recorta

                centrada, dejá el motivo principal al centro. Ruta del sitio o

                URL de /admin/imagenes. Si está vacío se usa una imagen por

                defecto.

              </span>

            </label>
            {!isEn ? (
            <label className="flex flex-col gap-1">
              <span className="admin-field-label">Texto del botón</span>
              <input className="admin-input" name="popup.ctaLabel" defaultValue={popup.ctaLabel} />
            </label>
          ) : (
            <input type="hidden" name="popup.ctaLabel" defaultValue={popup.ctaLabel} />
          )}
{isEn ? (
            <label className="flex flex-col gap-1">
              <span className="admin-field-label">Texto del botón (EN)</span>
              <input
                className="admin-input"
                name="popup.ctaLabelEn"
                defaultValue={popup.ctaLabelEn}
                placeholder="View properties"
              />
            </label>
          ) : (
            <input type="hidden" name="popup.ctaLabelEn" defaultValue={popup.ctaLabelEn} />
          )}

            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Destino del botón</span>

              <select

                className="admin-input"

                name="popup.ctaHref"

                defaultValue={

                  MENU_SITE_ROUTES.some(

                    (r) =>

                      r.href ===

                      normalizeInternalHref(popup.ctaHref || "/propiedades"),

                  )

                    ? normalizeInternalHref(popup.ctaHref || "/propiedades")

                    : "/propiedades"

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

              <span className="admin-field-label">Umbral de scroll (px)</span>

              <input

                className="admin-input"

                type="number"

                name="popup.scrollThreshold"

                min={0}

                step={50}

                defaultValue={popup.scrollThreshold}

              />

              <span className="admin-field-hint mb-0">

                Píxeles verticales antes de mostrar el popup (ej. 480).

              </span>

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Audiencia</span>

              <select

                className="admin-input"

                name="popup.audience"

                defaultValue={popup.audience}

              >

                <option value="b2c">Solo B2C (huéspedes)</option>

                <option value="all">Todo el sitio público</option>

              </select>

            </label>



            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Fecha inicio (opcional)</span>

              <input

                type="datetime-local"

                className="admin-input"

                value={popupStartLocal}

                onChange={(e) => setPopupStartLocal(e.target.value)}

              />

            </label>

            <label className="flex flex-col gap-1">

              <span className="admin-field-label">Fecha fin (opcional)</span>

              <input

                type="datetime-local"

                className="admin-input"

                value={popupEndLocal}

                onChange={(e) => setPopupEndLocal(e.target.value)}

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

              <li>Popup al scroll (1 vez por día si cierran)</li>

            </ul>

          </div>

        </div>

      </form>

    </div>

  );

}


