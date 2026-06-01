import { readPostitulos } from "@/lib/postitulosData";
import { savePostitulo, deletePostitulo } from "../../actions";
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

export default async function AdminPostitulosPage() {
  const data = await readPostitulos();
  return (
      <EntityCrudSkeleton
        title="Postítulos"
        description="Gestioná postítulos: contenido, imágenes y visibilidad."
        entityLabel="postítulo"
        items={data.items}
        saveAction={savePostitulo}
        deleteAction={deletePostitulo}
        listColumns={[
          { key: "title", label: "Título" },
          { key: "slug", label: "Slug" },
          { key: "visible", label: "Visible" },
        ]}
        fields={programFields}
      />
  );
}
