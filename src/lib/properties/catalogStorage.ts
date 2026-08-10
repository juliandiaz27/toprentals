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

async function readSpanishCatalog(): Promise<PropertiesCatalogFile> {
  const data = await readJsonFile<PropertiesCatalogFile>(
    catalogFilePath(),
    DEFAULT_CATALOG,
  );
  return {
    featuredSlugs: Array.isArray(data.featuredSlugs) ? data.featuredSlugs : [],
    listings: Array.isArray(data.listings) ? data.listings : [],
  };
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
