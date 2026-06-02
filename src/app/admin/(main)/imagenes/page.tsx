import { CONFIG_IMAGE_SLOTS } from "@/lib/adminImageSlots";
import { readImageConfig } from "@/lib/imageConfig";
import { ImageUploader } from "../../ImageUploader";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const config = await readImageConfig();

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
    </div>
  );
}
