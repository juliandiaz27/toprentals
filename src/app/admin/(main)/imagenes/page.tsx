import { redirect } from "next/navigation";

/** Las imágenes se gestionan en cada página del panel (Home, Corporate, etc.). */
export default function AdminImagesPage() {
  redirect("/admin/paginas/home");
}
