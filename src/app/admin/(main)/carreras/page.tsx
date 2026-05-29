import { readCarreras } from "@/lib/carrerasData";
import { saveCarrera, deleteCarrera } from "../../actions";
import { EntityCrudSkeleton } from "../../EntityCrudSkeleton";

export const dynamic = "force-dynamic";

const programFields = [
  { name: "title", label: "Título", required: true, autoSlugFrom: "title" },
  { name: "slug", label: "Slug (vacío = auto)" },
  { name: "modalidad", label: "Modalidad" },
  { name: "duracion", label: "Duración" },
  { name: "location", label: "Ubicación" },
  { name: "description", label: "Descripción", type: "textarea" as const },
  { name: "requisitos", label: "Requisitos", type: "textarea" as const },
  { name: "visible", label: "Visible en el sitio", type: "checkbox" as const },
  { name: "image", label: "Imagen", type: "file" as const },
];

export default async function AdminCarrerasPage() {
  const data = await readCarreras();
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Carreras</h1>
      <EntityCrudSkeleton
        title="Carreras"
        entityLabel="carrera"
        items={data.items}
        saveAction={saveCarrera}
        deleteAction={deleteCarrera}
        listColumns={[
          { key: "title", label: "Título" },
          { key: "slug", label: "Slug" },
          { key: "visible", label: "Visible" },
        ]}
        fields={programFields}
      />
    </div>
  );
}
