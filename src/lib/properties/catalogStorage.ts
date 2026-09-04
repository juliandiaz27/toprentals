import fs from "fs/promises";
import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";
import {
  buildCatalogEnglishOverlay,
  mergeCatalogListings,
} from "./catalogOverlay";
import type {
  PropertiesCatalogEnOverlay,
  PropertiesCatalogFile,
  PropertyListingStored,
} from "./catalogTypes";

const DEFAULT_CATALOG: PropertiesCatalogFile = {
  featuredSlugs: [
    "belgrano",
    "wow-nunez",
    "dorrego",
    "montaneses",
    "qorner",
  ],
  listings: [],
};

const DEFAULT_EN_OVERLAY: PropertiesCatalogEnOverlay = { properties: [] };

function catalogFilePath(): string {
  return dataFilePath("properties-catalog.json");
}

function catalogEnFilePath(): string {
  return dataFilePath("properties-catalog.en.json");
}

async function readCatalogFromDeployedDisk(): Promise<PropertiesCatalogFile | null> {
  try {
    const raw = await fs.readFile(catalogFilePath(), "utf-8");
    const data = JSON.parse(raw) as PropertiesCatalogFile;
    return {
      featuredSlugs: Array.isArray(data.featuredSlugs) ? data.featuredSlugs : [],
      listings: Array.isArray(data.listings) ? data.listings : [],
    };
  } catch {
    return null;
  }
}

/**
 * En Vercel, Blob puede pisar el array `listings` del repo y perder
 * `elfsightReviewsAppId` si el Blob se guardó antes de ese campo.
 * Recuperamos esos IDs desde el JSON del deploy cuando falten.
 */
function backfillStructuralFieldsFromDisk(
  effective: PropertiesCatalogFile,
  disk: PropertiesCatalogFile | null,
): PropertiesCatalogFile {
  if (!disk?.listings?.length) return effective;

  const elfsightBySlug = new Map<string, string>();
  for (const item of disk.listings) {
    const id = String(item.elfsightReviewsAppId ?? "").trim();
    if (id) elfsightBySlug.set(item.slug, id);
  }
  if (elfsightBySlug.size === 0) return effective;

  let changed = false;
  const listings: PropertyListingStored[] = effective.listings.map((item) => {
    if (String(item.elfsightReviewsAppId ?? "").trim()) return item;
    const id = elfsightBySlug.get(item.slug);
    if (!id) return item;
    changed = true;
    return { ...item, elfsightReviewsAppId: id };
  });

  return changed ? { ...effective, listings } : effective;
}

async function readSpanishCatalog(): Promise<PropertiesCatalogFile> {
  const [data, disk] = await Promise.all([
    readJsonFile<PropertiesCatalogFile>(catalogFilePath(), DEFAULT_CATALOG),
    readCatalogFromDeployedDisk(),
  ]);
  const normalized: PropertiesCatalogFile = {
    featuredSlugs: Array.isArray(data.featuredSlugs) ? data.featuredSlugs : [],
    listings: Array.isArray(data.listings) ? data.listings : [],
  };
  return backfillStructuralFieldsFromDisk(normalized, disk);
}

async function readEnglishOverlay(): Promise<PropertiesCatalogEnOverlay> {
  const data = await readJsonFile<PropertiesCatalogEnOverlay>(
    catalogEnFilePath(),
    DEFAULT_EN_OVERLAY,
  );
  return {
    properties: Array.isArray(data.properties) ? data.properties : [],
  };
}

export async function readPropertiesCatalog(
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): Promise<PropertiesCatalogFile> {
  const spanish = await readSpanishCatalog();
  if (language === "en") {
    const overlay = await readEnglishOverlay();
    if (overlay.properties.length > 0) {
      return {
        ...spanish,
        listings: mergeCatalogListings(spanish.listings, overlay),
      };
    }
  }
  return spanish;
}

/** Lee el catálogo español sin overlay (para diff al guardar EN). */
export async function readPropertiesCatalogSpanish(): Promise<PropertiesCatalogFile> {
  return readSpanishCatalog();
}

export async function writePropertiesCatalog(
  data: PropertiesCatalogFile,
): Promise<void> {
  await writeJsonFile(catalogFilePath(), data);
}

/**
 * Persiste solo el overlay inglés (campos de texto distintos del español).
 * No modifica `properties-catalog.json`.
 */
export async function writePropertiesCatalogEnglishOverlay(
  draftListings: PropertiesCatalogFile["listings"],
): Promise<void> {
  const spanish = await readSpanishCatalog();
  const overlay = buildCatalogEnglishOverlay(spanish.listings, draftListings);
  await writeJsonFile(catalogEnFilePath(), overlay);
}
