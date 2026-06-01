import { readEgresados } from "@/lib/egresadosData";
import { saveEgresado, deleteEgresado } from "../../actions";
import { EntityCrudSkeleton } from "../../EntityCrudSkeleton";

export const dynamic = "force-dynamic";

export default async function AdminEgresadosPage() {
  const data = await readEgresados();
  return (
      <EntityCrudSkeleton
        title="Egresados"
        description="Gestioná egresados destacados y sus fotos."
        entityLabel="egresado"
        items={data.items}
        saveAction={saveEgresado}
        deleteAction={deleteEgresado}
        listColumns={[
          { key: "name", label: "Nombre" },
          { key: "career", label: "Carrera" },
          { key: "year", label: "Año" },
        ]}
        fields={[
          { name: "name", label: "Nombre", required: true },
          { name: "career", label: "Carrera", required: true },
          { name: "year", label: "Año", type: "number" },
          { name: "image", label: "Foto", type: "file" },
        ]}
      />
  );
}
