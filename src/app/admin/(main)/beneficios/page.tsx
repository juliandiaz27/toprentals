import { readBeneficios } from "@/lib/beneficiosData";
import { saveBeneficio, deleteBeneficio } from "../../actions";
import { EntityCrudSkeleton } from "../../EntityCrudSkeleton";

export const dynamic = "force-dynamic";

export default async function AdminBeneficiosPage() {
  const data = await readBeneficios();
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Beneficios</h1>
      <EntityCrudSkeleton
        title="Beneficios"
        entityLabel="beneficio"
        items={data.items}
        saveAction={saveBeneficio}
        deleteAction={deleteBeneficio}
        listColumns={[
          { key: "title", label: "Título" },
          { key: "discount", label: "Descuento" },
          { key: "visible", label: "Visible" },
        ]}
        fields={[
          { name: "title", label: "Título", required: true },
          { name: "discount", label: "Descuento" },
          { name: "url", label: "URL" },
          { name: "visible", label: "Visible", type: "checkbox" },
          { name: "image", label: "Imagen", type: "file" },
        ]}
      />
    </div>
  );
}
