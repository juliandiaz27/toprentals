import {
  CONFIG_IMAGE_SLOTS,
  ENTITY_IMAGE_LABELS,
  type EntityImageKind,
} from "@/lib/adminImageSlots";
import { readImageConfig } from "@/lib/imageConfig";
import { readProfesores } from "@/lib/profesoresData";
import { readEgresados } from "@/lib/egresadosData";
import { readCarreras } from "@/lib/carrerasData";
import { readCursos } from "@/lib/cursosData";
import { readPostitulos } from "@/lib/postitulosData";
import { ImageUploader } from "../../ImageUploader";
import { EntityImageUploader } from "../../EntityImageUploader";

export const dynamic = "force-dynamic";

type EntityRow = { id: string; label: string; imageSrc: string };

async function loadEntityRows(): Promise<Record<EntityImageKind, EntityRow[]>> {
  const [profesores, egresados, carreras, cursos, postitulos] = await Promise.all([
    readProfesores(),
    readEgresados(),
    readCarreras(),
    readCursos(),
    readPostitulos(),
  ]);

  return {
    profesores: profesores.items.map((p) => ({
      id: p.id,
      label: p.name,
      imageSrc: p.imageSrc,
    })),
    egresados: egresados.items.map((e) => ({
      id: e.id,
      label: e.name,
      imageSrc: e.imageSrc,
    })),
    carreras: carreras.items.map((c) => ({
      id: c.id,
      label: c.title,
      imageSrc: c.imageSrc,
    })),
    cursos: cursos.items.map((c) => ({
      id: c.id,
      label: c.title,
      imageSrc: c.imageSrc,
    })),
    postitulos: postitulos.items.map((p) => ({
      id: p.id,
      label: p.title,
      imageSrc: p.imageSrc,
    })),
  };
}

export default async function AdminImagesPage() {
  const [config, entityRows] = await Promise.all([
    readImageConfig(),
    loadEntityRows(),
  ]);

  const configByCategory = CONFIG_IMAGE_SLOTS.reduce<
    Record<string, typeof CONFIG_IMAGE_SLOTS>
  >((acc, slot) => {
    if (!acc[slot.category]) acc[slot.category] = [];
    acc[slot.category].push(slot);
    return acc;
  }, {});

  return (
    <div className="admin-images flex flex-col gap-10">
      <section>
        <h1 className="text-xl font-semibold text-neutral-900">Imágenes globales</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Slots técnicos (heroes compartidos, etc.). Para textos y banner de cada página usá{" "}
          <strong>Páginas → Home</strong> en el menú lateral.
        </p>
      </section>

      {Object.entries(configByCategory).map(([category, slots]) => (
        <section key={category}>
          <h2 className="mb-1 text-lg font-medium text-neutral-800">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <ImageUploader
                key={slot.key}
                slotKey={slot.key}
                label={slot.label}
                hint={slot.hint}
                currentUrl={config[slot.key] ?? slot.fallback}
                fallback={slot.fallback}
              />
            ))}
          </div>
        </section>
      ))}

      {(Object.keys(ENTITY_IMAGE_LABELS) as EntityImageKind[]).map((kind) => {
        const rows = entityRows[kind];
        if (rows.length === 0) return null;
        return (
          <section key={kind}>
            <h2 className="mb-1 text-lg font-medium text-neutral-800">
              {ENTITY_IMAGE_LABELS[kind]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {rows.map((row) => (
                <EntityImageUploader
                  key={row.id}
                  entity={kind}
                  id={row.id}
                  label={row.label}
                  currentSrc={row.imageSrc}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
