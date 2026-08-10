import { loadPropertiesCatalogEditorState } from "@/lib/properties/catalogEditor";
import { normalizeSiteLanguage } from "@/lib/i18n";
import { PropertiesCatalogManager } from "../../PropertiesCatalogManager";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AdminPropiedadesCatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const language = normalizeSiteLanguage(sp.lang);
  const initial = await loadPropertiesCatalogEditorState(language);
  return (
    <PropertiesCatalogManager key={language} initial={initial} language={language} />
  );
}
