import { readCursos } from "@/lib/cursosData";
import { saveCurso, deleteCurso } from "../../actions";
import { EntityCrudSkeleton } from "../../EntityCrudSkeleton";

export const dynamic = "force-dynamic";

const programFields = [
  { name: "title", label: "Título", required: true, autoSlugFrom: "title" },
  { name: "slug", label: "Slug (vacío = auto)" },
  { name: "modalidad", label: "Modalidad" },
  { name: "duracion", label: "Duración" },
  { name: "location", label: "Ubicación" },
  { name: "description", label: "Descripción", type: "textarea" as const },
  { name: "visible", label: "Visible", type: "checkbox" as const },
  { name: "image", label: "Imagen", type: "file" as const },
];

export default async function AdminCursosPage() {
  const data = await readCursos();
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Cursos</h1>
      <EntityCrudSkeleton
        title="Cursos"
        entityLabel="curso"
        items={data.items}
        saveAction={saveCurso}
        deleteAction={deleteCurso}
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
