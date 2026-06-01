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
    <div className="admin-images flex w-full flex-col gap-10">
      <header className="admin-page-header">
        <h1>Imágenes del sitio</h1>
        <p>
          Archivos en <code>public/uploads/</code>. Para textos y banner del home usá las
          pestañas de páginas (Header, Home, Footer).
        </p>
      </header>

      {Object.entries(configByCategory).map(([category, slots]) => (
        <section key={category}>
          <h2 className="admin-section-title">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <h2 className="admin-section-title admin-section-title--lg">
              {ENTITY_IMAGE_LABELS[kind]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
