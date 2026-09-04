"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  MEDIA_UPLOAD_GUIDES,
  validateFileAgainstGuide,
} from "@/lib/mediaUploadGuide";
import { saveUpload } from "@/lib/upload";
import { slugifyPropertyName } from "@/lib/properties/slugify";
import type {
  PropertiesCatalogFile,
  PropertyDetailStored,
  PropertyListingStored,
  PropertyStatStored,
  PropertyUnitStored,
} from "@/lib/properties/catalogTypes";
import { linesFromText } from "@/lib/properties/catalogText";
import { detailHasContent, ensureStats } from "@/lib/properties/detailForm";
import { pickPropiedadesFilters } from "@/lib/pageContent/propiedadesTypes";
import { propertyCityOptionsFromFilters } from "@/lib/pageContent/propertyCityFilters";
import { readPageContent } from "@/lib/pageContent/storage";
import { normalizeSiteLanguage } from "@/lib/i18n";
import { parseElfsightAppId } from "@/lib/elfsight";
import {
  readPropertiesCatalog,
  readPropertiesCatalogSpanish,
  writePropertiesCatalog,
  writePropertiesCatalogEnglishOverlay,
} from "@/lib/properties/catalogStorage";
import type { ActionResult } from "./actions";

async function allowedPropertyCities(): Promise<Set<string>> {
  const content = await readPageContent("propiedades");
  const options = propertyCityOptionsFromFilters(pickPropiedadesFilters(content));
  return new Set(options.length > 0 ? options : ["Buenos Aires", "Quito"]);
}

function parseListingsPayload(
  raw: string,
  validCities: Set<string>,
  language: ReturnType<typeof normalizeSiteLanguage> = "es",
): PropertyListingStored[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;

    const items: PropertyListingStored[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      let slug = String(row.slug ?? "").trim();
      if (!name) continue;
      if (!slug) slug = slugifyPropertyName(name);

      const city = String(row.city ?? "").trim();
      if (!city || !validCities.has(city)) continue;

      const gnahsId = Number(row.gnahsId);
      if (Number.isNaN(gnahsId)) continue;

      const detailRaw = row.detail;
      let detail: PropertyDetailStored | undefined;
      if (detailRaw && typeof detailRaw === "object") {
        const d = detailRaw as Record<string, unknown>;

        const statsRaw = d.stats;
        let stats: PropertyStatStored[] | undefined;
        if (Array.isArray(statsRaw)) {
          stats = ensureStats(
            statsRaw.map((s) => {
              const row = s as Record<string, unknown>;
              return {
                value: String(row.value ?? "").trim(),
                label: String(row.label ?? "").trim(),
              };
            }),
            language,
          );
        }

        const unitsRaw = d.units;
        let units: PropertyUnitStored[] | undefined;
        if (Array.isArray(unitsRaw) && unitsRaw.length > 0) {
          units = unitsRaw
            .map((u) => {
              const row = u as Record<string, unknown>;
              const tourUrl = String(row.tourUrl ?? "").trim();
              return {
                name: String(row.name ?? "").trim(),
                sqm: String(row.sqm ?? "").trim(),
                guests: String(row.guests ?? "").trim(),
                features: String(row.features ?? "").trim(),
                ...(tourUrl ? { tourUrl } : {}),
              };
            })
            .filter((u) => u.name);
        }

        const relatedRaw = d.relatedSlugs;
        const relatedSlugs = Array.isArray(relatedRaw)
          ? relatedRaw.map((s) => String(s).trim()).filter(Boolean)
          : linesFromText(String(d.relatedSlugsText ?? ""));

        const galleryRaw = d.galleryImages;
        const galleryImages = Array.isArray(galleryRaw)
          ? galleryRaw.map((s) => String(s).trim()).filter(Boolean)
          : undefined;

        detail = {
          subtitle: String(d.subtitle ?? "").trim() || undefined,
          about: String(d.about ?? "").trim() || undefined,
          tags: Array.isArray(d.tags)
            ? d.tags.map((t) => String(t).trim()).filter(Boolean)
            : linesFromText(String(d.tagsText ?? "")),
          poiLines: Array.isArray(d.poiLines)
            ? d.poiLines.map((t) => String(t).trim()).filter(Boolean)
            : linesFromText(String(d.poiLinesText ?? "")),
          groupsHeadline: String(d.groupsHeadline ?? "").trim() || undefined,
          groupsDescription: String(d.groupsDescription ?? "").trim() || undefined,
          groupsCtaLabel: String(d.groupsCtaLabel ?? "").trim() || undefined,
          groupsCtaHref: String(d.groupsCtaHref ?? "").trim() || undefined,
          stats,
          units,
          galleryImages: galleryImages?.length ? galleryImages : undefined,
          relatedSlugs: relatedSlugs.length ? relatedSlugs : undefined,
        };

        if (!detailHasContent(detail)) {
          detail = undefined;
        }
      }

      items.push({
        slug,
        gnahsId,
        name,
        city,
        neighborhood: String(row.neighborhood ?? "").trim(),
        address: String(row.address ?? "").trim(),
        imageSrc: String(row.imageSrc ?? "").trim(),
        comingSoon: row.comingSoon === true || row.comingSoon === "true",
        hidden: row.hidden === true || row.hidden === "true",
        hasOffer: row.hasOffer === true || row.hasOffer === "true",
        isPopular: row.isPopular === true || row.isPopular === "true",
        elfsightReviewsAppId:
          parseElfsightAppId(
            String(row.elfsightReviewsAppId ?? row.elfsightReviewsEmbed ?? ""),
          ) || undefined,
        detail,
      });
    }

    return items;
  } catch {
    return null;
  }
}

