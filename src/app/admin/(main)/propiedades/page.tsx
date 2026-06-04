import { loadPropertiesCatalogEditorState } from "@/lib/properties/catalogEditor";
import { PropertiesCatalogManager } from "../../PropertiesCatalogManager";

export const dynamic = "force-dynamic";

export default async function AdminPropiedadesCatalogPage() {
  const initial = await loadPropertiesCatalogEditorState();
  return <PropertiesCatalogManager initial={initial} />;
}