function parseFeaturedSlugs(raw: string): string[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((s) => String(s).trim()).filter(Boolean);
  } catch {
    return null;
  }
}

/** Campos no traducibles (p. ej. Elfsight) se guardan siempre en el catálogo ES. */
async function syncStructuralFieldsToSpanish(
  drafts: PropertyListingStored[],
): Promise<void> {
  const spanish = await readPropertiesCatalogSpanish();
  let changed = false;
  const bySlug = new Map(drafts.map((d) => [d.slug, d]));
  const listings = spanish.listings.map((item) => {
    const draft = bySlug.get(item.slug);
    if (!draft) return item;
    const nextId = draft.elfsightReviewsAppId?.trim() || undefined;
    const prevId = item.elfsightReviewsAppId?.trim() || undefined;
    if (nextId === prevId) return item;
    changed = true;
    const next = { ...item };
    if (nextId) next.elfsightReviewsAppId = nextId;
    else delete next.elfsightReviewsAppId;
    return next;
  });
  if (changed) {
    await writePropertiesCatalog({ ...spanish, listings });
  }
}

export async function savePropertiesCatalog(
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const language = normalizeSiteLanguage(formData.get("language"));

    const validCities = await allowedPropertyCities();
    const listings = parseListingsPayload(
      String(formData.get("catalog.listings") ?? ""),
      validCities,
      language,
    );
    if (!listings || listings.length === 0) {
      return {
        ok: false,
        error:
          "Agregá al menos una propiedad con ciudad válida (definida en Páginas → Propiedades → Filtros).",
      };
    }

    const slugs = new Set<string>();
    for (const item of listings) {
      if (slugs.has(item.slug)) {
        return { ok: false, error: `Slug duplicado: ${item.slug}` };
      }
      slugs.add(item.slug);
    }

    if (language === "en") {
      await syncStructuralFieldsToSpanish(listings);
      await writePropertiesCatalogEnglishOverlay(listings);
      const merged = await readPropertiesCatalog("en");
      revalidatePath("/");
      revalidatePath("/propiedades");
      for (const item of merged.listings) {
        revalidatePath(`/propiedades/${item.slug}`);
      }
      return {
        ok: true,
        listings: merged.listings,
        featuredSlugs: merged.featuredSlugs,
      };
    }

    const featuredSlugs =
      parseFeaturedSlugs(String(formData.get("catalog.featuredSlugs") ?? "")) ?? [];

    const catalog: PropertiesCatalogFile = {
      listings,
      featuredSlugs: featuredSlugs.filter((slug) => slugs.has(slug)).slice(0, 5),
    };

    const imageFile = formData.get("__imageFile");
    const imageSlug = String(formData.get("__imageSlug") ?? "").trim();
    if (imageFile instanceof File && imageFile.size > 0 && imageSlug) {
      const listingGuide = MEDIA_UPLOAD_GUIDES.propertyListing;
      const listingError = validateFileAgainstGuide(imageFile, listingGuide);
      if (listingError) {
        return { ok: false, error: `Imagen de listado: ${listingError}` };
      }
      const url = await saveUpload(imageFile, `property-${imageSlug}`, {
        maxSizeMb: listingGuide.maxSizeMb,
      });
      const idx = catalog.listings.findIndex((p) => p.slug === imageSlug);
      if (idx >= 0) {
        catalog.listings[idx] = { ...catalog.listings[idx]!, imageSrc: url };
      }
    }

    const gallerySlug = String(formData.get("__gallerySlug") ?? "").trim();
    const galleryFiles = formData
      .getAll("__galleryFile")
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (gallerySlug && galleryFiles.length > 0) {
      const idx = catalog.listings.findIndex((p) => p.slug === gallerySlug);
      if (idx >= 0) {
        const item = catalog.listings[idx]!;
        const existing = item.detail?.galleryImages ?? [];
        const uploaded: string[] = [];
        const galleryGuide = MEDIA_UPLOAD_GUIDES.propertyGallery;
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i]!;
          const galleryError = validateFileAgainstGuide(file, galleryGuide);
          if (galleryError) {
            return {
              ok: false,
              error: `Galería (foto ${i + 1}): ${galleryError}`,
            };
          }
          const url = await saveUpload(
            file,
            `property-${gallerySlug}-gallery-${Date.now()}-${i}`,
            { maxSizeMb: galleryGuide.maxSizeMb },
          );
          uploaded.push(url);
        }
        catalog.listings[idx] = {
          ...item,
          detail: {
            ...item.detail,
            galleryImages: [...existing, ...uploaded],
          },
        };
      }
    }

    await writePropertiesCatalog(catalog);

    revalidatePath("/");
    revalidatePath("/propiedades");
    for (const item of listings) {
      revalidatePath(`/propiedades/${item.slug}`);
    }

    return {
      ok: true,
      listings: catalog.listings,
      featuredSlugs: catalog.featuredSlugs,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar propiedades",
    };
  }
}
